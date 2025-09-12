import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Pagination, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from './../config';

function App({ user }) {
    /* user === 'ADMIN'이면 [상품 등록], [수정], [삭제] 메뉴가 보여야 합니다. */

    const [products, setProducts] = useState([]); // 상품 목록 state

    /* 페이징 관련 State */
    const [paging, setPaging] = useState({
        totalElements: 0, // 전체 데이터 개수 
        totalPages: 0, // 전체 페이지 번호
        pageNumber: 0, // 현재 페이지 번호
        pageSize: 6, // 한 페이지에 보여 주고자 하는 데이터 개수
        beginPage: 0, // 페이징 시작 번호
        endPage: 0, // 페이징 끝 번호 
        pageCount: 10, // 페이지 하단 버튼 개수
        pagingStatus: '',

        // 자바 SearchDto 클래스 연관 필드 추가
        searchDateType: "all", // 전체 기간(default)
        category: "", // 특정 카테고리 (예: "COFFEE", "TEA")
        searchMode: "", // 검색 모드 ("name" or "description")
        searchKeyword: "", // 검색 키워드        
    });

    useEffect(() => { // backend 서버에서 데이터 읽어 오기
        // const url = "`{API_BASE_URL}`/product/list"; // 전체 가져 오기
        //const url = "`{API_BASE_URL}`/product/list?pageNumber=${paging.pageNumber}&pageSize=${paging.pageSize}";
        const url = `${API_BASE_URL}/product/list`;

        axios.get(url, {
            params: {
                pageNumber: paging.pageNumber,
                pageSize: paging.pageSize,
                searchDateType: paging.searchDateType,
                category: paging.category,
                searchMode: paging.searchMode,
                searchKeyword: paging.searchKeyword,
                withCredentials: true
            }
        })
            .then((response) => {
                console.log('응답 받은 데이터');
                console.log(response.data.content);

                setProducts(response.data.content || []); // 안전한 기본 값 설정

                // 페이징 정보를 업데이트합니다.
                setPaging((prev) => {
                    const totalElements = response.data.totalElements;
                    const totalPages = response.data.totalPages;
                    const pageNumber = response.data.pageable.pageNumber;

                    // pageSize 이 값은 고정적이므로 할당 받지 않아도 무방합니다.
                    // 단, pageSize 개수가 가변적인 경우 반드시 다시 할당해야 합니다.
                    const pageSize = response.data.pageable.pageSize;
                    const beginPage = Math.floor(pageNumber / prev.pageCount) * prev.pageCount;
                    const endPage = Math.min(beginPage + prev.pageCount - 1, totalPages - 1);
                    // pageCount: 10 // 고정 값으로 그냥 진행

                    const pagingStatus = `${pageNumber + 1}/${totalPages} 페이지`;

                    return {
                        ...prev,
                        totalElements: totalElements,
                        totalPages: totalPages,
                        pageNumber: pageNumber,
                        pageSize: pageSize,
                        beginPage: beginPage,
                        endPage: endPage,
                        pagingStatus: pagingStatus,
                    };
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }, [paging.pageNumber, paging.searchDateType, paging.category, paging.searchMode, paging.searchKeyword]);
    // 해당 값들이 변경될 때마다 다시 호출되도록 설정
    // 페이지 번호가 변경될 때마다 다시 rendering 되어야 합니다.
    // 2번째 매개 변수 []로 인하여 딱 1번만 rendering합니다. 

    const navigate = useNavigate();

    return (
        <Container className="my-4">
            <h1 className="my-4">상품 목록 페이지</h1>
            <Link to={`/product/insert`}>
                {user?.role === 'ADMIN' && (
                    <Button variant="primary" className="mb-3">
                        상품 등록
                    </Button>
                )}
            </Link>

            <Form className="p-3">
                <Row className="mb-3">
                    {/* 🔹 검색 기간 선택 */}
                    <Col md={2}>
                        <Form.Select name="searchDateType" value={paging.searchDateType}
                            onChange={(e) => setPaging(prev => ({ ...prev, searchDateType: e.target.value }))}
                        >
                            <option value="all">전체 기간</option>
                            <option value="1d">1일</option>
                            <option value="1w">1주</option>
                            <option value="1m">1개월</option>
                            <option value="6m">6개월</option>
                        </Form.Select>
                    </Col>

                    {/* 🔹 카테고리 선택 */}
                    <Col md={2}>
                        <Form.Select name="category" value={paging.category}
                            onChange={(e) => setPaging(prev => ({ ...prev, category: e.target.value }))}
                        >
                            <option value="ALL">카테고리 선택</option>
                            <option value="BREAD">빵</option>
                            <option value="BEVERAGE">음료수</option>
                            <option value="CAKE">케익</option>
                        </Form.Select>
                    </Col>

                    {/* 🔹 검색 모드 선택 */}
                    <Col md={2}>
                        <Form.Select name="searchMode" value={paging.searchMode}
                            onChange={(e) => setPaging(prev => ({ ...prev, searchMode: e.target.value }))}
                        >
                            <option value="ALL">전체 검색</option>
                            <option value="name">상품명</option>
                            <option value="description">상품 설명</option>
                        </Form.Select>
                    </Col>

                    {/* 🔹 검색어 입력 */}
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            name="searchKeyword"
                            value={paging.searchKeyword}
                            onChange={(e) => {
                                e.preventDefault()
                                setPaging(prev => ({ ...prev, searchKeyword: e.target.value }));
                            }}
                            placeholder="검색어를 입력하세요"
                        />
                    </Col>

                    {/* 🔹 검색 버튼 */}
                    <Col md={2}>
                        <Form.Control
                            as="input"
                            type="text"
                            value={paging.pagingStatus}
                            readOnly
                            style={{
                                fontSize: '20px',
                                backgroundColor: '#f0f0f0',
                                textAlign: 'center', // 텍스트 가운데 정렬
                                width: '100%', // 필요한 너비 설정
                                margin: '0 auto', // 가운데 정렬을 위한 자동 여백
                            }}
                        />
                    </Col>
                </Row>
            </Form>

            <Row>
                {products.map((product) => (
                    <Col key={product.id} md={4} className="mb-4">
                        <Card className="h-100"
                            onClick={() => navigate(`/product/detail/${product.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Img
                                variant="top"
                                src={`${API_BASE_URL}/images/${product.image}`}
                                alt={product.name}
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{product.name}({product.id})</Card.Title>
                                <Card.Text>가격 : {product.price.toLocaleString()}원</Card.Text>
                                {user?.role === 'ADMIN' && (
                                    <div className="d-flex justify-content-center">
                                        <Button
                                            variant="warning"
                                            className="me-2"
                                            onClick={(event) => {
                                                event.stopPropagation(); // Card Click Event 방지 
                                                navigate(`/product/update/${product.id}`);
                                            }}
                                        >
                                            수정
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="me-2"
                                            onClick={async (event) => {
                                                event.stopPropagation(); // Card Click Event 방지

                                                // 삭제 확인 창
                                                const confirmDelete = window.confirm(`${product.name} 상품을 정말 삭제하시겠습니까?`);
                                                if (!confirmDelete) {
                                                    alert(`${product.name} 상품 삭제를 취소하셨습니다.`);
                                                    return; // '취소' 클릭 시 아무 동작도 하지 않음                                                  
                                                }

                                                try {
                                                    // 삭제 API 호출
                                                    await axios.delete(`${API_BASE_URL}/product/delete/${product.id}`);
                                                    alert(`${product.name} 상품이 삭제되었습니다.`);

                                                    // 삭제 후 목록 페이지로 이동
                                                    navigate('/product/list');
                                                } catch (error) {
                                                    console.log(error);
                                                    alert('상품 삭제 실패: ' + (error.response?.data || error.message));
                                                }
                                            }}
                                        >
                                            삭제
                                        </Button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* 페이징 처리 영역 */}
            <Pagination className="justify-content-center mt-4">
                {/* 앞쪽 영역 */}
                <Pagination.First
                    onClick={() => {
                        console.log(`First 버튼 클릭 : 0 페이지로 이동`);
                        setPaging((prev) => ({ ...prev, pageNumber: 0 }));
                    }}
                    disabled={paging.pageNumber < paging.pageCount}
                    as="button"
                >
                    맨처음
                </Pagination.First>

                <Pagination.Prev
                    onClick={() => {
                        const gotoPrevPage = paging.beginPage - 1;
                        console.log(`Prev 버튼 클릭 : ${gotoPrevPage} 페이지로 이동`);
                        setPaging((prev) => ({ ...prev, pageNumber: gotoPrevPage }));
                    }}
                    disabled={paging.pageNumber < paging.pageCount}
                    as="button"
                >
                    이전
                </Pagination.Prev>

                {/* 숫자로 반복되는 영역 */}
                {[...Array(paging.endPage - paging.beginPage + 1)].map((_, idx) => {
                    const pageIndex = paging.beginPage + idx + 1;
                    // console.log(pageIndex);
                    return (
                        <Pagination.Item
                            key={pageIndex}
                            active={paging.pageNumber === (pageIndex - 1)}
                            onClick={() => {
                                console.log(`${pageIndex} 페이지로 이동하기`);
                                setPaging((prev) => ({ ...prev, pageNumber: (pageIndex - 1) }));
                            }}
                        >
                            {pageIndex}
                        </Pagination.Item>
                    )
                })}

                {/* 뒷쪽 영역 */}
                <Pagination.Next
                    onClick={() => {
                        const gotoNextPage = paging.endPage + 1;
                        console.log(`Next 버튼 클릭 : ${gotoNextPage} 페이지로 이동`);
                        setPaging((prev) => ({ ...prev, pageNumber: gotoNextPage }));
                    }}
                    disabled={paging.pageNumber >= Math.floor(paging.totalPages / paging.pageCount) * paging.pageCount}
                    as="button"
                >
                    다음
                </Pagination.Next>

                <Pagination.Last
                    onClick={() => {
                        const lastPage = paging.totalPages - 1;
                        console.log(`Last 버튼 클릭 : {lastPage} 페이지로 이동`);
                        setPaging((prev) => ({ ...prev, pageNumber: lastPage }));
                    }}
                    disabled={paging.pageNumber >= Math.floor(paging.totalPages / paging.pageCount) * paging.pageCount}
                    as="button"
                >
                    맨끝
                </Pagination.Last>
            </Pagination>
        </Container>
    );
};

export default App;