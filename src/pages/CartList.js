import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config/config';


function App({ user }) {
    // console.log(`user`);
    // console.log(user); // 현재 접속자 정보 출력

    // 사용자 정보가 바뀔때 마다 렌더링합니다.
    // user?.id : Optional Chaining(물음표가 있어서 오류 발생하지 않고 undefined를 반환)
    // 브라우저에 오류 발생시키지 않고, 무시하고 넘어감
    useEffect(() => {
        if (user && user?.id) {
            fetchCartProducts();
        }
    }, [user]);

    const navigate = useNavigate();

    /* 보여 주고자 하는 카트 상품 목록 State */
    /* 스프링 부트의 CartProductResponseDto 클래스 참조  */
    const [cartProducts, setCartProducts] = useState([]);

    /* 화면에 보여 주는 주문 총 금액 */
    const [orderTotalPrice, setOrderTotalPrice] = useState(0);

    /* 특정 고객에 대한 카트 상품 목록을 조회합니다. */
    const fetchCartProducts = async () => {
        console.log(`카트 상품 불러 오기 시작`);
        try {
            const url = `${API_BASE_URL}/cart/list/${user.id}`;
            const response = await axios.get(url);
            setCartProducts(response.data || []);

            console.log(`카트 상품 응답 결과`);
            console.log(response.data);

        } catch (error) {
            console.log(`오류 정보 :${error}`);
            alert('카트 상품 정보가 존재하지 않아서 목록 페이지로 이동합니다.');
            navigate(`/product/list`);
        };
    };

    // `전체 선택` 체크 박스를 Toggle했습니다.
    const toggleAllCheckBox = (isAlChecked) => {
        console.log(`전체 선택 체크 박스 : ${isAlChecked}`);

        setCartProducts((previous) => {
            // 모든 상품들의 체크 상태를 `전체 선택` 체크 박스의 상태와 동일하게 설정합니다.
            const updatedProducts = previous.map((product) => ({
                ...product,
                checked: isAlChecked
            }));

            // 총 주문 금액을 갱신합니다.
            // 비동기적 렌더링 문제로 수정된 updatedProducts 항목을 매개 변수로 넘겨 주어야 정상 작동합니다. 
            refreshOrderTotalPrice(updatedProducts);

            return updatedProducts;
        });
    };

    // // 총 주문 금액을 재계산해주는 함수입니다.
    // const calculateTotalPrice = (products) => {
    //     return 0 ;
    // };


    // 개별 체크 박스의 값을 Toggle했습니다.
    const toggleCheckBox = (cartProductId) => {
        console.log(`카트 상품 아이디 : ${cartProductId}`);

        setCartProducts((previous) => {
            // 해당 상품의 checked 상태를 반전시킵니다.
            const updatedProducts = previous.map((product) =>
                // 여러 개의 목록 중에서 `카트 상품` 아이디가 동일한 항목에 대해서만 ! 연산자로 상태 반전 
                product.cartProductId === cartProductId
                    ? { ...product, checked: !product.checked }
                    : product
            );

            // 총 주문 금액을 갱신합니다.
            // 비동기적 렌더링 문제로 수정된 updatedProducts 항목을 매개 변수로 넘겨 주어야 정상 작동합니다. 
            refreshOrderTotalPrice(updatedProducts);

            return updatedProducts;
        });
    };

    // 카트 상품 목록 중 특정 상품의 구매 수량을 변경하고자 합니다.
    const changeQuantity = async (cartProductId, quantity) => {
        if (isNaN(quantity)) { // 숫자 형식이 아니면           
            setCartProducts((previous) =>
                previous.map((product) =>
                    product.cartProductId === cartProductId ? { ...product, quantity: 0 } : product
                )
            );
            alert('변경 수량은 최소 1이상이어야 합니다.');
            return;
        }

        console.log(`카트 상품 아이디 : ${cartProductId}, 변경 수량 : ${quantity}`);

        try {
            /* patch() 동작은 전체가 아닌 일부 데이터만 변경을 수행하고자 할 때 사용됩니다. */
            /* 스프링 부트의 WebConfig 클래스 내 addCorsMappings() 메소드 참조 바람 */
            // `{API_BASE_URL}`/cart/edit/카트상품아이디?quantity=변경수량
            const url = `${API_BASE_URL}/cart/edit/${cartProductId}?quantity=${quantity}`;
            const response = await axios.patch(url);

            console.log(response.data || '');

            // cartProducts의 수량 갱신
            setCartProducts((previous) => {
                // previous : 갱신 전 카트 상품 데이터   
                const updatedProducts = previous.map((product) =>
                    // 방금 내가 수정한 `카트 상품 아이디`와 동일하면, `전개 연산자`를 사용하여 해당 상품의 quantity 갱신
                    product.cartProductId === cartProductId ? { ...product, quantity } : product
                )

                refreshOrderTotalPrice(updatedProducts);
                return updatedProducts;
            });



        } catch (error) {
            console.log(`카트 상품 수량 변경 실패`);
            console.log(error);
        };
    };

    const refreshOrderTotalPrice = (products) => {
        console.log(`요금 재계산 시작`);

        let total = 0; // 총 금액 변수

        products.forEach((bean) => {
            if (bean.checked) { // 선택된 체크에 한해서
                total += bean.price * bean.quantity; // 총 금액 누적
            }
        });

        setOrderTotalPrice(total); // 상태 업데이트
    };

    // 카트 상품 아이디를 이용하여 해당 품목을 목록에서 배제합니다.
    const deleteCartProduct = async (cartProductId) => {
        // 삭제 확인 컨펌 함수
        const isConfirmed = window.confirm('해당 카트 상품을 정말로 삭제하시겠습니까?');

        if (isConfirmed) {
            console.log(`삭제할 카트 상품 아이디 : ${cartProductId}`);

            try {
                // backend에게 삭제 요청
                const url = `${API_BASE_URL}/cart/delete/${cartProductId}`;
                const response = await axios.delete(url);

                // 카트 상품 목록을 갱신하고, 요금을 다시 계산합니다.
                setCartProducts((previous) => {
                    // updatedProducts : 삭제된 품목을 제외한 갱신된 카트 상품들
                    const updatedProducts = previous.filter((bean) => bean.cartProductId !== cartProductId);

                    refreshOrderTotalPrice(updatedProducts);

                    return updatedProducts;
                });

                alert(response.data);

            } catch (error) {
                console.log(`카트 상품 삭제 기능 오류`);
                console.log(error);
            };
        } else {
            console.log(`카트 상품 삭제가 취소 되었습니다.`);
        }
    };

    const orders = async () => {
        console.log(`주문 로직 시작`);

        const selectedProducts = cartProducts.filter((bean) => bean.checked);
        if (selectedProducts.length === 0) {
            alert(`주문할 상품을 선택해 주세요.`);
            return;
        }

        try {
            const url = `${API_BASE_URL}/cart/order`;

            // 스프링 부트의 OrderItemDto, OrderRequestDto 클래스와 연관이 있습니다.
            const data = {
                memberId: user.id,
                status: 'PENDING',
                orderItems: selectedProducts.map((product) => ({
                    cartProductId: product.cartProductId,
                    productId: product.productId,
                    quantity: product.quantity
                }))
            };
            console.log(`주문할 데이터 정보`);
            console.log(data);
            const response = await axios.post(url, data);
            alert(response.data);

            // 주문한 상품을 장바구니에서 제거 또는 선택 해제
            setCartProducts((prevProducts) =>
                prevProducts.filter((product) => !product.checked) // 주문한 상품 제거
            );

            // 총 주문 금액 초기화
            setOrderTotalPrice(0);

        } catch (error) {
            console.log(`주문 하기 기능 오류`);
            console.log(error);
        };
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">
                <span style={{ color: 'blue', fontSize: '2rem' }}>{user?.name}</span>
                <span style={{ fontSize: '1.3rem' }}>님의 장바구니</span>
            </h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th style={{ fontSize: '1.2rem' }}>
                            <Form.Check
                                type="checkbox"
                                onChange={(event) => toggleAllCheckBox(event.target.checked)}
                                label='전체 선택'
                            />
                        </th>
                        <th style={{ fontSize: '1.2rem' }}>상품 정보</th>
                        <th style={{ fontSize: '1.2rem' }}>수량</th>
                        <th style={{ fontSize: '1.2rem' }}>금액</th>
                        <th style={{ fontSize: '1.2rem' }}>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {cartProducts.length > 0 ? (
                        cartProducts.map((product) => (
                            <tr key={product.cartProductId}>
                                <td className="text-center align-middle">
                                    <Form.Check
                                        type="checkbox"
                                        checked={product.checked}
                                        onChange={() => toggleCheckBoxtoggleCheckBox(product.cartProductId)}
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    <Row>
                                        {/* 한 칸에 이미지 4, 상품 이름 8로 공간 할당 */}
                                        <Col xs={4}>
                                            <Image src={`${API_BASE_URL}/images/${product.image}`}
                                                thumbnail
                                                alt={product.name}
                                                width="80" height="80" />
                                        </Col>
                                        <Col xs={8} className="d-flex align-items-center">
                                            {product.name}
                                        </Col>
                                    </Row>
                                </td>
                                <td className="text-center align-middle">
                                    <Form.Control
                                        type=""
                                        min={1}
                                        value={product.quantity}
                                        onChange={(event) => changeQuantity(product.cartProductId, parseInt(event.target.value))}
                                        style={{ width: '80px', margin: '0 auto' }}
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    {(product.price * product.quantity).toLocaleString()} 원
                                </td>
                                <td className="text-center align-middle">
                                    <Button variant="danger" size="sm"
                                        onClick={() => deleteCartProduct(product.cartProductId)}>
                                        삭제
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td>장바구니(카트)가 비어 있습니다.</td></tr>
                    )}
                </tbody>
            </Table>

            <h3 className="text-end mt-3">총 주문 금액 : {orderTotalPrice.toLocaleString()} 원</h3>
            <div className="text-end">
                <Button variant="primary" size="lg" onClick={orders}>
                    주문하기
                </Button>
            </div>
        </Container>
    );
};

export default App;