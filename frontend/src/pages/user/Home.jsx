import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function Home() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                // ✅ Lấy chỉ bàn TRỐNG
                const res = await api.get("/tables?status=TRỐNG");
                setTables(res.data || []);
            } catch (err) {
                console.error("❌ Lỗi khi tải bàn:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="container">
            <h2>Danh sách bàn trống ☕</h2>
            <div className="grid">
                {tables.length === 0 && <p>Không còn bàn trống nào!</p>}
                {tables.map((t) => (
                    <div key={t.id} className="card">
                        <h4>{t.name}</h4>
                        <p>Sức chứa: {t.capacity} người</p>
                        <p>Trạng thái: {t.status}</p>
                        <a href={`/booking?tableId=${t.id}`} className="button primary">
                            Chọn bàn
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
