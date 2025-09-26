import { useState } from "react";
import { Button, Card, Container, Form, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config/config';

function App({ setUser }) {
    // setUser : 메인 페이지에서 넘겨 주는 props(로그인 여부를 저장)

    // 로그인 관련 state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    // 오류 메시지 관련 state
    const [error, setError] = useState('');

    const LoginAction = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                `${API_BASE_URL}/member/login`,
                { email, password }
            );
            // message : 로그인 성공 여부 메시지
            // member : 로그인 한 회원의 정보
            const { message, member } = response.data;

            if (message === '로그인 성공') {
                console.log(member);
                setUser(member); // 로그인 성공시 사용자 정보 저장하기
                navigate('/'); // 홈 페이지로 이동

            } else {
                // 로그인 실패 메시지(예시 : email, 비밀 번호 오류 등등)
                setError(message);
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || '로그인 실패');
            } else {
                setError('Server Error');
            }
        };
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Card style={{ width: '30rem' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">로그인</h2>

                    {/* 오류 메시지 표시 */}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={LoginAction}>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="이메일을 입력하세요"
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </Form.Group>

                        <Row className="g-2">
                            <Col xs={8}>
                                <Button variant="primary" type="submit" className="w-100">
                                    로그인
                                </Button>
                            </Col>
                            <Col xs={4}>
                                <Link to="/member/signup" className="btn btn-outline-secondary w-100">
                                    회원 가입
                                </Link>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default App;