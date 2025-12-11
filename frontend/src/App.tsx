import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import WaitPage from "./pages/Wait";
import MasterLayout from "./layouts/MasterLayout";
import AdminLayout from "./layouts/AdminLayout";
import DemoPage from "./pages/Demo";
import RunningPage from "./pages/Running";
import LoginPage from "./pages/Login";
import ResultPage from "./pages/Result";
import CreateQuizPage from "./pages/CreateQuiz";
import AdminDashboard from "./pages/Admin/Dashboard";
import RoomManagement from "./pages/Admin/RoomManagement";
import HostView from "./pages/Host";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<MasterLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/wait" element={<WaitPage />} />
                    <Route path="/demo" element={<DemoPage />} />
                    <Route path="/running" element={<RunningPage />} />
                    <Route path="/result" element={<ResultPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/create-quiz" element={<CreateQuizPage />} />
                    <Route path="/host/:roomId" element={<HostView />} />
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Route>

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="room/:roomId" element={<RoomManagement />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
};

export default App;
