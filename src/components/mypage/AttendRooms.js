import axios from "axios";
import React from "react";
import styled from "styled-components";

import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import basicRoomImg from "../../shared/mainpage-assets/basic-room-img.png";
import "../../styles/swiper.css";

import SmallRoom from "./SmallRoom";

const AttendRooms = ({ attendRooms }) => {
  return (
    <RoomListCont>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        //반응형 적용x
      >
        {attendRooms.length > 0 ? (
          <>
            {attendRooms.map((room) => {
              return (
                <SwiperSlide>
                  <SmallRoom
                    key={room.roomId}
                    roomId={room.roomId}
                    imgUrl={room.imgUrl ? room.imgUrl : basicRoomImg}
                    title={room.title}
                    date={room.date}
                    groupNum={room.groupNum}
                    lock={room.lock}
                  ></SmallRoom>
                </SwiperSlide>
              );
            })}
          </>
        ) : (
          <NoContent>리스트가 없습니다.😪</NoContent>
        )}
      </Swiper>
    </RoomListCont>
  );
};

export default AttendRooms;

const RoomListCont = styled.div`
  width: 100%;
  margin-bottom: 100px;
  /* padding: 10px; */
`;

const NoContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  font-weight: 700;
`;
