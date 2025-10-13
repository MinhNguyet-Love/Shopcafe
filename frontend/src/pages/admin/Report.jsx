import { useState } from "react";
import api from "../../api/axiosClient";

export default function Report() {
    const [date, setDate] = useState("");
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);

    const load = async () => {
        if (!date) return alert("Chọn ngày báo cáo");
        const res = await api.get(`/report/daily?date=${date}`);
        setOrders(res.data || []);
        const totalMoney = res.data.reduce(
            (sum, o) => sum + (o.total || 0),
            0
        );
        setTotal(totalMoney);
    };

    return (
        <div>
            <h2>Báo cáo doanh thu</h2>
            <div style={{ marginBottom: 16 }}>
                <input
                    className="input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button className="button primary" onClick={load}>
                    Xem báo cáo
                </button>
            </div>

            <table className="table">
                <thead>
                <tr>
                    <th>Bàn</th>
                    <th>Ngày</th>
                    <th>Số món</th>
                    <th>Tổng tiền</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((o) => (
                    <tr key={o.id}>
                        <td>{o.tableId}</td>
                        <td>{o.businessDate}</td>
                        <td>{o.items?.length}</td>
                        <td>{o.total?.toLocaleString()} đ</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {orders.length > 0 && (
                <div style={{ textAlign: "right", marginTop: 12 }}>
                    <strong>Tổng doanh thu: {total.toLocaleString()} đ</strong>
                </div>
            )}
        </div>
    );
}
