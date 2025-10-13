import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function OrderManager() {
    const [orders, setOrders] = useState([]);

    const loadOrders = async () => {
        try {
            const res = await api.get("/orders");
            setOrders(res.data || []);
        } catch (err) {
            console.error("❌ Lỗi khi tải đơn:", err);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleChangeStatus = async (id, status) => {
        if (!window.confirm("Xác nhận đổi trạng thái đơn hàng?")) return;
        try {
            await api.put(`/orders/${id}/status?status=${status}`);
            alert("✅ Cập nhật trạng thái thành công!");
            loadOrders();
        } catch {
            alert("❌ Lỗi khi đổi trạng thái!");
        }
    };

    return (
        <div className="container">
            <h2>📋 Quản lý đơn hàng</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Bàn</th>
                    <th>Ngày</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((o) => (
                    <tr key={o.id}>
                        <td>{o.tableId}</td>
                        <td>{o.businessDate}</td>
                        <td>{o.totalPrice?.toLocaleString()} đ</td>
                        <td>{o.status}</td>
                        <td>
                            {o.status === "Đang phục vụ" && (
                                <button
                                    className="button"
                                    onClick={() => handleChangeStatus(o.id, "Đã thanh toán")}
                                >
                                    ✅ Xác nhận thanh toán
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
