import { NavMenu } from "@/components/NavMenu";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store";
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
    <div className="bg-slate-100 w-screen h-screen">
      <NavMenu />
      <Button onClick={() => navigate("/contest/9874139569")}>
        Start Contest
      </Button>
    </div>
  );
};
