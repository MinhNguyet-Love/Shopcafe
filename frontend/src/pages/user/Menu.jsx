import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function Menu() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/products");
                setItems(res.data || []);
            } catch (err) {
                console.error("❌ Lỗi khi tải menu:", err);
            }
        })();
    }, []);

    return (
        <div className="container">
            <h2>Menu quán cafe</h2>
            <div className="grid">
                {items.map((p) => (
                    <div key={p.id} className="card">
                        <img
                            src={
                                p.imageUrl
                                    ? `http://localhost:8080${p.imageUrl}`
                                    : "https://via.placeholder.com/300x180"
                            }
                            alt={p.name}
                            style={{ width: "100%", height: 160, borderRadius: 8 }}
                        />
                        <h4>{p.name}</h4>
                        <p>{p.category}</p>
                        <p>
                            <strong>{p.price?.toLocaleString()} đ</strong>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
