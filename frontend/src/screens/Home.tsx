import { NavMenu } from "@/components/NavMenu";
import { useUserStore } from "@/store";
import { Button } from "@nextui-org/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { ROOM_CREATED } from "@/lib/messages";
// import { useSocketStore } from "@/store";

export const Home = () => {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div>
      <NavMenu />
      <Button onClick={() => navigate("/contest/9874139569")}>
        Start Contest
      </Button>
    </div>
  );
};
