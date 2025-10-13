import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const userId = localStorage.getItem("userId");
                const res = await api.get(`/orders/user/${userId}`);
                setOrders(res.data || []);
            } catch (err) {
                console.error("❌ Lỗi khi tải đơn:", err);
            }
        })();
    }, []);

    return (
        <div className="container">
            <h2>🧾 Đơn hàng của tôi</h2>
            <div className="grid">
                {orders.length === 0 && <p>Bạn chưa có đơn hàng nào.</p>}
                {orders.map((o) => (
                    <div key={o.id} className="card">
                        <p><strong>Bàn:</strong> {o.tableId}</p>
                        <p><strong>Ngày:</strong> {o.businessDate}</p>
                        <p><strong>Tổng tiền:</strong> {o.totalPrice?.toLocaleString()} đ</p>
                        <ul>
                            {o.items?.map((i, idx) => (
                                <li key={idx}>
                                    {i.productName} × {i.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
