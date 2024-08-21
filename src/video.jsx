import Footer from "./components/Footer";
import VideoChat from "./components/VideoChat";
import SideBar from "./components/SideBar";
import { useState } from "react";
import { SOCKET_URL } from "./config-global";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
function Videos() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { id } = useParams();
  const socket = io(SOCKET_URL);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="min-h-screen flex flex-col">
      <VideoChat socket={socket} />
      <SideBar openModal={isSidebarOpen} handleButton={toggleSidebar} />
      <Footer handleButton={toggleSidebar} IdUsers={id} />
    </div>
  );
}
export default Videos;
