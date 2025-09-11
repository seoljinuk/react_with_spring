// ProductDelete.js
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from './../config';

function ProductDelete({ user }) {
    const { id } = useParams(); // 상품 ID
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/product/detail/${id}`)
            .then((response) => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                alert("상품 정보를 불러오는 중 오류가 발생했습니다.");
                navigate(-1);
            });
    }, [id, navigate]);

    const getCategoryDescription = (category) => {
        switch (category) {
            case 'BREAD': return `빵(${category})`;
            case 'BEVERAGE': return `음료수(${category})`;
            case 'CAKE': return `케익(${category})`;
            default: return `기타(${category})`;
        }
    };

    const deleteProduct = async () => {
        if (!user || user.role !== 'ADMIN') {
            alert("삭제 권한이 없습니다.");
            return;
        }

        if (!window.confirm(`${product.name} 상품을 정말 삭제하시겠습니까?`)) return;

        try {
            await axios.delete(`${API_BASE_URL}/product/${id}`);
            alert(`${product.name} 상품이 삭제되었습니다.`);
            navigate('/product/list');
        } catch (error) {
            console.log(error);
            alert('상품 삭제 실패: ' + (error.response?.data || error.message));
        }
    };

    if (loading) {
        return <Container className="my-4 text-center"><h3>상품 정보를 읽어오는 중입니다.</h3></Container>;
    }

    if (!product) {
        return <Container className="my-4 text-center"><h3>상품 정보를 찾을 수 없습니다.</h3></Container>;
    }

    return (
        <Container className="my-4">
            <Card>
                <Row className="g-0">
                    {/* 좌측 상품 이미지 */}
                    <Col md={4}>
                        <Card.Img
                            variant="top"
                            src={`${API_BASE_URL}/images/${product.image}`}
                            alt={product.name}
                            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                        />
                    </Col>
                    {/* 우측 상품 정보 */}
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title className="fs-3">{product.name}</Card.Title>
                            <Table striped bordered hover>
                                <tbody>
                                    <tr>
                                        <td className="text-center"><strong>가격</strong></td>
                                        <td>{product.price.toLocaleString()}원</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center"><strong>카테고리</strong></td>
                                        <td>{getCategoryDescription(product.category)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center"><strong>재고</strong></td>
                                        <td>{product.stock.toLocaleString()}개</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center"><strong>설명</strong></td>
                                        <td>{product.description}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center"><strong>등록일자</strong></td>
                                        <td>{product.inputdate}</td>
                                    </tr>
                                </tbody>
                            </Table>

                            <div className="d-flex justify-content-center mt-3">
                                <Button variant="primary" className="me-3 px-4" onClick={() => navigate('/product/list')}>
                                    목록으로
                                </Button>
                                {user?.role === 'ADMIN' && (
                                    <Button variant="danger" className="px-4" onClick={deleteProduct}>
                                        삭제
                                    </Button>
                                )}
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}

export default ProductDelete;
