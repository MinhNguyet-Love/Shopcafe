import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedRoute from "./auth/ProtectedRoute";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductManager from "./pages/admin/ProductManager";
import TableManager from "./pages/admin/TableManager";
import OrderManager from "./pages/admin/OrderManager";
import Report from "./pages/admin/Report";

import Home from "./pages/user/Home";
import Menu from "./pages/user/Menu";
import Booking from "./pages/user/Booking";
import MyOrders from "./pages/user/MyOrders";

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User */}
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/my-orders" element={<MyOrders />} />

                {/* Admin */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute role="ADMIN">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductManager />} />
                    <Route path="tables" element={<TableManager />} />
                    <Route path="orders" element={<OrderManager />} />
                    <Route path="reports" element={<Report />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}
