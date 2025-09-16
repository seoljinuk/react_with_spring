import { Nav } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function MenuItems({ user, handleLogout }) {
    const navigate = useNavigate();
    /* 하하하 */
    /* user?.role : JavaScript의 옵셔널 체이닝(optional chaining) 문법 */
    /* user가 null이라면 undefined으로 변환이 되고, 오류 메시지를 반환하지 않습니다. */
    switch (user?.role) {
        case 'ADMIN':
            return (
                <>
                    <Nav.Link onClick={() => navigate('/product/list')}>상품 보기</Nav.Link>
                    <Nav.Link onClick={() => navigate('/product/insert')}>상품 등록</Nav.Link>
                    <Nav.Link onClick={handleLogout}>로그 아웃</Nav.Link>
                </>
            );
        case 'USER':
            return (
                <>
                    <Nav.Link onClick={() => navigate('/product/list')}>상품 보기</Nav.Link>
                    <Nav.Link onClick={() => navigate('/cart/list')}>장바구니</Nav.Link>
                    <Nav.Link onClick={() => navigate(`/order/list?memberId=${user?.id}`)}>주문 내역</Nav.Link>
                    <Nav.Link onClick={handleLogout}>로그 아웃</Nav.Link>
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
