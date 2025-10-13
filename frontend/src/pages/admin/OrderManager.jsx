// import { useEffect, useState } from "react";
// import api from "../../api/axiosClient";
//
// export default function OrderManager() {
//     const [orders, setOrders] = useState([]);
//
//     const loadOrders = async () => {
//         try {
//             const res = await api.get("/orders");
//             setOrders(res.data || []);
//         } catch (err) {
//             console.error("❌ Lỗi khi tải đơn:", err);
//         }
//     };
//
//     useEffect(() => {
//         loadOrders();
//     }, []);
//
//     const handleChangeStatus = async (id, status) => {
//         if (!window.confirm("Xác nhận đổi trạng thái đơn hàng?")) return;
//         try {
//             await api.put(`/orders/${id}/status?status=${status}`);
//             alert("✅ Cập nhật trạng thái thành công!");
//             loadOrders();
//         } catch {
//             alert("❌ Lỗi khi đổi trạng thái!");
//         }
//     };
//
//     return (
//         <div className="container">
//             <h2>📋 Quản lý đơn hàng</h2>
//             <table className="table">
//                 <thead>
//                 <tr>
//                     <th>Bàn</th>
//                     <th>Ngày</th>
//                     <th>Tổng tiền</th>
//                     <th>Trạng thái</th>
//                     <th>Hành động</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {orders.map((o) => (
//                     <tr key={o.id}>
//                         <td>{o.tableId}</td>
//                         <td>{o.businessDate}</td>
//                         <td>{o.totalPrice?.toLocaleString()} đ</td>
//                         <td>{o.status}</td>
//                         <td>
//                             {o.status === "Đang phục vụ" && (
//                                 <button
//                                     className="button"
//                                     onClick={() => handleChangeStatus(o.id, "Đã thanh toán")}
//                                 >
//                                     ✅ Xác nhận thanh toán
//                                 </button>
//                             )}
//                         </td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }
import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);

    // 🟢 Lấy danh sách đơn hàng và bàn
    const loadData = async () => {
        try {
            const [resOrders, resTables] = await Promise.all([
                api.get("/orders"),
                api.get("/tables"),
            ]);
            setOrders(resOrders.data || []);
            setTables(resTables.data || []);
        } catch (err) {
            console.error("❌ Lỗi khi tải dữ liệu:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 🟤 Hàm tìm tên bàn từ ID
    const getTableName = (id) => {
        const t = tables.find((tb) => tb.id === id);
        return t ? t.name : id; // fallback nếu bàn bị xoá
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status?status=${status}`);
            alert("✅ Cập nhật trạng thái thành công!");
            loadData();
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật trạng thái:", err);
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#fffaf5",
                minHeight: "100vh",
                padding: "40px 60px",
                fontFamily: "'Poppins', sans-serif",
                color: "#3e2723",
            }}
        >
            <h2 style={{ fontSize: 24, color: "#4e342e", marginBottom: 20 }}>
                📋 Quản lý đơn hàng
            </h2>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "#fff",
                    borderRadius: 8,
                    overflow: "hidden",
                }}
            >
                <thead>
                <tr style={{ background: "#d7ccc8" }}>
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
                        <td>{getTableName(o.tableId)}</td>
                        <td>{o.businessDate}</td>
                        <td>{o.totalPrice?.toLocaleString()} đ</td>
                        <td>{o.status}</td>
                        <td>
                            {o.status === "Đang phục vụ" && (
                                <button
                                    onClick={() => updateStatus(o.id, "Đã thanh toán")}
                                    style={{
                                        backgroundColor: "#8d6e63",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: "6px 10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    ✅ Thanh toán
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