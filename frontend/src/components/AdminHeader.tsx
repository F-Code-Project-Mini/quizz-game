import { LogOut, Menu, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { Button } from "./ui/button";

interface AdminHeaderProps {
    onMenuClick?: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
    const { logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                        <Menu className="h-6 w-6" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 p-2">
                            <img src="/logo.svg" alt="Logo" className="h-6 w-6 md:h-8 md:w-8" />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-black text-gray-800">Quiz Game Admin</h1>
                            <p className="hidden md:block text-xs text-gray-500">F-CODE Management</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="rounded-full"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">
                                <User className="h-5 w-5" />
                            </div>
                        </Button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border">
                                <div className="p-3 border-b">
                                    <p className="text-sm font-bold text-gray-800">Admin</p>
                                    <p className="text-xs text-gray-500">Quản trị viên</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
