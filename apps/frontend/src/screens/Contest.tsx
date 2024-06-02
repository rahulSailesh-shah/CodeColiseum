import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import googleIcon from "@/assets/google_white.png";
import githubIcon from "@/assets/github_white.png";
import { useUserStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

const Contest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);

  const handleShareClick = () => {
    console.log(user);
    if (user?.name && user?.token) {
      const contestID = uuidv4();
      navigate(`/contest/${contestID}`);
    } else {
      setIsOpen(true);
    }
  };

  const google = () => {
    window.open(`${BACKEND_URL}/auth/google`, "_self");
  };

  const github = () => {
    window.open(`${BACKEND_URL}/auth/github`, "_self");
  };

  return (
    <div>
      <Button
        type="button"
        className="bg-sky-800 hover:bg-sky-900"
        onClick={handleShareClick}
      >
        Start Contest
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required!</DialogTitle>
            <DialogDescription>
              Only authenticated users can start a contest.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Button
              className="w-full bg-sky-800 hover:bg-sky-900 text-white"
              onClick={google}
            >
              <img
                src={googleIcon}
                alt="img-alt-placeholder"
                className="h-5 w-5 mr-2"
              />
              Login with Google
            </Button>
            <Button
              className="w-full bg-sky-800 hover:bg-sky-900 text-white"
              onClick={github}
            >
              <img
                src={githubIcon}
                alt="img-alt-placeholder"
                className="h-5 w-5 mr-2"
              />
              Login with Github
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contest;
