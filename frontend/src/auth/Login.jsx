import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/login", form);
            const data = res.data;

            // ✅ Lưu token & thông tin user
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("userId", data.id);

            // ✅ Chuẩn hóa role (ROLE_ADMIN → ADMIN)
            const role = data.role?.replace("ROLE_", "") || "USER";
            localStorage.setItem("role", role);

            alert("✅ Đăng nhập thành công!");

            // ✅ Điều hướng theo quyền
            if (role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error("❌ Lỗi đăng nhập:", err);
            alert("❌ Sai tài khoản hoặc mật khẩu!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: 400 }}>
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit} className="card" style={{ display: "grid", gap: 12 }}>
                <input
                    className="input"
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <input
                    className="input"
                    placeholder="Mật khẩu"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                <button className="button primary" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                <p>
                    Chưa có tài khoản?{" "}
                    <a href="/register" style={{ color: "var(--primary)" }}>
                        Đăng ký
                    </a>
                </p>
            </form>
        </div>
    );
}
