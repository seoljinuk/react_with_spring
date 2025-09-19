import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { API_BASE_URL } from './config/config';

// 👇 분리한 라우트 컴포넌트 import
import AppRoutes from './routes/AppRoutes';
import MenuItems from './ui/MenuItems';

function App() {
    const appName = "IT Academy Coffee Shop";

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loginUser = localStorage.getItem('user');
        setUser(JSON.parse(loginUser));
    }, []); /* 빈 배열이 2 번째 매개 변수이므로 최초 렌더링 시 단 한 번만 실행됩니다. */

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('로그인 성공');
    };

    const handleLogout = (event) => {
        event.preventDefault();

        axios.post(`${API_BASE_URL}/member/logout`, {}, { withCredentials: true })
            .then(() => {
                setUser(null);
                localStorage.removeItem('user');
                console.log('로그 아웃 성공');
                navigate("/member/login");
            })
            .catch((error) => {
                console.log('로그 아웃 실패', error);
            });
    };

    return (
        <>
            <Navbar bg='dark' variant='dark' expand='lg'>
                <Container>
                    <Navbar.Brand href='/'>{appName}</Navbar.Brand>
                    <Nav className="me-auto">
                        <MenuItems user={user} handleLogout={handleLogout} />
                    </Nav>
                </Container>
            </Navbar>

            {/* 👇 분리한 라우터 적용 */}
            <AppRoutes user={user} handleLoginSuccess={handleLoginSuccess} />

            <footer className="bg-dark text-light text-center py-3 mt-5">
                <p>© 2025 {appName}. All rights reserved.</p>
            </footer>
        </>
    );
}

export default App;
