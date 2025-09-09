import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Pagination } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

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
        pageCount: 10 // 페이지 하단 버튼 개수
    });

    useEffect(() => { // backend 서버에서 데이터 읽어 오기
        // const url = `http://localhost:9000/product/list`; // 전체 가져 오기
        const url = `http://localhost:9000/product/list?pageNumber=${paging.pageNumber}&pageSize=${paging.pageSize}`;
        axios.get(url)
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
                    const endPage = Math.min(beginPage + prev.pageCount - 1, totalPages -1);
                    // pageCount: 10 // 고정 값으로 그냥 진행

                    return {
                        ...prev,
                        totalElements: totalElements,
                        totalPages: totalPages,
                        pageNumber: pageNumber,
                        pageSize: pageSize,
                        beginPage: beginPage,
                        endPage: endPage,
                    };
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }, [paging.pageNumber]); // 페이지 번호가 변경될 때마다 다시 rendering 되어야 합니다.
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
            <Row>
                {products.map((product) => (
                    <Col key={product.id} md={4} className="mb-4">
                        <Card className="h-100"
                            onClick={() => navigate(`/product/detail/${product.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Img
                                variant="top"
                                src={`http://localhost:9000/images/${product.image}`}
                                alt={product.name}
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>가격 : {product.price}원</Card.Text>
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
                                        <Button variant="danger" className="me-2">삭제</Button>
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
                        setPaging((prev) => ({...prev, pageNumber: 0}));
                    }}
                    disabled={paging.pageNumber < paging.pageCount}
                    as="button"
                >
                    맨처음
                </Pagination.First>

                <Pagination.Prev 
                    onClick={() => {
                        const gotoPrevPage = paging.beginPage - 1 ;
                        console.log(`Prev 버튼 클릭 : ${gotoPrevPage} 페이지로 이동`);
                        setPaging((prev) => ({...prev, pageNumber: gotoPrevPage}));                        
                    }}
                    disabled={paging.pageNumber < paging.pageCount}
                    as="button"
                >
                    이전
                </Pagination.Prev>

                {/* 숫자로 반복되는 영역 */}
                {[...Array(paging.endPage - paging.beginPage + 1)].map((_, idx) => {                    
                    const pageIndex = paging.beginPage + idx + 1 ;
                    // console.log(pageIndex);
                    return (
                        <Pagination.Item
                            key={pageIndex}
                            active={paging.pageNumber === (pageIndex - 1)}
                            onClick={() => {
                                console.log(`${pageIndex} 페이지로 이동하기`);
                                setPaging((prev) => ({...prev, pageNumber: (pageIndex - 1)}));
                            }}
                        >
                            {pageIndex}
                        </Pagination.Item>
                    )
                })}

                {/* 뒷쪽 영역 */} 
                <Pagination.Next 
                    onClick={() => {
                        const gotoNextPage = paging.endPage + 1 ;
                        console.log(`Next 버튼 클릭 : ${gotoNextPage} 페이지로 이동`);
                        setPaging((prev) => ({...prev, pageNumber: gotoNextPage}));                        
                    }}
                    disabled={paging.pageNumber >= Math.floor(paging.totalPages / paging.pageCount) * paging.pageCount}
                    as="button"
                >
                    다음
                </Pagination.Next>    

                <Pagination.Last 
                    onClick={() => {
                        const lastPage = paging.totalPages - 1 ;
                        console.log(`Last 버튼 클릭 : {lastPage} 페이지로 이동`);
                        setPaging((prev) => ({...prev, pageNumber: lastPage}));
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