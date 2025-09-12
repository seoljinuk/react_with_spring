import axios from "axios";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config/config';

function App() {
    // product는 등록하고자 하는 상품 객체 정보
    const [product, setProduct] = useState({
        name: '',
        price: '',
        category: '',
        stock: '',
        image: '',
        description: ''
    });

    const handleChange = (event) => {
        // event는 change 이벤트를 발생시킨 폼 양식
        const { name, value } = event.target;

        // 전개 연산자를 사용하여 다른 폼 양식들의 이전 값도 보존하도록 합니다.
        setProduct({
            ...product,
            [name]: value
        }
        );
    };

    const handleFileChange = (event) => {
        const { name, files } = event.target;
        const file = files[0]; // typ="file"인 요소의 0번째 요소 

        // FileReader는 Javascript에서 파일을 읽고 데이터 처리시 사용합니다.
        // Base64 인코딩으로 이미지를 문자열 형태로 변환합니다.
        // 해당 이미지는 자바에서 접두사 "data:image"으로 체크하면 됩니다.
        // 주로 <input type="file" />에서 파일을 읽는 데 사용됩니다. 
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            //console.log(reader.result) ; 

            // Base64 인코딩으로 이미지를 저장합니다.
            setProduct({
                ...product,
                [name]: reader.result
            }
            );
        };
    };

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 등록할 상품 정보
        const productData = {
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock,
            image: product.image,
            description: product.description
        };

        try {
            const url = `${API_BASE_URL}/product/insert`;
            const data = productData;

            // Http 헤더에 이 문서의 타입(Content-Type)이 json이라고 알려 줍니다.
            const config = { headers: { 'Content-Type': 'application/json' } };

            const response = await axios.post(url, data, config);

            console.log(`상품 추가 : [${response.data}]`);
            alert('상품이 성공적으로 등록되었습니다.');

            // 상품 등록된 이후의 처리
            setProduct({
                name: '',
                price: '',
                category: '',
                stock: '',
                image: '',
                description: ''
            });

            // 등록 후 목록 페이지로 이동
            navigate('/product/list');

        } catch (error) {
            console.log('error :', error);
            alert('상품 등록에 실패하였습니다.');
        };
    };

    return (
        <Container className="my-4">
            <h1>상품 등록</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>상품명</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="상품명를(을) 입력해주세요."
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="price">
                    <Form.Label>가격</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="가격를(을) 입력해주세요."
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="category">
                    <Form.Label>카테고리</Form.Label>
                    <Form.Select
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        required
                    >
                        {/* 자바의 Enum 타입에 대문자로 작성했으면, 여기서도 대문자로 작성할 것 */}
                        <option value="">카테고리를 선택하세요</option>
                        <option value="BREAD">빵</option>
                        <option value="BEVERAGE">음료수</option>
                        <option value="CAKE">케익</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="stock">
                    <Form.Label>재고</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="재고를(을) 입력해주세요."
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>


                <Form.Group className="mb-3" controlId="image">
                    <Form.Label>이미지</Form.Label>
                    {/* 이미지는 type="file"이어야하고, 이벤트 핸들러를 별도로 작성해 주도록 합니다.  */}
                    <Form.Control
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>상품 설명</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="상품에 대한 설명를(을) 입력해주세요."
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    상품 등록
                </Button>
            </Form>
        </Container>
    );
};

export default App;