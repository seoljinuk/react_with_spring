import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from './../config';

function App({ user }) {
    // user가 미로그인이면 [구매 수량 입력], [장바구니], [구매하기] 기능 불가능하게 설정하도록 합니다.

    /* useParams : 파라미터를 처리해주는 hook입니다. */
    /* 주의 : 넘기는 쪽는 받는 쪽의 이름이 일치해야 합니다. */
    const { id } = useParams(); // 상품 id
    console.log(id);

    // get Product from Backend
    const [product, setProduct] = useState(null);

    // 로딩 상태를 나타내는 스테이트로, true이면 현재 로딩중입니다.
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/product/detail/${id}`)
            .then((response) => {
                setProduct(response.data);
                setLoading(false); // 완전히 읽혀 지면 false로 변경
            })
            .catch((error) => {
                console.log(error);
                window.alert("상품 정보를 불러오는 중 오류가 발생했습니다.");  // 🚀 경고창 표시
                navigate(-1);  // 🚀 이전 페이지로 이동
            });
    }, [id]);

    // 카테고리 정보 보여 주기(예시 : BREAD → 빵(BREAD))
    const getCategoryDescription = (category) => {
        switch (category) {
            case 'BREAD': return `빵(${category})`;
            case 'BEVERAGE': return `음료수(${category})`;
            case 'CAKE': return `케익(${category})`;
            default: return `기타(${category})`;
        }
    };

    // 구매 수량 관련 항목들
    const [quantity, setQuantity] = useState(0); // 구매 수량 State

    // 수량 체인치 관련 이벤트 핸들러
    const handleQuantityChange = (event) => {
        const newValue = parseInt(event.target.value);
        setQuantity(newValue) ; 
    };   
    
    // 장바구니에 추가하기
    // const addToCart = () => {
    //     alert(`${product.name} ${quantity}개를 장바구니에 담기`);
    // };

    const addToCart = async () => {
        if(quantity < 1){
            alert('수량을 1개 이상 선택해 주세요.');
            return ;
        }

        try{
            const url = `${API_BASE_URL}/cart/insert`;
            const data = {
                memberId: user.id,
                productId: product.id,
                quantity: quantity
            } ;
            const response = await axios.post(url, data);

            alert(response.data);
            //alert(`${product.name} ${quantity}개를 장바구니에 담기`);
            navigate('/product/list') ; // 상품 목록 페이지로 이동

        }catch(error){
            console.log('오류 발생 : ' + error) ;

            if(error.response){
                alert(`장바구니 추가 실패 : ${error.response.data}`);

            }else{
                alert(`장바구니 추가 중 오류 발생`);
            }
        }
    };

    // 바로 구매하기
    // const buyNow = () => {
    //     alert(`${product.name} ${quantity}개를 지금 구매하기`);
    // };       
    const buyNow = async () => {
        if(quantity < 1){
            alert('수량을 1개 이상 선택해 주세요.');
            return ;
        }

        try{
            const url = `${API_BASE_URL}/order`;
            const data = {
                memberId : user.id,
                status: 'PENDING',
                orderItems:[
                    {
                       productId: product.id,
                       quantity: quantity 
                    }
                ]
            } ;

            const response = await axios.post(url, data) ;

            alert(`${product.name} ${quantity}개를 구매하였습니다.`);
            navigate('/product/list') ; // 상품 목록 페이지로 이동

        }catch(error){
            console.log(error);
            alert('구매 실패 : ' + (error.response?.data) || error.message) ;
        }        
    };

 
    

    if (loading === true) {
        return <Container className="my-4 text-center"><h3>상품 정보를 읽어 오는 중입니다.</h3></Container>;
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
                    {/* 우측 상품 세부 정보 */}
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title className="fs-3">
                                {product.name}
                            </Card.Title>
                            <Table striped bordered hover >
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

                            {/* 구매 수량 입력 */}
                            <Form.Group as={Row} className="mb-3 align-items-center">
                                <Col xs={3} className="text-center">
                                    <strong>구매 수량</strong>
                                </Col>
                                <Col xs={5}>
                                    <Form.Control
                                        type="number"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        min="1"
                                        disabled={!user}
                                    />
                                </Col>
                            </Form.Group>

                            {/* 버튼 (목록으로 & 장바구니 & 구매하기) */}
                            <div className="d-flex justify-content-center mt-3">
                                <Button variant="primary" className="me-3 px-4" href="/product/list">목록으로</Button>
                                <Button variant="success" className="me-3 px-4" 
                                    onClick={() => {
                                        if(!user){
                                            alert('로그인이 필요한 서비스입니다');
                                            return navigate('/member/login');
                                        }else{
                                            addToCart();
                                        }                                        
                                    }}>
                                    장바구니
                                </Button>
                                <Button variant="danger" className="px-4" 
                                    onClick={() => {
                                        if(!user){
                                            alert('로그인이 필요한 서비스입니다');
                                            return navigate('/member/login');
                                        }else{
                                            buyNow() ;
                                        }                                        
                                    }}>
                                    구매하기
                                </Button>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default App;