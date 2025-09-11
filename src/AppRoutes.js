// src/AppRoutes.js
import { Routes, Route } from "react-router-dom";

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ProductDelete from './pages/ProductDelete';
import ProductInsertForm from './pages/ProductInsertForm';
import ProductUpdateForm from './pages/ProductUpdateForm';
import CartList from './pages/CartList';

function AppRoutes({ user, handleLoginSuccess }) {
    return (
        <Routes>
            {/* path에는 요청 url 정보, element에는 컴포넌트 이름 */}
            <Route path='/' element={<HomePage />} /> {/* 홈 페이지 */}
            <Route path='/member/login' element={<LoginPage setUser={handleLoginSuccess} />} />
            <Route path='/member/signup' element={<SignupPage />} />

            {/* 로그인 여부에 따라서 상품 목록 페이지가 다르게 보여야 하므로, user를 넘겨 줍니다. */}
            <Route path='/product/list' element={<ProductList user={user} />} />
            <Route path='/product/insert' element={<ProductInsertForm />} />
            <Route path='/product/update/:id' element={<ProductUpdateForm />} />
            {/* <Route path='/product/delete/:id' element={<ProductDelete user={user} />} /> */}

            {/* 장바구니 목록 페이지(user 넘겨줌) */}
            <Route path='/cart/list' element={<CartList user={user} />} />

            {/* 미로그인시 [장바구니]와 [구매하기] 기능은 선택 불가능해야 하므로, user를 넘겨 줍니다. */}
            <Route path='/product/detail/:id' element={<ProductDetail user={user} />} />
        </Routes>
    );
}

export default AppRoutes;
