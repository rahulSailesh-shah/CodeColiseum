// useAuthCheck.ts
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store";

const useAuthCheck = () => {
  const { user, fetchUser } = useUserStore();
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      setIsFetching(true);
      if (!user) {
        await fetchUser();
      }
      console.log(user);
      setIsFetching(false);
      if (!user) {
        navigate("/");
      }
    };
    checkUser();
  }, [user, fetchUser, navigate]);

  return { user, isFetching };
};

export default useAuthCheck;
