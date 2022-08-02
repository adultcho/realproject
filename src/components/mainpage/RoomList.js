import React, { memo, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getMainList,
  getRoomListByCategory,
  setRoomList,
} from "../../redux/modules/roomSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

//컴포넌트
import Spinner from "../Spinner";
import Room from "./Room";

//CSS, 이미지 관련
import styled from "styled-components";
import { Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "../../styles/swiper.css";
import "./RoomList.modules.css";

import roomImg from "../../shared/mainpage-assets/basic-room-img.png";

import all from "../../shared/category-assets/icon-cate-all.svg";
import certi from "../../shared/category-assets/icon-cate-certi.svg";
import univ from "../../shared/category-assets/icon-cate-univ.svg";
import book from "../../shared/category-assets/icon-cate-book.svg";
import myself from "../../shared/category-assets/icon-cate-myself.svg";
import hobby from "../../shared/category-assets/icon-cate-hobby.svg";
import lang from "../../shared/category-assets/icon-cate-lang.svg";
import coding from "../../shared/category-assets/icon-cate-coding.svg";
import offi from "../../shared/category-assets/icon-cate-offi.svg";
import free from "../../shared/category-assets/icon-cate-free.svg";

const CATEGORY_LIST = [
  {
    num: 0,
    name: "전체",
    imageUrl: all,
  },
  {
    num: 1,
    name: "자격증",
    imageUrl: certi,
  },
  {
    num: 2,
    name: "대입",
    imageUrl: univ,
  },
  {
    num: 3,
    name: "독서",
    imageUrl: book,
  },
  {
    num: 4,
    name: "자기계발",
    imageUrl: myself,
  },

  {
    num: 5,
    name: "취미",
    imageUrl: hobby,
  },
  {
    num: 6,
    name: "어학",
    imageUrl: lang,
  },
  {
    num: 7,
    name: "코딩",
    imageUrl: coding,
  },
  {
    num: 8,
    name: "공무원",
    imageUrl: offi,
  },
  {
    num: 9,
    name: "자유주제",
    imageUrl: free,
  },
];

const RoomList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //받아온 메인 룸 리스트
  // const roomList = useSelector((state) => state.room.roomList);
  const [isLoading, setIsLoading] = useState(false);
  const [roomList, setRoomList] = useState([]);
  // const [rooms, setRooms] = useState([]);
  const [isActive, setIsActive] = useState(null);
  //초기에는 모든 이미지가 컬러인 상태로 보여야해서 추가한 state
  const [isClicked, setIsClicked] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  // const [ro`oms, setRooms] = useState([])
  const LIMIT = 6; //axios요청시 6개씩
  const [page, setPage] = useState(1);
  const [roomsLength, setRoomsLength] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [category, setCategory] = useState("전체");

  useEffect(() => {
    let initialPage = 1;

    let body = {
      page: initialPage,
      perPage: LIMIT,
      category: category,
      loadMore: false,
    };
    getRoomListByCategory(body);
    setIsLoading(false);
    setPage(initialPage);

    return () => {
      setRoomList([]);
    };
  }, [category]);

  //메인에서 로드되는 카테고리별 리스트 axios
  const getRoomListByCategory = (body) => {
    axios
      .get(
        `${API_URL}/api/main/tag/${body.category}?page=${body.page}&perPage=${body.perPage}`
      )
      .then((res) => {
        if (res.data.result) {
          if (body.loadMore) {
            //더보기 버튼 클릭시
            setRoomList([...roomList, ...res.data?.roomList]);
          } else {
            setRoomList([...res.data?.roomList]);
          }
          setRoomsLength(res.data?.tagLength);
          setIsLoading(false);
        } else {
          alert(`${category}게시물 로드 실패`);
        }
      });
  };

  const loadMoreHandler = () => {
    let addedPage = page + 1;
    let body = {
      page: addedPage,
      perPage: LIMIT,
      category: category,
      loadMore: true,
    };
    getRoomListByCategory(body);
    setPage(addedPage);
    setLoadMore(true);
  };

  function categoryClickHandler(e, clickedCategory) {
    e.preventDefault();
    setCategory(clickedCategory);
    setLoadMore(false);
    setPage(1);
  }

  return (
    <>
      <Container>
        <CateBox>
          <TitleH2>카테고리</TitleH2>
          <Swiper
            style={{ cursor: "pointer" }}
            modules={[Navigation, Scrollbar]}
            spaceBetween={10}
            slidesPerView={8}
            allowTouchMove={false}
            navigation
            scrollbar={{ draggable: false }}
            onClick={(swiper) => {
              setIsActive((prev) => swiper.clickedIndex);
              setIsClicked(true);
            }}
            //반응형 적용x
          >
            {CATEGORY_LIST.map((cate, idx) => (
              <SwiperSlide
                key={cate.num}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  border: "none",
                  height: "200px",
                }}
                className={
                  isClicked
                    ? idx === isActive
                      ? " -active"
                      : " -not-active"
                    : ""
                }
                onClick={(e) => {
                  categoryClickHandler(e, cate.name);
                }}
                value={idx}
              >
                <Img src={cate.imageUrl} style={{ filter: "none" }} />
                <Title>{cate.name}</Title>
              </SwiperSlide>
            ))}
          </Swiper>
        </CateBox>
      </Container>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {!isLoading ? (
          roomList.length > 0 ? (
            <>
              <RoomListCont>
                {roomList.map((room) => {
                  return (
                    <Room
                      key={room._id}
                      roomId={room.roomId}
                      imgUrl={room.imgUrl ? room.imgUrl : roomImg}
                      title={room.title}
                      content={room.content}
                      date={room?.date}
                      tagName={room?.tagName}
                      groupNum={room?.groupNum}
                      //만약에 서버의 isLiked 값이 없으면 false(기본)값을 내려준다.
                      isLiked={room.likeUser}
                      lock={room.lock ? room.lock : false}
                    ></Room>
                  );
                })}
              </RoomListCont>
            </>
          ) : (
            <Div>게시물이 없습니다.😓</Div>
          )
        ) : (
          <Spinner />
        )}
        {/* 만약 현재보고있는 room의 수가 게시물의 길이보다 같거나 크다면 showmore
        버튼을 숨긴다. */}
        {roomsLength > roomList.length && (
          <ButtonBox>
            <LoadMoreBtn
              onClick={() => {
                loadMoreHandler();
              }}
            >
              더보기
            </LoadMoreBtn>
          </ButtonBox>
        )}
      </div>
    </>
  );
};

