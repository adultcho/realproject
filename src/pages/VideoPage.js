import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import VideoHeader from "../components/videoPage/mainScreen/VideoHeader";
import SideView from "../components/videoPage/sideBar/SideView";

import Peer from "simple-peer";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "../App.css";

import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import UnderBar from "../components/videoPage/mainScreen/UnderBar";

import { AiFillAudio } from "react-icons/ai";
import { BsFillMicMuteFill } from "react-icons/bs";
import { TbVideo, TbVideoOff } from "react-icons/tb";

//socket
import io from "socket.io-client";

const socket = io.connect("https://egloo.shop");

const VideoPage = () => {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { state } = useLocation();
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);

  // //camera, audio device select
  // const [cameraDevice, setCameraDevice] = useState([]);
  // const [audioDevice, setAudioDevice] = useState([]);

  // //선택한 device 적용
  // const [audioId, setAudioId] = useState();
  // const [cameraId, setCameraId] = useState();

  //camera, audioState control
  const [videoState, setVideoState] = useState(false);
  const [audioState, setAudioState] = useState(false);

  const [openBar, setOpenBar] = useState(true);

  const nickname = localStorage.getItem("nickname");
  const profileImg = localStorage.getItem("profile");

  // 타이머
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [title, setTitle] = useState("");
  const time_ref = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  //들어갈때

  const poststartData = () => {
    axios({
      method: "POST",
      url: `/api/room/public-room/${roomId}/${userId}`,

      baseURL: API_URL,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setTitle(response.data.title);
        setHours(response.data.hour);
        setMinutes(response.data.minute);
        setSeconds(response.data.second);
      })
      .catch((error) => {});
  };

  const postsecretData = () => {
    axios({
      method: "POST",
      url: `/api/room/private-room/${roomId}/${userId}`,
      data: {
        password: state.password,
      },
      baseURL: API_URL,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response);
        setHours(response.data.hour);
        setMinutes(response.data.minute);
        setSeconds(response.data.second);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    if (state.lock) {
      postsecretData();
    } else {
      poststartData();
    }
  }, []);

  const postTimerData = () => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    axios({
      method: "POST",
      url: `/api/room/exit/${roomId}/${userId}`,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      baseURL: API_URL,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {});
  };
  const reloadTimerData = () => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    axios({
      method: "POST",
      url: `/api/room/exit/${roomId}/${userId}`,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      baseURL: API_URL,
    })
      .then((response) => {})
      .catch((error) => {});
  };

  const exitRoomHandler = () => {
    MySwal.fire({
      title: "EXIT",
      text: "정말 나가시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        postTimerData();
        navigate("/");
        window.location.reload();
      }
    });
  };

  useEffect(() => {
    time_ref.current = setInterval(() => {
      setSeconds(seconds + 1);
      if (seconds === 59) {
        setMinutes(minutes + 1);
        setSeconds(0);
        if (seconds === 59 && minutes === 59) {
          setHours(hours + 1);
          setMinutes(0);
          setSeconds(0);
        }
      }
    }, 1000);
    return () => clearInterval(time_ref.current);
  });
  // 새로고침 이벤트 감지
  const preventClose = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };
  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", preventClose);
      window.addEventListener("beforeunload", reloadTimerData);
    })();
    return () => {
      window.removeEventListener("beforeunload", preventClose);
      window.addEventListener("beforeunload", reloadTimerData);
    };
  }, []);

  // sidebar
  const sideBarHandler = () => {
    if (openBar) {
      setOpenBar(false);
    } else {
      setOpenBar(true);
    }
  };

  //camera on/off btn click
  const cameraClick = () => {
    userVideo.current.srcObject
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    if (!videoState) {
      setVideoState(true);
    } else {
      setVideoState(false);
    }
  };

  //audioState on/off btn click
  const muteClick = () => {
    userVideo.current.srcObject
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    if (!audioState) {
      setAudioState(true);
    } else {
      setAudioState(false);
    }
  };

  useEffect(() => {
    socketRef.current = socket;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        const data = {
          roomId,
          nickname,
          profileImg,
        };
        socketRef.current.emit("join room", data);
        socketRef.current.on("all users", (users) => {
          users.forEach((user) => {
            const peer = createPeer(
              user.socketId,
              socketRef.current.id,
              stream
            );
            const peerObj = {
              peerID: user.socketId,
              peerNickname: user.nickname,
              peerProfileImg: user.profileImg,
              peer,
            };
            peersRef.current.push(peerObj);
            setPeers((users) => [...users, peerObj]);
          });
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          const newPeer = {
            peerID: payload.callerID,
            peerNickname: payload.callerNickname,
            peerProfileImg: payload.callerProfileImg,
            peer,
          };
          peersRef.current.push(newPeer);

          setPeers((users) => [...users, newPeer]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });

    socketRef.current.on("user left", (payload) => {
      alert(payload.userInfo.nickname + "님이 나갔대요(수근수근)");

      const peerObj = peersRef.current.find(
        (p) => p.peerID === payload.socketId
      );
      if (peerObj) {
        peerObj.peer.on("close", () => {
          //peer연결 끊기
          peerObj.peer.destroy();
        });
      }
      const newPeers = peersRef.current.filter(
        (p) => p.peerID !== payload.socketId
      );
      peersRef.current = newPeers;

      setPeers((oldPeers) =>
        oldPeers.filter((p) => p.peerID !== payload.socketId)
      );
    });
  }, [roomId, nickname]);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  // 새로고침 뒤로가기 이벤트 감지

  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", postTimerData);
    })();
    return () => {
      window.removeEventListener("beforeunload", postTimerData);
    };
  }, []);

  return (
    <>
      <ScreenWrapper>
        {/* Main Screen */}
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <VideoHeader
            title={title}
            exitRoomHandler={exitRoomHandler}
            openBar={openBar}
            roomId={roomId}
            userVideo={userVideo}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
          />
          {/* <Timer roomId={roomId} /> */}

          <div
            className="video-area"
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* video 화면 grid */}
            <Screen BarState={!openBar}>
              {/* 내 화면 */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <StyledVideo muted ref={userVideo} autoPlay playsInline />
                <VideoInfo
                  nickname={nickname}
                  audioState={audioState}
                  videoState={videoState}
                  profileImg={profileImg}
                />
              </div>

              {peers.map((peer) => {
                return (
                  // 다른 유저 입장시 화면
                  <div
                    key={peer.peerID}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <Video peer={peer.peer} />
                    <VideoInfo
                      peer={peer.peer}
                      nickname={peer.peerNickname}
                      audioState={audioState}
                      videoState={videoState}
                      profileImg={peer.peerProfileImg}
                    />
                  </div>
                );
              })}
            </Screen>

            {/* 장치 선택 */}
            {/* <div className="devices">
          
          <select id="cameras" onChange={cameraSelect}>
            {cameraDevice.map((camera, index) => {
              return (
                <option key={index} value={camera.deviceId}>
                  {camera.label}
                </option>
              );
            })}
          </select>
          
          <select onChange={audioSelect} id="audios">
            {audioDevice.map((audio) => {
              return (
                <option key={audio.deviceId} value={audio.deviceId}>
                  {audio.label}
                </option>
              );
            })}
          </select>
        </div> */}

            <Btn onClick={sideBarHandler}>
              {openBar ? (
                <div>
                  <MdArrowForwardIos />
                </div>
              ) : (
                <div>
                  <MdArrowBackIos />
                </div>
              )}
            </Btn>
          </div>

          {/* Main Screen 하단 기능 아이콘 */}

          <UnderBar
            openBar={openBar}
            sideBarHandler={sideBarHandler}
            cameraHandler={cameraClick}
            audioHandler={muteClick}
            videoState={videoState}
            audioState={audioState}
          />
        </div>

        {/* sideBar */}

        <SideView
          openBar={openBar}
          socket={socket}
          nick={nickname}
          roomId={roomId}
        />

        {/* sideBar */}
      </ScreenWrapper>
    </>
  );
};

