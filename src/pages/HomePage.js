import { useEffect, useState } from "react";
import { Carousel, Container } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ✅ 추가

function App() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();  // ✅ 네비게이터 훅 사용

    useEffect(() => {
        // API 호출 (백엔드에서 SELECT 실행 결과 리턴)
        axios.get(`${API_BASE_URL}/product?filter=bigs`)  // ❗주의: /product → /products 맞는지 확인
            .then(response => setProducts(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleDetailClick = (id) => {
        navigate(`/detail/${id}`);  // ✅ 상세 페이지 이동
    };

    return (
        <Container className="mt-4">
            <Carousel>
                {products.map(product => (
                    <Carousel.Item key={product.id}>
                        <img
                            className="d-block w-100"
                            src={`${API_BASE_URL}/images/${product.image}`}
                            alt={product.name}
                            style={{ cursor: "pointer" }}   // 마우스 오버 시 손가락 모양
                            onClick={() => handleDetailClick(product.id)}  // ✅ 클릭 이벤트
                        />
                        <Carousel.Caption>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>
    );
}

export default App;
