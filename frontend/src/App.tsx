import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import WaitPage from "./pages/Wait";
import MasterLayout from "./layouts/MasterLayout";
import DemoPage from "./pages/Demo";
import RunningPage from "./pages/Running";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<MasterLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/wait" element={<WaitPage />} />
                <Route path="/demo" element={<DemoPage />} />
                <Route path="/running" element={<RunningPage />} />
            </Route>
        </Routes>
    );
};

export default App;