const Video = (props) => {
  const ref = useRef();

  props.peer.on("stream", (stream) => {
    ref.current.srcObject = stream;
  });

  return <StyledVideo playsInline autoPlay ref={ref} />;
};
const VideoInfo = (props) => {
  return (
    <UnderPlusBar
      style={{
        width: "100%",
        height: "17%",
        backgroundColor: "#333333",
      }}
    >
      <div>
        <div className="user_img">
          <img
            style={{
              objectFit: "cover",
              width: "33px",
              height: "33px",
              borderRadius: "50%",
            }}
            src={props.profileImg}
            alt=""
          />
        </div>
        <span className="user_name">{props.nickname}</span>
      </div>
      <DeviceSelctor className="video_control_btn">
        <div className="audio">
          {props.audioState ? <BsFillMicMuteFill /> : <AiFillAudio />}
        </div>
        <div className="camera">
          {props.videoState ? <TbVideoOff /> : <TbVideo />}
        </div>
      </DeviceSelctor>
    </UnderPlusBar>
  );
};

const StyledVideo = styled.video`
  height: 83%;
  width: 100%;
  object-fit: cover;
`;

const ScreenWrapper = styled.div`
  display: flex;
  background-color: black;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const Screen = styled.main`
  display: grid;
  width: ${(props) => (props.BarState ? "100vw" : "77vw")};
  padding: 40px;
  gap: ${(props) => (props.BarState ? "5px" : "15px")};
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: ${(props) =>
    props.BarState ? "25vw 25vw" : "20vw 20vw"};
  transition: all 0.5s;
`;

const Btn = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  margin: auto 0;
  align-items: center;
  right: 0;
  height: 100px;
  width: 0;
  border-right: 25px solid #e9e9e9;
  border-top: 20px solid black;
  border-bottom: 20px solid black;
  cursor: pointer;
  div {
    padding-left: 5px;
    font-size: 20px;
    color: #8b95a1;
  }
`;

const UnderPlusBar = styled.div`
  display: flex;
  justify-content: space-between;
  place-items: center;
  color: lightgray;
  font-weight: bold;
  padding: 10px;
  div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .user_img {
    width: 33px;
    height: 33px;
    border-radius: 50%;
  }
`;

const DeviceSelctor = styled.div`
  .camera {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background-color: black;
    color: lightgray;
    border-radius: 50%;
    font-size: 23px;
    padding: 5px;
    box-sizing: border-box;
  }
  .audio {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background-color: black;
    color: lightgray;
    border-radius: 50%;
    font-size: 23px;
    padding: 5px;
    box-sizing: border-box;
  }
`;

export default VideoPage;
