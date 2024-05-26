import { NavMenu } from "@/components/NavMenu";
import { ROOM_CREATED } from "@/lib/messages";
import { useSocketStore } from "@/store";
import { Button } from "@nextui-org/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const BACKEND_URL = "http://localhost:8000";

export const Home = () => {
  const socket = useSocketStore((state) => state.socket);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === ROOM_CREATED) {
        const { contestID } = message.payload;
        navigate(`/contest/${contestID}`);
      }
    };
  }, [navigate, socket]);

  const initContest = () => {
    socket?.send(
      JSON.stringify({
        type: "init_contest",
      })
    );
  };

  const makeRequest = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const google = () => {
    window.open(`${BACKEND_URL}/auth/google`, "_self");
  };

  return (
    <div>
      <NavMenu initContest={initContest} />
      <Button onClick={makeRequest}>Check</Button>
      <Button onClick={google}>Login With Google</Button>
    </div>
  );
};
