import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import SimplePeer from "simple-peer/simplepeer.min.js";
import { SOCKET_URL } from "../../config-global";

const socket = io(SOCKET_URL);

const VideoChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [peer, setPeer] = useState(null);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  console.log('myVideo :', myVideo);
  console.log('userVideo :', userVideo);

  useEffect(() => {
    console.log("Attempting to connect to server...");
    socket.on("connect", () => {
      console.log("Connected to server with socket ID:", socket.id);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    return () => {
      socket.off("connect");
    };
  }, []);
  useEffect(() => {
    if (myVideo.current) {
      console.log('myVideo :', myVideo);
    } else {
      console.log('myVideo is still undefined, checking conditions...');
    }
  }, [myVideo]);
  
  useEffect(() => {
    if (userVideo.current) {
      console.log('userVideo :', userVideo);
    } else {
      console.log('userVideo is still undefined, checking conditions...');
    }
  }, [userVideo]);
  

  useEffect(() => {
    const handleCallUser = ({ from, name }) => {
      console.log(`Received 'callUser' from ${from} (${name})`);
      const newPeer = new SimplePeer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      newPeer.on("signal", (data) => {
        console.log("User sending signal:", data);
        socket.emit("signal", { to: from, signalData: data });
      });

      newPeer.on("stream", (remoteStream) => {
        console.log("Received remote stream");
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        } else {
          console.error("userVideo.current is not defined");
        }
      });

      socket.on("signal", (data) => {
        console.log("User received signal:", data);
        newPeer.signal(data.signalData);
      });

      setPeer(newPeer);
      connectionRef.current = newPeer;
    };

    socket.on("callUser", handleCallUser);

    return () => {
      socket.off("callUser", handleCallUser);
    };
  }, [stream]);

  useEffect(() => {
    if (peer) {
      peer.on("signal", (data) => {
        socket.emit("signal", { to: id, signalData: data });
      });

      peer.on("stream", (remoteStream) => {
        console.log("Received remote stream in peer effect");
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        } else {
          console.error("userVideo.current is not defined in peer effect");
        }
      });

      socket.on("signal", (data) => {
        console.log("User received signal:", data);
        peer.signal(data.signalData);
      });

      socket.on("callAccepted", () => {
        setCallAccepted(true);
      });

      socket.on("callEnded", () => {
        setCallEnded(true);
        peer.destroy();
      });

      connectionRef.current = peer;

      return () => {
        peer.destroy();
        socket.off("signal");
        socket.off("callAccepted");
        socket.off("callEnded");
      };
    }
  }, [peer, id]);

  useEffect(() => {
    if (callEnded) {
      if (id === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [callEnded, navigate, id]);
  
  return (
    <div className="flex-1 flex items-center justify-center bg-[#202124]">
      <div>
        <video
          ref={myVideo}
          autoPlay
          playsInline
          muted
          style={{ width: "500px" }}
        />
      </div>
      <div>
        {callAccepted && !callEnded ? (
          <video
            playsInline
            ref={userVideo}
            autoPlay
            style={{ width: "500px" }}
          />
        ) : (
          <p>Waiting for call to be accepted...</p>
        )}
      </div>
    </div>
  );
};

export default VideoChat;
