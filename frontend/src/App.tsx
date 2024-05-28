import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Home } from "./screens/Home";
import { EditorScreen } from "./screens/Editor";
import Login from "./screens/Login";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <Auth />
      <Toaster />
    </>
  );
}

function Auth() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contest/:contestID" element={<EditorScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
