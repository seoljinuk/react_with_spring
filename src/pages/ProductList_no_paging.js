import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function App({ user }) {
    /* user === 'ADMIN'이면 [상품 등록], [수정], [삭제] 메뉴가 보여야 합니다. */

    const [products, setProducts] = useState([]); // 상품 목록 state

    useEffect(() => { // backend 서버에서 데이터 읽어 오기
        axios.get('http://localhost:9000/product/list')
            .then((response) => {
                console.log('response.data');
                console.log(response.data);

                setProducts(response.data || []); // 안전한 기본 값 설정
            })
            .catch((error) => {
                console.error(error);
            });
    }, []); // 2번째 매개 변수 []로 인하여 딱 1번만 rendering합니다. 

    const navigate = useNavigate();

    return (
        <Container className="my-4">
            <h1 className="my-4">상품 목록 페이지</h1>
            <Link to={`/product/insert`}>
                {user?.role === 'ADMIN' && (
                    <Button variant="primary" className="mb-3">
                        상품 등록
                    </Button>
                )}
            </Link>
            <Row>
                {products.map((product) => (
                    <Col key={product.id} md={4} className="mb-4">
                        <Card className="h-100"
                            onClick={() => navigate(`/product/detail/${product.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Img
                                variant="top"
                                src={`http://localhost:9000/images/${product.image}`}
                                alt={product.name}
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>가격 : {product.price}원</Card.Text>
                                {user?.role === 'ADMIN' && (
                                    <div className="d-flex justify-content-center">
                                        <Button
                                            variant="warning"
                                            className="me-2"
                                            onClick={(event) => {
                                                event.stopPropagation(); // Card Click Event 방지 
                                                navigate(`/product/update/${product.id}`);
                                            }}
                                        >
                                            수정
                                        </Button>
                                        <Button variant="danger" className="me-2">삭제</Button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default App;