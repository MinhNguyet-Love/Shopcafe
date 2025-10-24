
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient"; // ✅ import axios client

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/register", form);
            if (res.status === 200) {
                alert("✅ Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
                navigate("/login");
            }
        } catch (err) {
            console.error("❌ Lỗi đăng ký:", err);
            alert("❌ Email đã tồn tại hoặc dữ liệu không hợp lệ!");
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        page: {
            backgroundColor: "#ffffff",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Poppins', sans-serif",
        },
        card: {
            backgroundColor: "#fdf6f2",
            borderRadius: "14px",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
            padding: "40px 36px",
            width: "100%",
            maxWidth: "400px",
            textAlign: "center",
            border: "1px solid #e0c3a3",
            animation: "fadeIn 0.5s ease",
        },
        title: {
            color: "#5d4037",
            marginBottom: 24,
            fontSize: 22,
            fontWeight: 600,
        },
        input: {
            width: "100%",
            padding: "12px 14px",
            marginBottom: 14,
            border: "1px solid #c7a17a",
            borderRadius: 6,
            fontSize: 15,
            background: "#fff",
            transition: "border-color 0.3s",
        },
        button: {
            width: "100%",
            background: "#6d4c41",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: 12,
            fontSize: 16,
            cursor: "pointer",
            transition: "background 0.3s",
        },
        footer: {
            marginTop: 16,
            fontSize: 14,
            color: "#4e342e",
        },
        link: {
            color: "#a1887f",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "underline",
            marginLeft: 4,
        },
    };

    return (
        <div style={styles.page}>
            <style>
                {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          button:hover { background: #4e342e !important; }
          input:focus { outline: none; border-color: #795548 !important; }
        `}
            </style>

            <div style={styles.card}>
                <h2 style={styles.title}>📝 Đăng ký tài khoản</h2>

                <form onSubmit={handleRegister}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Tên người dùng"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        required
                    />

                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />

                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Mật khẩu"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />

                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                </form>

                <p style={styles.footer}>
                    Đã có tài khoản?
                    <span style={styles.link} onClick={() => navigate("/login")}>
            Đăng nhập
          </span>
                </p>
            </div>
        </div>
    );
}