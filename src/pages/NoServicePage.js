import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LoadingP from "../shared/404-assets/loading-p.gif";

function NoServicePage() {
  const navigate = useNavigate();
  return (
    <NotFoundCont>
      <ContentTitle>
        <span>서비스 준비중...👾</span>

        <br />
      </ContentTitle>
      <div
        style={{
          fontSize: "1.3rem",
          margin: "10px 0",
          color: "#94bbe9",
          fontWeight: "700",
        }}
      >
        ▼
      </div>
      <Content>
        <HomeButton
          onClick={() => {
            navigate("/");
          }}
        >
          go to Home
        </HomeButton>
      </Content>
      <ContentImg src={LoadingP} alt="404NotFound" />
    </NotFoundCont>
  );
}

export default NoServicePage;

const NotFoundCont = styled.div`
  height: 80vh;
  color: var(--blue-black);
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
  font-weight: 600;
`;
const ContentTitle = styled.h1`
  background-color: var(--egloo-gray);
  padding: 5px 10px;
  border-radius: 7px;
  text-align: center;
  font-size: 1.4rem;
  line-height: 2rem;
  margin: 0 20px;
  box-shadow: var(--card-box-shadow);
`;
const Content = styled.section`
  font-size: 1.5rem;
`;

const HomeButton = styled.button`
  width: 200px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  margin: 20px;
  height: 55px;
  text-align: center;
  border: none;
  background-size: 300% 100%;

  border-radius: 50px;
  moz-transition: all 0.4s ease-in-out;
  -o-transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  font-weight: 600;
  background-image: linear-gradient(
    to right,
    #25aae1,
    #4481eb,
    #04befe,
    #3f86ed
  );
  box-shadow: 0 4px 15px 0 rgba(65, 132, 234, 0.75);

  &:hover {
    background-position: 100% 0;
    moz-transition: all 0.4s ease-in-out;
    -o-transition: all 0.4s ease-in-out;
    -webkit-transition: all 0.4s ease-in-out;
    transition: all 0.4s ease-in-out;
    margin: 0 0 20px 0;
  }
`;
const ContentImg = styled.img`
  border-radius: 10px;
  width: 400px;
`;
