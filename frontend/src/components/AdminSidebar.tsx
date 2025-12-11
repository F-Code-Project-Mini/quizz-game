import { LayoutDashboard, PlayCircle, Users, Settings, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: PlayCircle, label: "Phòng chơi", path: "/admin/rooms" },
    { icon: Users, label: "Người chơi", path: "/admin/players" },
    { icon: Settings, label: "Cài đặt", path: "/admin/settings" },
];

const AdminSidebar = ({ isOpen = true, onClose }: AdminSidebarProps) => {
    return (
        <>
            {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

            <aside
                className={`fixed left-0 top-0 z-50 h-full w-64 bg-white border-r shadow-lg transition-transform duration-300 md:sticky md:top-16 md:z-0 md:h-[calc(100vh-4rem)] md:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b p-4 md:hidden">
                        <h2 className="text-lg font-bold">Menu</h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <nav className="flex-1 space-y-1 p-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                                            isActive
                                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`
                                    }
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="border-t p-4">
                        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-3">
                            <p className="text-xs font-bold text-gray-800">Quiz Game F-CODE</p>
                            <p className="text-xs text-gray-600">Version 1.0.0</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
