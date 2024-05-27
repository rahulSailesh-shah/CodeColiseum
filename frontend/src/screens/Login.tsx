import { Button } from "@/components/ui/button";
import googleIcon from "@/assets/google.png";
import githubIcon from "@/assets/github.png";
import loginBG from "@/assets/login_bg.jpg";

const BACKEND_URL = "http://localhost:8000";

export default function Login() {
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
            <div className="h-[1px] w-full bg-gray-300 rounded"></div>
          </div>
          <div className="grid gap-4">
            <Button className="w-full" onClick={google}>
              <img
                src={googleIcon}
                alt="img-alt-placeholder"
                className="h-4 w-4 mr-2"
              />
              Login with Google
            </Button>
            <Button className="w-full" onClick={github}>
              <img
                src={githubIcon}
                alt="img-alt-placeholder"
                className="h-4 w-4 mr-2"
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
