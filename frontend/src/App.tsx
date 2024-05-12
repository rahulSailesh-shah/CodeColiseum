import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Home } from "./screens/Home";
import { EditorScreen } from "./screens/Editor";
import { useEffect } from "react";
import { useSocketStore } from "./store";

function App() {
    const setSocket = useSocketStore((state) => state.setSocket);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        socket.onopen = () => {
            setSocket(socket);
            console.log("Connected to Socket Server");
        };
    });

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/contest/:contestID' element={<EditorScreen />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
