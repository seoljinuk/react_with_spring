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
            {/* Tailwind = “꼬리 바람”

항공이나 항해에서 뒤에서 불어오는 바람을 의미합니다.

꼬리 바람이 있으면 배나 비행기가 더 빨리 나아갈 수 있듯이,
Tailwind CSS도 개발자가 웹 UI를 빠르게 만들 수 있도록 도와준다는 의미로 붙여졌습니다. */}

            {/* Tailwind CSS  : https://tailwindcss.com/docs/installation/using-vite */}
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
