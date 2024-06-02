import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Home } from "./screens/Home";
import { EditorScreen } from "./screens/Editor";
import Login from "./screens/Login";
import { Toaster } from "./components/ui/toaster";
import { useUserStore } from "./store";
import { useEffect } from "react";
import Contest from "./screens/Contest";
import { NextUIProvider } from "@nextui-org/react";

function App() {
  return (
    <>
      <NextUIProvider>
        <Auth />
        <Toaster />
      </NextUIProvider>
    </>
  );
}

function Auth() {
  const { user, fetchUser } = useUserStore((state) => state);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contest" element={<Contest />} />
        <Route
          path="/contest/:contestID"
          element={user ? <EditorScreen /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
