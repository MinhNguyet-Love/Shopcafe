import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div
            style={{
                backgroundColor: "#ff6b6b",
                padding: "10px 20px",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <h2 style={{ margin: 0 }}>☕ CafeShop</h2>
            <div>
                {token ? (
                    <>
                        {role === "ADMIN" ? (
                            <span style={{ marginRight: 10 }}>👑 Admin</span>
                        ) : (
                            <span style={{ marginRight: 10 }}>🙋‍♂️ User</span>
                        )}
                        <button onClick={handleLogout}>Đăng xuất</button>
                    </>
                ) : (
                    <button onClick={() => navigate("/login")}>Đăng nhập</button>
                )}
            </div>
        </div>
    );
}
