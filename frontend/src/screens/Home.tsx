import { getUser } from "@/api/getUser";
import { NavMenu } from "@/components/NavMenu";
import { useUserStore } from "@/store";
import { useEffect } from "react";
// import { ROOM_CREATED } from "@/lib/messages";
// import { useSocketStore } from "@/store";

export const Home = () => {
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (!user) return;
      setUser({
        user,
      });
    };
    fetchUser();
  }, [setUser]);

  // useEffect(() => {
  //   if (!socket) return;

  //   socket.onmessage = (event) => {
  //     const message = JSON.parse(event.data);

  //     if (message.type === ROOM_CREATED) {
  //       const { contestID } = message.payload;
  //       navigate(`/contest/${contestID}`);
  //     }
  //   };
  // }, [navigate, socket]);

  // const initContest = () => {
  //   socket?.send(
  //     JSON.stringify({
  //       type: "init_contest",
  //     })
  //   );
  // };

  return (
    <div>
      <NavMenu />
    </div>
  );
};
