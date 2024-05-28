import { Button } from "@/components/ui/button";

import googleIcon from "@/assets/google.png";
import githubIcon from "@/assets/github.png";
import loginBG from "@/assets/login_bg.jpg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export default function Login() {
  const navigate = useNavigate();
  const google = () => {
    window.open(`${BACKEND_URL}/auth/google`, "_self");
  };

  const github = () => {
    window.open(`${BACKEND_URL}/auth/github`, "_self");
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold mb-2">CodeColiseum</h1>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Username</Label>
              <Input id="email" type="email" placeholder="John Doe" required />
            </div>

            <Button className="w-full bg-sky-800" onClick={() => navigate("/")}>
              Enter as Guest
            </Button>

            <div className="w-full flex justify-center items-center mb-2 mt-2">
              <div className="mr-2 w-[5.5rem] h-[1px] bg-gray-400"></div>
              <span className="text-gray-600">OR CONTINUE WITH</span>
              <div className="ml-2 w-[5.5rem] h-[1px] bg-gray-400"></div>
            </div>
            <Button variant="outline" className="w-full" onClick={google}>
              <img
                src={googleIcon}
                alt="img-alt-placeholder"
                className="h-5 w-5 mr-2"
              />
              Login with Google
            </Button>
            <Button variant="outline" className="w-full" onClick={github}>
              <img
                src={githubIcon}
                alt="img-alt-placeholder"
                className="h-5 w-5 mr-2"
              />
              Login with Github
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block h-screen">
        <img
          src={loginBG}
          alt="img-alt-placeholder"
          className="h-screen w-full object-cover"
        />
      </div>
    </div>
  );
}
