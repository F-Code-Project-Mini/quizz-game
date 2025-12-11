import { useState } from "react";
import AdminHeader from "~/components/AdminHeader";
import AdminSidebar from "~/components/AdminSidebar";
import AdminFooter from "~/components/AdminFooter";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col">
            <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

            <div className="flex flex-1">
                <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 bg-gray-50 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>

            <AdminFooter />
        </div>
    );
};

export default AdminLayout;
