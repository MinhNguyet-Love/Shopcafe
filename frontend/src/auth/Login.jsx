
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";

export default function Login() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint = isLogin ? "/auth/login" : "/auth/register";
            const res = await api.post(endpoint, form);
            const data = res.data;

            if (isLogin) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("userId", data.id);
                const role = data.role?.replace("ROLE_", "") || "USER";
                localStorage.setItem("role", role);

                alert("✅ Đăng nhập thành công!");
                navigate(role === "ADMIN" ? "/admin" : "/");
            } else {
                alert("✅ Đăng ký thành công! Hãy đăng nhập.");
                setIsLogin(true);
            }
        } catch (err) {
            console.error("❌ Lỗi:", err);
            alert("❌ " + (isLogin ? "Sai tài khoản hoặc mật khẩu!" : "Email đã tồn tại!"));
        } finally {
            setLoading(false);
        }
    };

    // 🎨 Style
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
            marginTop: 4,
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
                <h2 style={styles.title}>
                    {isLogin ? "☕ Đăng nhập CafeShop" : "📝 Đăng ký tài khoản"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Tên người dùng"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            required
                        />
                    )}

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
                        {loading
                            ? isLogin
                                ? "Đang đăng nhập..."
                                : "Đang đăng ký..."
                            : isLogin
                                ? "Đăng nhập"
                                : "Đăng ký"}
                    </button>

                    <p style={styles.footer}>
                        {isLogin ? (
                            <>
                                Chưa có tài khoản?
                                <span
                                    style={styles.link}
                                    onClick={() => setIsLogin(false)}
                                >
                  Đăng ký
                </span>
                            </>
                        ) : (
                            <>
                                Đã có tài khoản?
                                <span
                                    style={styles.link}
                                    onClick={() => setIsLogin(true)}
                                >
                  Đăng nhập
                </span>
                            </>
                        )}
                    </p>
                </form>
            </div>
        </div>
    );
}