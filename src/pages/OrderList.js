// src/pages/OrderList.js
import { useEffect, useState } from "react";
import axios from "axios";

function OrderList({ user }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            setError("로그인이 필요합니다.");
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:9000/order/list", {
                    params: { memberId: user.id }, // 로그인한 회원 id
                    withCredentials: true,
                });
                setOrders(response.data);
            } catch (err) {
                setError("주문 목록을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) return <div className="p-4">⏳ 주문 목록을 불러오는 중...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">🧾 주문 내역</h2>

            {orders.length === 0 ? (
                <p className="text-gray-500">주문 내역이 없습니다.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.orderId} className="border rounded-xl p-4 shadow">
                            <div className="flex justify-between">
                                <span className="font-semibold">주문번호: {order.orderId}</span>
                                <span className="text-sm text-gray-500">{order.orderDate}</span>
                            </div>
                            <div className="text-sm mt-1">
                                상태: <span className="font-medium">{order.status}</span>
                            </div>

                            <ul className="mt-2 list-disc list-inside text-sm">
                                {order.orderItems.map((item, index) => (
                                    <li key={index}>
                                        {item.productName} × {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderList;
