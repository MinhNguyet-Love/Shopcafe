// import { useEffect, useState } from "react";
// import api from "../../api/axiosClient";
//
// export default function Home() {
//     const [tables, setTables] = useState([]);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         (async () => {
//             try {
//                 // ✅ Lấy chỉ bàn TRỐNG
//                 const res = await api.get("/tables?status=TRỐNG");
//                 setTables(res.data || []);
//             } catch (err) {
//                 console.error("❌ Lỗi khi tải bàn:", err);
//             } finally {
//                 setLoading(false);
//             }
//         })();
//     }, []);
//
//     if (loading) return <p>Đang tải dữ liệu...</p>;
//
//     return (
//         <div className="container">
//             <h2>Danh sách bàn trống ☕</h2>
//             <div className="grid">
//                 {tables.length === 0 && <p>Không còn bàn trống nào!</p>}
//                 {tables.map((t) => (
//                     <div key={t.id} className="card">
//                         <h4>{t.name}</h4>
//                         <p>Sức chứa: {t.capacity} người</p>
//                         <p>Trạng thái: {t.status}</p>
//                         <a href={`/booking?tableId=${t.id}`} className="button primary">
//                             Chọn bàn
//                         </a>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function Home() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
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

    const styles = {
        page: {
            backgroundColor: "#fffaf5",
            minHeight: "100vh",
            padding: "40px 60px",
            fontFamily: "'Poppins', sans-serif",
        },
        title: {
            textAlign: "center",
            color: "#4e342e",
            fontSize: 26,
            marginBottom: 16,
        },
        subtitle: {
            textAlign: "center",
            color: "#795548",
            fontStyle: "italic",
            marginBottom: 30,
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 70,
            justifyItems: "center",
        },
        card: {
            backgroundColor: "#fdf3e7",
            borderRadius: 10,
            border: "1px solid #e0c3a3",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: "16px 20px",
            width: "100%",
            maxWidth: 280,
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
        },
        cardHover: `
      .table-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 14px rgba(0,0,0,0.15);
      }
    `,
        name: {
            color: "#3e2723",
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 8,
        },
        text: {
            color: "#5d4037",
            fontSize: 14,
            margin: "4px 0",
        },
        button: {
            marginTop: 10,
            backgroundColor: "#8d6e63",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 10px",
            cursor: "pointer",
            fontWeight: 600,
            transition: "background 0.2s ease",
        },
    };

    return (
        <div style={styles.page}>
            <style>{styles.cardHover}</style>
            <h2 style={styles.title}>Danh sách bàn trống ☕</h2>
            <p style={styles.subtitle}>
                Chọn bàn bạn muốn đặt để thưởng thức hương vị cà phê thơm ngon nhất.
            </p>

            <div style={styles.grid}>
                {tables.length === 0 ? (
                    <p>Không còn bàn trống nào!</p>
                ) : (
                    tables.map((t) => (
                        <div key={t.id} className="table-card" style={styles.card}>
                            <div style={styles.name}>{t.name}</div>
                            <p style={styles.text}>Sức chứa: {t.capacity} người</p>
                            <p style={styles.text}>Trạng thái: {t.status}</p>
                            <a
                                href={`/booking?tableId=${t.id}`}
                                style={styles.button}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#6d4c41")
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#8d6e63")
                                }
                            >
                                Chọn bàn
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}