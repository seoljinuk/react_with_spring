// src/components/MenuItems.js
import { Nav } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function MenuItems({ user, handleLogout }) {
    const navigate = useNavigate();

    switch (user?.role) {
        case 'ADMIN':
            return (
                <>
                    <Nav.Link onClick={() => navigate('/product/list')}>상품 보기</Nav.Link>
                    <Nav.Link onClick={() => navigate('/product/insert')}>상품 등록</Nav.Link>
                    <Nav.Link href='/member/login' onClick={handleLogout}>로그 아웃</Nav.Link>
                </>
            );
        case 'USER':
            return (
                <>
                    <Nav.Link onClick={() => navigate('/product/list')}>상품 보기</Nav.Link>
                    <Nav.Link onClick={() => navigate('/cart/list')}>장바구니</Nav.Link>
                    <Nav.Link onClick={() => navigate('/order/list')}>주문 내역</Nav.Link>
                    <Nav.Link href='/member/login' onClick={handleLogout}>로그 아웃</Nav.Link>
                </>
            );
        default:
            return (
                <>
                    <Nav.Link onClick={() => navigate('/product/list')}>상품 보기</Nav.Link>
                    <Nav.Link onClick={() => navigate('/member/login')}>로그인</Nav.Link>
                    <Nav.Link onClick={() => navigate('/member/signup')}>회원 가입</Nav.Link>
                </>
            );
    }
}

export default MenuItems;
