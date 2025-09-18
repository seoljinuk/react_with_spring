import { Button, Container, Form, Alert, Row, Col, Card } from "react-bootstrap";

import axios from 'axios';
import { useState } from "react";
import { API_BASE_URL } from '../config/config';

// 특정한 페이지로 이동을 시킬 때 사용하는 hook
import { useNavigate } from "react-router-dom";

function App() {
    // 파라미터 관련 state 변수 선언
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');

    const navigate = useNavigate();

    // 예외 관련 state 변수 선언
    // 오류 메시지 객체
    const [errors, setErrors] = useState({
        name: "", email: "", password: "", address: "", general: ""
    });


    /*
        구분	async/await 사용	then/catch 사용
        필수 여부	❌ (없어도 됨)	✔ 가능
        가독성	👍 (더 깔끔)	👎 (체인이 길어지면 복잡)
        에러 처리	try...catch 한 번에 가능	.catch() 따로 작성
        추천 여부	✔ 대부분의 비동기 코드에서 추천	간단한 한 줄짜리 Promise라면 가능
    */
    const handleSignup = async (event) => {
        event.preventDefault();

        /* spring boot에게 post 방식으로 전달 */
        try {
            /* response는 응답 객체 */
            const response = await axios.post(
                `${API_BASE_URL}/member/signup`, {
                name, email, password, address
            });

            // http 응답 코드 201은 요청 성공이고, 새로운 리스소 생성시 서버가 반환해주는 코드 
            if (response.status === 201) {
                alert('회원 가입 성공');
                navigate('/member/login'); // 로그인 페이지로 이동
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data); // 서버에서 받은 오류 메시지를 객체로 저장
            } else { // 다른 오류 메시지 
                setErrors(prevErrors => ({ ...prevErrors, general: "회원 가입 중 오류가 발생하였습니다." }));
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">회원 가입</h2>

                            {errors.general && <Alert variant="danger">{errors.general}</Alert>}
                             
                            {/*
                            	isInvalid 속성은 Form.Control 컴포넌트에서 제공하는 유효성 검사 관련 props
                            	true면 해당 입력창에 붉은 테두리가 생기고
                            	<Form.Control.Feedback type="invalid"> 내용이 보여집니다.
                            
                            	!! 연산자는 값을 강제로 boolean으로 변환하는 자바스크립트 패턴입니다.
                            */}
                             
                            <Form onSubmit={handleSignup}>
                                <Form.Group className="mb-3" controlId="forName">
                                    <Form.Label>이름</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="이름을 입력해 주세요."
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="forEmail">
                                    <Form.Label>이메일</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="이메일을 입력해 주세요."
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        isInvalid={!!errors.email}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="forPassword">
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="비밀번호를 입력해 주세요."
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        isInvalid={!!errors.password}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="forAddress">
                                    <Form.Label>주소</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="주소를 입력해 주세요."
                                        value={address}
                                        onChange={(event) => setAddress(event.target.value)}
                                        isInvalid={!!errors.address}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    회원 가입
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
