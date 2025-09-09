import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

    // `cartProducts` 상태가 변경될 때마다 `orderTotalPrice` 업데이트
    useEffect(() => {
        let total = 0;

        cartProducts.forEach(product => {
            if (product.checked) {
                total += product.price * product.quantity;
            }
        });

        setOrderTotalPrice(total);
    }, [cartProducts]);


    /* 특정 고객에 대한 카트 상품 목록을 조회합니다. */
    const fetchCartProducts = async () => {
        console.log(`카트 상품 불러 오기 시작`);
        try {
            const url = `http://localhost:9000/cart/list/${user.id}`;
            const response = await axios.get(url);
            setCartProducts(response.data || []);

            console.log(`카트 상품 응답 결과`);
            console.log(response.data);

        } catch (error) {
            alert('카트 상품 데이터 정보를 가져 오지 못했습니다.');
            console.log(`오류 정보 :${error}`);
            navigate(`/product/list`);
        };
    };

    // `전체 선택` 체크 박스를 Toggle했습니다.
    const toggleAllCheckBox = (allCheckBoxStatus) => { // 할일 01
        console.log(`전체 선택 체크 박스 : ${allCheckBoxStatus}`);

        setCartProducts((prevProducts) => {
            // 모든 상품의 checked 값을 `전체 선택` 체크 박스 상태와 동일하게 변경
            const updatedProducts = prevProducts.map((product) => ({
                ...product,
                checked: allCheckBoxStatus,
            }));

            // 총 주문 금액을 재계산합니다.
            const total = updatedProducts
                .filter(product => product.checked)
                .reduce((sum, product) => sum + product.price * product.quantity, 0);

            setOrderTotalPrice(total);
            return updatedProducts;
        });
    };




    // 개별 체크 박스의 값을 Toggle했습니다.
    const toggleCheck = (cartProductId) => { // 할일 02
        console.log(`카트 상품 아이디 : ${cartProductId}`);

        setCartProducts((prevProducts) => {
            // 해당 상품의 checked 상태를 반전시킵니다.
            const updatedProducts = prevProducts.map((product) =>
                product.cartProductId === cartProductId
                    ? { ...product, checked: !product.checked }
                    : product
            );

            // 총 주문 금액을 재계산합니다.
            const total = updatedProducts
                .filter(product => product.checked)
                .reduce((sum, product) => sum + product.price * product.quantity, 0);

            setOrderTotalPrice(total); // 상태 업데이트
            return updatedProducts;
        });
    };

    // 카트 상품 목록 중 특정 상품의 구매 수량을 변경하고자 합니다.
    const changeQuantity = async (cartProductId, quantity) => {
        if (isNaN(quantity)) { // 숫자 형식이 아니면           
            setCartProducts((previousProducts) =>
                previousProducts.map((product) =>
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
            // http://localhost:9000/cart/edit/카트상품아이디?quantity=변경수량
            const url = `http://localhost:9000/cart/edit/${cartProductId}?quantity=${quantity}`;
            const response = await axios.patch(url);

            console.log(response.data || '');

            // cartProducts의 수량 갱신
            setCartProducts((previousProducts) =>
                // previousProducts : 갱신 전 카트 상품 데이터   
                previousProducts.map((product) =>
                    // 방금 내가 수정한 `카트 상품 아이디`와 동일하면, `전개 연산자`를 사용하여 해당 상품의 quantity 갱신
                    product.cartProductId === cartProductId ? { ...product, quantity } : product
                )
            );

            refreshOrderTotalPrice();

        } catch (error) {
            console.log(`카트 상품 수량 변경 실패`);
            console.log(error);
        };
    };

    const refreshOrderTotalPrice = () => { // 할일 03
        console.log(`요금 재계산 시작`);

        let total = 0;

        // 체크된 상품만 선택하여 총 금액 계산
        cartProducts.forEach(product => {
            if (product.checked) {
                total += product.price * product.quantity;
            }
        });

        setOrderTotalPrice(total); // 상태 업데이트
    };


    // 카트 상품 아이디를 이용하여 해당 품목을 목록에서 배제합니다.
    const deleteCartProduct = async (cartProductId) => { // 할일 04
        // 삭제 확인 컨펌 함수
        const isConfirmed = window.confirm('해당 카트 상품을 정말로 삭제하시겠습니까?');

        if (isConfirmed) {
            console.log(`삭제할 카트 상품 아이디 : ${cartProductId}`);

            // 요기서 지우자.....
            try {
                await axios.delete(`http://localhost:9000/cart/delete/${cartProductId}`);
                setCartProducts((prevProducts) =>
                    prevProducts.filter((product) => product.cartProductId !== cartProductId)
                );
            } catch (error) {
                console.error("Error deleting cart product", error);
            };
        } else {
            console.log(`카트 상품 삭제가 취소 되었습니다.`);
        }
    };

    const orders = async () => { // 할일 05
        console.log(`주문 로직 시작`);

        const selectedProducts = cartProducts.filter((product) => product.checked);
        if (selectedProducts.length === 0) {
            alert("주문할 상품을 선택해주세요.");
            return;
        }
        try {
            const url = `http://localhost:9000/cart/orders`;
            const data = {
                userId: user.id,
                cartOrderViewList: selectedProducts.map((product) => ({
                    cartProductId: product.cartProductId,
                })),
            };
            console.log(`주문할 데이터`) ;
            console.log(data) ;
            // await axios.post(url, data);
            // alert("주문이 완료되었습니다.");
            // window.location.href = "/orders";

        } catch (error) {
            console.error("Error placing order", error);
        };
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">{user?.name}님의 장바구니</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>
                            <Form.Check
                                type="checkbox"
                                onChange={(event) => toggleAllCheckBox(event.target.checked)}
                                label='전체 선택'
                            />
                        </th>
                        <th>상품 정보</th>
                        <th>수량</th>
                        <th>금액</th>
                        <th>삭제</th>
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
                                        onChange={() => toggleCheck(product.cartProductId)}
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    <Row>
                                        {/* 한 칸에 이미지 4, 상품 이름 8로 공간 할당 */}
                                        <Col xs={4}>
                                            <Image src={`http://localhost:9000/images/${product.image}`}
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

            <h3 className="text-end mt-3">총 주문 금액: {orderTotalPrice.toLocaleString()} 원</h3>
            <div className="text-end">
                <Button variant="primary" size="lg" onClick={orders}>
                    주문하기
                </Button>
            </div>
        </Container>
    );
};

export default App;