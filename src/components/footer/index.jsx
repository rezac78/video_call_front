import { PhoneIcon } from "../../../public/Phone";
import { ChatIcon } from "../../../public/ChatIcon";
import useCurrentTime from "../../utils/useCurrentTime";
import PropTypes from "prop-types";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../../config-global";

const socket = io(SOCKET_URL);
function Footer({ handleButton, IdUsers }) {
  const time = useCurrentTime();

  const handleEndCall = () => {
    socket.emit("callEnded");
  };

  return (
    <div>
      <footer className="bg-[#202124] text-white flex flex-col sm:flex-row justify-between items-center p-4">
        <div className="text-left mb-4 sm:mb-0 flex-1">
          <p>
            {time} | {IdUsers}
          </p>
        </div>
        <div className="flex justify-center flex-1 mb-4 sm:mb-0">
          <button className="px-6 py-2 rounded-full bg-[#EA4335]" onClick={handleEndCall}>
            <PhoneIcon />
          </button>
        </div>
        <div className="flex space-x-2 flex-1 justify-end">
          <button className="px-4 py-2" onClick={handleButton}>
            <ChatIcon />
          </button>
        </div>
      </footer>
    </div>
  );
}

Footer.propTypes = {
  IdUsers: PropTypes.string.isRequired,
  handleButton: PropTypes.func.isRequired,
};
export default Footer;
