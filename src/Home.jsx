import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { SOCKET_URL } from "./config-global";
import Modal from "./components/modal";

const socket = io(SOCKET_URL);

function Home() {
  const navigate = useNavigate();
  const myVideo = useRef();
  const [stream, setStream] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [name, setName] = useState("");
  const [Me, setMe] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    console.log("Attempting to connect to server...");
    socket.on("me", (id) => {
      console.log("Received 'me' event from server. My ID:", id);
      setMe(id);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Media stream acquired:", stream);
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    return () => {
      console.log("Cleaning up 'me' event listener.");
      socket.off("me");
    };
  }, []);

  const handleConnect = () => {
    console.log("Connecting call with data:", { name, phoneNumber });
    socket.emit("requestCall", { name, phoneNumber });
    navigate(`/video/${Me}`);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
      <Modal
        setName={setName}
        isModalOpen={isModalOpen}
        setPhoneNumber={setPhoneNumber}
        handleConnect={handleConnect}
        phoneNumber={phoneNumber}
        name={name} // اطمینان از ارسال پروپ name
      />

      <div>
        <video
          ref={myVideo}
          autoPlay
          playsInline
          muted
          style={{ width: "1000px" }}
        />
      </div>
    </div>
  );
}

export default Home;
