
import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import "../../styles.css";

export default function Booking() {
    const [products, setProducts] = useState([]);
    const [tableId, setTableId] = useState("");
    const [tableName, setTableName] = useState("");
    const [items, setItems] = useState([]);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    // 🟤 Lấy tableId từ URL và gọi API để lấy tên bàn
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tid = params.get("tableId");
        if (tid) {
            setTableId(tid);
            fetchTableName(tid);
        }
    }, []);

    const fetchTableName = async (tid) => {
        try {
            const res = await api.get(`/tables/${tid}`);
            setTableName(res.data.name || res.data.tableName || "Không rõ bàn");
        } catch (err) {
            console.error("❌ Lỗi khi lấy tên bàn:", err);
            setTableName(`Bàn #${tid}`);
        }
    };

    // 🟤 Lấy danh sách món
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/products");
                setProducts(res.data || []);
            } catch (err) {
                console.error("❌ Lỗi khi tải menu:", err);
            }
        })();
    }, []);

    // 🟤 Thêm món vào giỏ
    const addItem = (product) => {
        setItems((prev) => {
            const exist = prev.find((i) => i.productId === product.id);
            if (exist)
                return prev.map((i) =>
                    i.productId === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            return [
                ...prev,
                {
                    productId: product.id,
                    productName: product.name,
                    quantity: 1,
                    unitPrice: product.price,
                    image: product.imageUrl,
                },
            ];
        });
    };

    // 🟤 Tăng / Giảm / Xóa món
    const increase = (id) =>
        setItems((prev) =>
            prev.map((i) =>
                i.productId === id ? { ...i, quantity: i.quantity + 1 } : i
            )
        );

    const decrease = (id) =>
        setItems((prev) =>
            prev
                .map((i) =>
                    i.productId === id
                        ? { ...i, quantity: Math.max(0, i.quantity - 1) }
                        : i
                )
                .filter((i) => i.quantity > 0)
        );

    const removeItem = (id) =>
        setItems((prev) => prev.filter((i) => i.productId !== id));

    // 🟤 Tính tổng tiền
    const total = items.reduce(
        (sum, i) => sum + i.quantity * (i.unitPrice || 0),
        0
    );

    // 🟤 Gửi đơn hàng (có cả tableId + tableName)
    const submitOrder = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return alert("⚠️ Bạn cần đăng nhập trước!");
        if (!tableId) return alert("⚠️ Chưa chọn bàn!");
        if (!items.length) return alert("⚠️ Chưa chọn món!");

        try {
            const payload = { userId, tableId, tableName, items }; // ✅ Gửi cả 2
            await api.post("/orders", payload);
            alert(`✅ Đặt món cho ${tableName} thành công!`);
            setItems([]);
            window.location.href = "/my-orders";
        } catch (err) {
            console.error("❌ Lỗi đặt hàng:", err);
            alert("❌ Không thể đặt bàn!");
        }
    };

    return (
        <div className="booking-page">
            <div className="booking-container">
                {/* ======= CỘT TRÁI: DANH SÁCH MÓN ======= */}
                <div className="menu-left">
                    <h2 className="menu-title">🍽️ Gọi món cho bàn</h2>
                    <p>
                        <strong>Bàn được chọn:</strong>{" "}
                        {tableName || "Chưa chọn"}
                    </p>

                    <h3 className="section-title">Danh sách món</h3>
                    <div className="menu-grid">
                        {products.length === 0 ? (
                            <p>Đang tải danh sách món...</p>
                        ) : (
                            products.map((p) => (
                                <div key={p.id} className="menu-card">
                                    <img
                                        src={
                                            p.imageUrl
                                                ? p.imageUrl.startsWith("http")
                                                    ? p.imageUrl
                                                    : `${API_BASE}${p.imageUrl.startsWith("/") ? p.imageUrl : "/" + p.imageUrl}`
                                                : "https://cdn-icons-png.flaticon.com/512/2965/2965567.png"
                                        }
                                        alt={p.name}
                                        className="menu-img"
                                    />
                                    <div className="menu-info">
                                        <h4>{p.name}</h4>
                                        <p className="menu-price">
                                            {p.price?.toLocaleString()} đ
                                        </p>
                                    </div>
                                    <button
                                        className="button primary"
                                        onClick={() => addItem(p)}
                                    >
                                        + Thêm
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ======= CỘT PHẢI: GIỎ HÀNG ======= */}
                <div className="cart-right">
                    <div className="cart-card">
                        <h3>🧾 Giỏ hàng</h3>
                        <p style={{ color: "#6d4c41", fontSize: 15 }}>
                            Bàn hiện tại: <strong>{tableName || "Chưa chọn"}</strong>
                        </p>
                        {items.length === 0 ? (
                            <p style={{ color: "#8d6e63" }}>Chưa chọn món nào</p>
                        ) : (
                            <div className="cart-items">
                                {items.map((i) => (
                                    <div key={i.productId} className="cart-item">
                                        <img
                                            src={
                                                i.image
                                                    ? i.image.startsWith("http")
                                                        ? i.image
                                                        : `${API_BASE}${i.image.startsWith("/") ? i.image : "/" + i.image}`
                                                    : "https://cdn-icons-png.flaticon.com/512/2965/2965567.png"
                                            }
                                            alt={i.productName}
                                            className="cart-img"
                                        />
                                        <div className="cart-info">
                                            <strong>{i.productName}</strong>
                                            <p>{i.unitPrice.toLocaleString()} đ</p>
                                            <div className="cart-buttons">
                                                <button onClick={() => decrease(i.productId)}>−</button>
                                                <span>{i.quantity}</span>
                                                <button onClick={() => increase(i.productId)}>+</button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => removeItem(i.productId)}
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <hr />
                        <div className="cart-total">
                            Tổng cộng: <strong>{total.toLocaleString()} đ</strong>
                        </div>

                        <button
                            className="button primary full"
                            onClick={submitOrder}
                            style={{ marginTop: 16 }}
                        >
                            ✅ Xác nhận đặt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
