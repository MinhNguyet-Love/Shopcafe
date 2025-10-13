import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/register", form);
            alert("✅ Đăng ký thành công!");
            navigate("/login");
        } catch (err) {
            alert("❌ Email đã tồn tại hoặc dữ liệu không hợp lệ!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: 400 }}>
            <h2>Đăng ký tài khoản</h2>
            <form onSubmit={handleSubmit} className="card" style={{ display: "grid", gap: 12 }}>
                <input
                    className="input"
                    placeholder="Tên người dùng"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                />
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
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
                <p>
                    Đã có tài khoản?{" "}
                    <a href="/login" style={{ color: "var(--primary)" }}>
                        Đăng nhập
                    </a>
                </p>
            </form>
        </div>
    );
}
