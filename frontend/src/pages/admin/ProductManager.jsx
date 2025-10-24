
import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function ProductManager() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        imageUrl: "",
    });
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // 🟤 Lấy danh sách sản phẩm
    const fetchProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data || []);
        } catch (err) {
            console.error("❌ Lỗi khi tải sản phẩm:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // 🟤 Gửi form (Thêm / Cập nhật)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return alert("⚠️ Cần đăng nhập với quyền ADMIN!");

        try {
            const url = editId ? `/products/${editId}` : "/products";
            const method = editId ? "put" : "post";

            await api.request({
                url,
                method,
                data: form, // gửi JSON
                headers: { Authorization: `Bearer ${token}` },
            });

            alert(editId ? "✅ Cập nhật món thành công!" : "✅ Thêm món mới thành công!");
            setForm({ name: "", price: "", category: "", description: "", imageUrl: "" });
            setEditId(null);
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert("❌ Không thể lưu món!");
        }
    };

    // 🟤 Chọn sửa
    const handleEdit = (p) => {
        setForm({
            name: p.name,
            price: p.price,
            category: p.category,
            description: p.description,
            imageUrl: p.imageUrl,
        });
        setEditId(p.id);
        setShowModal(true);
    };

    // 🟤 Xóa
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) return alert("⚠️ Cần đăng nhập ADMIN!");
        if (!window.confirm("Bạn có chắc muốn xóa món này?")) return;

        try {
            await api.delete(`/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
        } catch {
            alert("❌ Không thể xóa món!");
        }
    };

    // 🟤 Style
    const styles = {
        page: {
            backgroundColor: "#fffaf5",
            minHeight: "100vh",
            padding: "40px 60px",
            fontFamily: "'Poppins', sans-serif",
            color: "#3e2723",
        },
        titleRow: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
        },
        title: { fontSize: 24, fontWeight: 700, color: "#4e342e" },
        addBtn: {
            backgroundColor: "#6d4c41",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: 600,
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            borderRadius: 8,
            overflow: "hidden",
        },
        th: {
            background: "#d7ccc8",
            padding: 10,
            border: "1px solid #bbb",
            fontWeight: 600,
        },
        td: { padding: 8, border: "1px solid #ddd", textAlign: "center" },
        overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
        },
        modal: {
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: "24px 28px",
            width: "400px",
            maxWidth: "90%",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            position: "relative",
        },
        closeBtn: {
            position: "absolute",
            top: 10,
            right: 14,
            fontSize: 20,
            fontWeight: "bold",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#6d4c41",
        },
        input: {
            width: "100%",
            padding: 8,
            border: "1px solid #d7ccc8",
            borderRadius: 6,
            marginBottom: 12,
            fontFamily: "inherit",
        },
        button: {
            backgroundColor: "#8d6e63",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 14px",
            cursor: "pointer",
            width: "100%",
            fontWeight: 600,
        },
    };

    return (
        <div style={styles.page}>
            <div style={styles.titleRow}>
                <h2 style={styles.title}>🍰 Quản lý sản phẩm</h2>
                <button
                    style={styles.addBtn}
                    onClick={() => {
                        setEditId(null);
                        setForm({
                            name: "",
                            price: "",
                            category: "",
                            description: "",
                            imageUrl: "",
                        });
                        setShowModal(true);
                    }}
                >
                    ➕ Thêm món
                </button>
            </div>

            {/* Bảng sản phẩm */}
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.th}>Ảnh</th>
                    <th style={styles.th}>Tên</th>
                    <th style={styles.th}>Giá</th>
                    <th style={styles.th}>Loại</th>
                    <th style={styles.th}>Mô tả</th>
                    <th style={styles.th}>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {products.map((p) => (
                    <tr key={p.id}>
                        <td style={styles.td}>
                            <img
                                src={
                                    p.imageUrl
                                        ? p.imageUrl
                                        : "https://via.placeholder.com/60"
                                }
                                alt={p.name}
                                width="60"
                                height="60"
                                style={{ borderRadius: 6 }}
                            />
                        </td>
                        <td style={styles.td}>{p.name}</td>
                        <td style={styles.td}>{p.price?.toLocaleString()} đ</td>
                        <td style={styles.td}>{p.category}</td>
                        <td style={styles.td}>{p.description}</td>
                        <td style={styles.td}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <button
                                    title="Sửa món"
                                    style={{
                                        background: "#ffe0b2",
                                        border: "none",
                                        borderRadius: "6px",
                                        padding: "6px 8px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(p)}
                                >
                                    ✏️
                                </button>
                                <button
                                    title="Xóa món"
                                    style={{
                                        background: "#ef9a9a",
                                        border: "none",
                                        borderRadius: "6px",
                                        padding: "6px 8px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(p.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal thêm/sửa */}
            {showModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
                            ×
                        </button>
                        <h3 style={{ textAlign: "center", fontWeight: 700, color: "#4e342e" }}>
                            {editId ? "✏️ Cập nhật món" : "➕ Thêm món mới"}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <input
                                style={styles.input}
                                placeholder="Tên món"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                required
                            />
                            <input
                                style={styles.input}
                                type="number"
                                placeholder="Giá (VND)"
                                value={form.price}
                                onChange={(e) =>
                                    setForm({ ...form, price: e.target.value })
                                }
                                required
                            />
                            <input
                                style={styles.input}
                                placeholder="Loại"
                                value={form.category}
                                onChange={(e) =>
                                    setForm({ ...form, category: e.target.value })
                                }
                            />
                            <textarea
                                style={styles.input}
                                placeholder="Mô tả"
                                rows="3"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                            />
                            <input
                                style={styles.input}
                                placeholder="Link ảnh (tùy chọn)"
                                value={form.imageUrl || ""}
                                onChange={(e) =>
                                    setForm({ ...form, imageUrl: e.target.value })
                                }
                            />
                            <button type="submit" style={{ ...styles.button, marginTop: 12 }}>
                                {editId ? "💾 Lưu thay đổi" : "✅ Thêm món"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
