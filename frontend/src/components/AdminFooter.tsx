const AdminFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-white py-4">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-gray-600">&copy; {currentYear} Quiz Game F-CODE. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default AdminFooter;
