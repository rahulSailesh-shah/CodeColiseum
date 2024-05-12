import { NavMenu } from "@/components/NavMenu";
import { ROOM_CREATED } from "@/lib/messages";
import { useSocketStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

    return (
        <div>
            <NavMenu initContest={initContest} />
        </div>
    );
};
