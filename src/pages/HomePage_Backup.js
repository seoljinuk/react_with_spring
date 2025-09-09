import { Button, Container } from "react-bootstrap";

function App({ user,  handleLogout}) {
    console.log('홈페이지');
    
    // user가 존재하면 그에 따른 버튼을 분기 처리
    const RenderButtons = () => {
        switch (user?.role) {
            case 'ADMIN':
                return (
                    <>
                        <Button variant="info" href="/admin/dashboard" className="m-2">
                            관리자 대시보드
                        </Button>
                        <Button variant="danger" href="/member/logout" onClick={handleLogout} className="m-2">
                            로그 아웃
                        </Button>
                    </>
                );
            case 'USER':
                return (
                    <>
                        <Button variant="warning" href="/user/profile" className="m-2">
                            내 정보
                        </Button>
                        <Button variant="danger" href="/member/logout" onClick={handleLogout} className="m-2">
                            로그 아웃
                        </Button>
                    </>
                );
            default:
                return (
                    <>
                        <Button variant="primary" href="/member/login" className="m-2">
                            로그인
                        </Button>
                        <Button variant="success" href="/member/signup" className="m-2">
                            회원 가입
                        </Button>
                    </>
                );
        }
    };

    return (
        <>
            <p />
            {/* 메인 컨텐츠 */}
            <Container className="text-center mt-5" style={{ height: '70vh' }}>
                <h1>Welcome to ICT Coffee Shop ☕ </h1>
                <p className="lead">맛있는 커피와 함께 하는 행복한 시간</p>
                <RenderButtons/> {/* 버튼 렌더링 */}
            </Container>
        </>
    );
}

export default App;
