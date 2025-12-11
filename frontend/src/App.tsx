import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import WaitPage from "./pages/Wait";
import MasterLayout from "./layouts/MasterLayout";
import DemoPage from "./pages/Demo";
import RunningPage from "./pages/Running";
import LoginPage from "./pages/Login";
import ResultPage from "./pages/Result";
import CreateQuizPage from "./pages/CreateQuiz";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<MasterLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/wait" element={<WaitPage />} />
                <Route path="/demo" element={<DemoPage />} />
                <Route path="/running" element={<RunningPage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<div>404 Not Found</div>} />
                <Route path="/create-quiz" element={<CreateQuizPage />} />
            </Route>
        </Routes>
    );
};

export default App;
