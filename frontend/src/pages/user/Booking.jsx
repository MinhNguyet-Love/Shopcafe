// import { useEffect, useState } from "react";
// import api from "../../api/axiosClient";
//
// export default function Booking() {
//     const [products, setProducts] = useState([]);
//     const [tableId, setTableId] = useState("");
//     const [items, setItems] = useState([]);
//
//     // 🟢 Nếu user vào từ link ?tableId=xxx
//     useEffect(() => {
//         const params = new URLSearchParams(window.location.search);
//         const tid = params.get("tableId");
//         if (tid) setTableId(tid);
//     }, []);
//
//     useEffect(() => {
//         (async () => {
//             try {
//                 const res = await api.get("/products");
//                 setProducts(res.data || []);
//             } catch (err) {
//                 console.error("❌ Lỗi khi tải menu:", err);
//             }
//         })();
//     }, []);
//
//     const addItem = (product) => {
//         setItems((prev) => {
//             const exist = prev.find((i) => i.productId === product.id);
//             if (exist)
//                 return prev.map((i) =>
//                     i.productId === product.id
//                         ? { ...i, quantity: i.quantity + 1 }
//                         : i
//                 );
//             return [
//                 ...prev,
//                 {
//                     productId: product.id,
//                     productName: product.name,
//                     quantity: 1,
//                     unitPrice: product.price,
//                 },
//             ];
//         });
//     };
//
//     const total = items.reduce(
//         (sum, i) => sum + i.quantity * (i.unitPrice || 0),
//         0
//     );
//
//     const submitOrder = async () => {
//         const userId = localStorage.getItem("userId");
//         if (!userId) return alert("⚠️ Bạn cần đăng nhập trước!");
//         if (!tableId) return alert("⚠️ Chưa chọn bàn!");
//         if (!items.length) return alert("⚠️ Chưa chọn món!");
//
//         try {
//             const payload = { userId, tableId, items };
//             await api.post("/orders", payload);
//             alert("✅ Đặt bàn & gọi món thành công!");
//             setItems([]);
//             window.location.href = "/my-orders";
//         } catch (err) {
//             console.error("❌ Lỗi đặt hàng:", err);
//             alert("❌ Không thể đặt bàn!");
//         }
//     };
//
//     return (
//         <div className="container">
//             <h2>🍽️ Gọi món cho bàn</h2>
//
//             <div className="card">
//                 <p>
//                     <strong>Bàn được chọn:</strong> {tableId || "Chưa chọn"}
//                 </p>
//
//                 <h3>Danh sách món</h3>
//                 <div className="grid">
//                     {products.map((p) => (
//                         <div key={p.id} className="card">
//                             <strong>{p.name}</strong>
//                             <p>{p.price?.toLocaleString()} đ</p>
//                             <button className="button" onClick={() => addItem(p)}>
//                                 + Thêm
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//
//                 <h3>🧾 Giỏ món</h3>
//                 <table className="table">
//                     <thead>
//                     <tr>
//                         <th>Món</th>
//                         <th>SL</th>
//                         <th>Đơn giá</th>
//                         <th>Tổng</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {items.map((i) => (
//                         <tr key={i.productId}>
//                             <td>{i.productName}</td>
//                             <td>{i.quantity}</td>
//                             <td>{i.unitPrice?.toLocaleString()}</td>
//                             <td>{(i.quantity * i.unitPrice)?.toLocaleString()}</td>
//                         </tr>
//                     ))}
//                     {!items.length && (
//                         <tr>
//                             <td colSpan="4">Chưa chọn món</td>
//                         </tr>
//                     )}
//                     </tbody>
//                 </table>
//
//                 <div style={{ textAlign: "right", marginTop: 8 }}>
//                     <strong>Tổng cộng: {total.toLocaleString()} đ</strong>
//                 </div>
//
//                 <button className="button primary" onClick={submitOrder}>
//                     ✅ Xác nhận đặt
//                 </button>
//             </div>
//         </div>
//     );
// }
import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function Booking() {
    const [products, setProducts] = useState([]);
    const [tableId, setTableId] = useState("");
    const [items, setItems] = useState([]);

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

    // 🎨 STYLE
    const styles = {
        page: {
            backgroundColor: "#fff",
            minHeight: "100vh",
            padding: "40px 60px",
            fontFamily: "'Poppins', sans-serif",
        },
        title: {
            color: "#5d4037",
            textAlign: "center",
            fontSize: 26,
            marginBottom: 24,
            fontWeight: 600,
        },
        card: {
            backgroundColor: "#fdf6f2",
            border: "1px solid #e0c3a3",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 20,
            marginBottom: 30,
            marginTop: 10,
        },
        productCard: {
            backgroundColor: "#fff",
            border: "1px solid #e0c3a3",
            borderRadius: 8,
            padding: 12,
            textAlign: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            transition: "transform 0.2s ease",
        },
        button: {
            backgroundColor: "#6d4c41",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "8px 12px",
            cursor: "pointer",
            marginTop: 8,
            fontSize: 14,
            fontWeight: 600,
            transition: "background 0.2s ease",
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 10,
            background: "#fff",
        },
        thtd: {
            border: "1px solid #d7ccc8",
            padding: 8,
            textAlign: "center",
            fontSize: 14,
        },
        total: {
            textAlign: "right",
            marginTop: 10,
            fontWeight: 600,
            color: "#3e2723",
        },
    };

    return (
        <div style={styles.page}>
            <style>
                {`
          .product-card:hover { transform: translateY(-4px); }
          button:hover { background-color: #4e342e !important; }
        `}
            </style>

            <h2 style={styles.title}>🍽️ Gọi món cho bàn</h2>

            <div style={styles.card}>
                <p><strong>Bàn được chọn:</strong> {tableId || "Chưa chọn"}</p>

                <h3 style={{ color: "#5d4037", marginTop: 20 }}>Danh sách món</h3>
                <div style={styles.grid}>
                    {products.map((p) => (
                        <div key={p.id} className="product-card" style={styles.productCard}>
                            <strong style={{ color: "#4e342e" }}>{p.name}</strong>
                            <p style={{ color: "#6d4c41" }}>{p.price?.toLocaleString()} đ</p>
                            <button style={styles.button} onClick={() => addItem(p)}>
                                + Thêm
                            </button>
                        </div>
                    ))}
                </div>

                <h3 style={{ color: "#5d4037" }}>🧾 Giỏ món</h3>
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.thtd}>Món</th>
                        <th style={styles.thtd}>SL</th>
                        <th style={styles.thtd}>Đơn giá</th>
                        <th style={styles.thtd}>Tổng</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.length ? (
                        items.map((i) => (
                            <tr key={i.productId}>
                                <td style={styles.thtd}>{i.productName}</td>
                                <td style={styles.thtd}>{i.quantity}</td>
                                <td style={styles.thtd}>{i.unitPrice?.toLocaleString()}</td>
                                <td style={styles.thtd}>
                                    {(i.quantity * i.unitPrice)?.toLocaleString()}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={styles.thtd} colSpan="4">
                                Chưa chọn món
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                <div style={styles.total}>
                    Tổng cộng: {total.toLocaleString()} đ
                </div>

                <div style={{ textAlign: "right", marginTop: 20 }}>
                    <button style={styles.button} onClick={submitOrder}>
                        ✅ Xác nhận đặt
                    </button>
                </div>
            </div>
        </div>
    );
}