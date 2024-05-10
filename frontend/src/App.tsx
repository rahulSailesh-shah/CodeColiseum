import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Home } from "./screens/Home";
import { EditorScreen } from "./screens/Editor";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/editor' element={<EditorScreen />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
