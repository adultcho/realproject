import "../styles/reset.css";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getMypageInfos } from "../redux/modules/myRoomSlice";

import { ReactComponent as EditUserInfoIcon } from "../shared/mypage-assets/icon-update-userInfo.svg";
import userAvatar from "../shared/mypage-assets/user-basic-img.png";

import Header from "../components/Header";
import Graph from "../components/Graph";
import Tab from "../components/mypage/Tab";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";

const Mypage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const TOKEN = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const modify = () => {
    navigate("/modify");
  };

  const myPageInfo = useSelector((state) => state.myRoom.myPageInfo);
  const isLoading = useSelector((state) => state.myRoom.isLoading);
  const hostRoomsLength = useSelector((state) => state.myRoom.hostRoomsLength);
  const attendRoomsLength = useSelector(
    (state) => state.myRoom.attendRoomsLength
  );
  const likeRoomsLength = useSelector((state) => state.myRoom.likeRoomsLength);

  useEffect(() => {
    dispatch(getMypageInfos());
  }, []);

  return (
    <MypageCont>
      <Header />
      <ContentBox>
        <UpperCont>
          <UpperTitle>마이페이지</UpperTitle>
          <Cont>
            <UserCardCont>
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <UserCardTop>
                    <img
                      alt="user"
                      src={
                        myPageInfo.profile_url
                          ? myPageInfo.profile_url
                          : userAvatar
                      }
                    />
                    <FlexCont>
                      <UserInfo>
                        <div>
                          {myPageInfo.nickname}님
                          <EditButton onClick={modify}>
                            <EditUserInfoIcon />
                          </EditButton>
                        </div>
                        <span>{myPageInfo.email}</span>
                      </UserInfo>
                    </FlexCont>
                  </UserCardTop>
                  <UserCardBottom>
                    <li>
                      참여중<span>{attendRoomsLength}</span>
                    </li>
                    <li>
                      호스팅중<span>{hostRoomsLength}</span>
                    </li>
                    <li>
                      찜<span>{likeRoomsLength}</span>
                    </li>
                  </UserCardBottom>
                </>
              )}
            </UserCardCont>
            <GraphCard>
              <Graph />
            </GraphCard>
          </Cont>
        </UpperCont>
        <RoomsCont className="menu-nav__cont">
          <Tab />
        </RoomsCont>
      </ContentBox>
      <Footer />
    </MypageCont>
  );
};
const MypageCont = styled.div`
  color: var(--blue-black);
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
`;
const ContentBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const UpperTitle = styled.h2`
  min-width: 1200px;
  margin: 60px 0 40px 0;
  font-weight: 700;
  font-size: 30px;
`;
const UpperCont = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding: 0 300px; */
  background-color: #f6f6f6;
`;
const Cont = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 100px;
  width: 1200px;
  justify-content: space-between;
`;

const UserCardCont = styled.div`
  width: 50%;
  height: 370px;
  background-color: #fff;
  border-radius: 10px;
  -webkit-box-shadow: var(--card-box-shadow);
  box-shadow: var(--card-box-shadow);
  overflow: hidden;
`;

const UserCardTop = styled.div`
  background-color: #fff;
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 47px 28px;
  border-bottom: 3px solid #e5e5e5;

  & > img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #d0d0d0;
    object-fit: cover;
    /* background: center; */
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  & > div {
    font-weight: 700;
    font-size: 30px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  & > span {
    font-weight: 700;
    font-size: 20px;
  }
`;

const FlexCont = styled.div`
  display: flex;
`;
const EditButton = styled.button`
  height: 20px;
  background: none;
  border: none;
  padding: 0;
  /* font-size: 16px; */
`;

const UserCardBottom = styled.ul`
  height: 45%;
  padding: 34px 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    font-size: 30px;
    font-weight: 700;
    & > span {
      font-size: 30px;
      font-weight: 400;
    }
  }
`;

const GraphCard = styled(UserCardCont)`
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--card-box-shadow);
`;
// const GraphCard = styled(UserCardCont)``;

const RoomsCont = styled.div`
  /* padding: 60px 276px; */
  height: 50%;
  align-items: center;
  justify-content: center;
  display: flex;
`;

export default Mypage;
