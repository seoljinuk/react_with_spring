import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Col, Container, Row, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../config/config";

function App({ user }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // 주문 목록 불러오기
    useEffect(() => {
        if (!user) {
            setError("로그인이 필요합니다.");
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/order/list`, {
                    params: { memberId: user.id }, // 로그인한 회원 id
                    withCredentials: true,
                });
                setOrders(response.data);
            } catch (err) {
                console.log(err);
                setError("주문 목록을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">주문 목록을 불러오는 중입니다.</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="my-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }
	
	
// 관리자 버튼 컴포넌트/함수
	const makeAdminButtons = (order, user, navigate, setOrders) => {
		if (user?.role !== "ADMIN") return null;

		return (
			<div className="d-flex justify-content-end mt-3">
				<Button
					variant="warning"
					size="sm"
					className="me-2"
					onClick={() => navigate(`/order/update/${order.orderId}`)}
				>
					수정
				</Button>
				<Button
					variant="danger"
					size="sm"
					onClick={async () => {
						const confirmDelete = window.confirm(
							`주문번호 ${order.orderId}을(를) 삭제하시겠습니까?`
						);
						if (!confirmDelete) return;

						try {
							await axios.delete(`${API_BASE_URL}/order/delete/${order.orderId}`);
							alert(`주문번호 ${order.orderId} 삭제 완료`);
							setOrders((prev) => prev.filter((o) => o.orderId !== order.orderId));
						} catch (error) {
							console.log(error);
							alert("주문 삭제 실패");
						}
					}}
				>
					삭제
				</Button>
			</div>
		);
	};	

    return (
        <Container className="my-4">
            <h1 className="my-4">🧾 주문 내역</h1>

            {orders.length === 0 ? (
                <Alert variant="secondary">주문 내역이 없습니다.</Alert>
            ) : (
                <Row>
                    {orders.map((order) => (
                        <Col key={order.orderId} md={6} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        <Card.Title>주문번호: {order.orderId}</Card.Title>
                                        <small className="text-muted">{order.orderDate}</small>
                                    </div>
                                    <Card.Text>
                                        상태: <strong>{order.status}</strong>
                                    </Card.Text>

                                    <ul style={{ paddingLeft: "20px" }}>
                                        {order.orderItems.map((item, index) => (
                                            <li key={index}>
                                                {item.productName} × {item.quantity}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* 관리자 전용 버튼 */}
									{makeAdminButtons(order, user, navigate, setOrders)}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default App;







---------------------------------------------------------------------------------------




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

    {/* Tailwind = “꼬리 바람”
        항공이나 항해에서 뒤에서 불어오는 바람을 의미합니다.
        꼬리 바람이 있으면 배나 비행기가 더 빨리 나아갈 수 있듯이,
        Tailwind CSS도 개발자가 웹 UI를 빠르게 만들 수 있도록 도와준다는 의미로 붙여졌습니다. 
    */}

    {/* Tailwind CSS  : https://tailwindcss.com/docs/installation/using-vite */ }

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
