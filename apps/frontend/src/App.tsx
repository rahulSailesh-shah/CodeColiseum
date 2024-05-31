import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Home } from "./screens/Home";
import { EditorScreen } from "./screens/Editor";
import Login from "./screens/Login";
import { Toaster } from "./components/ui/toaster";
import { useUserStore } from "./store";
import { useEffect } from "react";

function App() {
  return (
    <>
      <Auth />
      <Toaster />
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
        <Route
          path="/contest/:contestID"
          element={user ? <EditorScreen /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
