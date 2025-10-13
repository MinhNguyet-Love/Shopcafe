import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function Booking() {
    const [products, setProducts] = useState([]);
    const [tableId, setTableId] = useState("");
    const [items, setItems] = useState([]);

    // 🟢 Nếu user vào từ link ?tableId=xxx
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tid = params.get("tableId");
        if (tid) setTableId(tid);
    }, []);

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
                },
            ];
        });
    };

    const total = items.reduce(
        (sum, i) => sum + i.quantity * (i.unitPrice || 0),
        0
    );

    const submitOrder = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return alert("⚠️ Bạn cần đăng nhập trước!");
        if (!tableId) return alert("⚠️ Chưa chọn bàn!");
        if (!items.length) return alert("⚠️ Chưa chọn món!");

        try {
            const payload = { userId, tableId, items };
            await api.post("/orders", payload);
            alert("✅ Đặt bàn & gọi món thành công!");
            setItems([]);
            window.location.href = "/my-orders";
        } catch (err) {
            console.error("❌ Lỗi đặt hàng:", err);
            alert("❌ Không thể đặt bàn!");
        }
    };

    return (
        <div className="container">
            <h2>🍽️ Gọi món cho bàn</h2>

            <div className="card">
                <p>
                    <strong>Bàn được chọn:</strong> {tableId || "Chưa chọn"}
                </p>

                <h3>Danh sách món</h3>
                <div className="grid">
                    {products.map((p) => (
                        <div key={p.id} className="card">
                            <strong>{p.name}</strong>
                            <p>{p.price?.toLocaleString()} đ</p>
                            <button className="button" onClick={() => addItem(p)}>
                                + Thêm
                            </button>
                        </div>
                    ))}
                </div>

                <h3>🧾 Giỏ món</h3>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Món</th>
                        <th>SL</th>
                        <th>Đơn giá</th>
                        <th>Tổng</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((i) => (
                        <tr key={i.productId}>
                            <td>{i.productName}</td>
                            <td>{i.quantity}</td>
                            <td>{i.unitPrice?.toLocaleString()}</td>
                            <td>{(i.quantity * i.unitPrice)?.toLocaleString()}</td>
                        </tr>
                    ))}
                    {!items.length && (
                        <tr>
                            <td colSpan="4">Chưa chọn món</td>
                        </tr>
                    )}
                    </tbody>
                </table>

                <div style={{ textAlign: "right", marginTop: 8 }}>
                    <strong>Tổng cộng: {total.toLocaleString()} đ</strong>
                </div>

                <button className="button primary" onClick={submitOrder}>
                    ✅ Xác nhận đặt
                </button>
            </div>
        </div>
    );
}