export default RoomList;

const Container = styled.section`
  width: 100%;
  min-height: 350px;
  background-color: #eff3f6;
  display: flex;
  align-items: center;
  justify-content: center;
  //margin-bottom은 mainpage의 section에서 적용했던 것
`;
const CateBox = styled.div`
  max-width: 1200px;
  background-color: #eff3f6;
`;

const Img = styled.img`
  height: 120px;
  /* width: 12vw; */
  border-radius: 50%;
  margin: 20px 0 12px 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;

const TitleH2 = styled.h2`
  padding-left: 5px;
  font-size: 1.7rem;
  font-weight: 700;
  line-height: 42px;
`;
//여기서부터가 룸 리스트 CSS
const RoomListCont = styled.div`
  padding: 60px 20px;
  width: 1200px;
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  grid-column-gap: 25px;
  grid-row-gap: 25px;
`;
const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin-bottom: 60px; */
`;
const LoadMoreBtn = styled.button`
  /* color: rgba(0, 0, 0, 0.35); */
  font-size: 1.2rem;
  font-weight: 600;
  background-color: inherit;
  display: inline-block;
  padding: 0.5em 3em;
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 5px;
  transition: 0.2s;

  &:hover {
    color: white;
    background-color: #2e70e0;
    border: 2px solid #2e70e0;
  }
`;
const Div = styled.div`
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
`;
