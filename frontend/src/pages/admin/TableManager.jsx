// import { useEffect, useState } from "react";
// import api from "../../api/axiosClient";
//
// export default function TableManager() {
//     const [list, setList] = useState([]);
//     const [form, setForm] = useState({ name: "", capacity: 0, status: "TRỐNG" });
//     const [editingId, setEditingId] = useState(null);
//
//     // 🟢 Lấy danh sách bàn
//     const load = async () => {
//         try {
//             const res = await api.get("/tables");
//             setList(res.data || []);
//         } catch (err) {
//             console.error("❌ Lỗi tải danh sách bàn:", err);
//         }
//     };
//
//     useEffect(() => {
//         load();
//     }, []);
//
//     // 🟢 Lưu bàn mới hoặc cập nhật
//     const save = async () => {
//         const token = localStorage.getItem("token");
//         if (!token) return alert("⚠️ Vui lòng đăng nhập với quyền admin!");
//
//         if (!form.name) return alert("⚠️ Nhập tên bàn!");
//
//         try {
//             if (editingId) {
//                 await api.put(`/tables/${editingId}`, form, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 alert("✅ Cập nhật bàn thành công!");
//             } else {
//                 await api.post("/tables", form, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 alert("✅ Thêm bàn mới thành công!");
//             }
//             setForm({ name: "", capacity: 0, status: "TRỐNG" });
//             setEditingId(null);
//             load();
//         } catch (err) {
//             console.error("❌ Lỗi khi lưu bàn:", err);
//             alert("❌ Không thể lưu bàn (kiểm tra quyền admin hoặc token)!");
//         }
//     };
//
//     const edit = (t) => {
//         setForm(t);
//         setEditingId(t.id);
//     };
//
//     const remove = async (id) => {
//         const token = localStorage.getItem("token");
//         if (!token) return alert("⚠️ Vui lòng đăng nhập với quyền admin!");
//         if (!window.confirm("Xác nhận xóa bàn này?")) return;
//
//         try {
//             await api.delete(`/tables/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             alert("🗑️ Đã xóa bàn!");
//             load();
//         } catch (err) {
//             console.error("❌ Lỗi khi xóa bàn:", err);
//             alert("❌ Không thể xóa bàn (kiểm tra quyền admin hoặc token)!");
//         }
//     };
//
//     return (
//         <div>
//             <h2>🪑 Quản lý bàn</h2>
//             <div className="card" style={{ marginBottom: 16 }}>
//                 <div
//                     style={{
//                         display: "grid",
//                         gridTemplateColumns: "1fr 1fr 1fr",
//                         gap: 12,
//                     }}
//                 >
//                     <input
//                         className="input"
//                         placeholder="Tên bàn"
//                         value={form.name}
//                         onChange={(e) => setForm({ ...form, name: e.target.value })}
//                     />
//                     <input
//                         className="input"
//                         type="number"
//                         placeholder="Sức chứa"
//                         value={form.capacity}
//                         onChange={(e) =>
//                             setForm({ ...form, capacity: Number(e.target.value) })
//                         }
//                     />
//                     <select
//                         className="input"
//                         value={form.status}
//                         onChange={(e) => setForm({ ...form, status: e.target.value })}
//                     >
//                         <option value="TRỐNG">TRỐNG</option>
//                         <option value="CÓ KHÁCH">CÓ KHÁCH</option>
//                         <option value="ĐÃ THANH TOÁN">ĐÃ THANH TOÁN</option>
//                     </select>
//                 </div>
//                 <button className="button primary" onClick={save}>
//                     {editingId ? "💾 Cập nhật" : "➕ Thêm mới"}
//                 </button>
//             </div>
//
//             <table className="table">
//                 <thead>
//                 <tr>
//                     <th>Tên bàn</th>
//                     <th>Sức chứa</th>
//                     <th>Trạng thái</th>
//                     <th>Hành động</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {list.map((t) => (
//                     <tr key={t.id}>
//                         <td>{t.name}</td>
//                         <td>{t.capacity}</td>
//                         <td>{t.status}</td>
//                         <td>
//                             <button className="button" onClick={() => edit(t)}>
//                                 ✏️ Sửa
//                             </button>
//                             <button
//                                 className="button"
//                                 style={{ marginLeft: 8 }}
//                                 onClick={() => remove(t.id)}
//                             >
//                                 🗑️ Xóa
//                             </button>
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

export default function TableManager() {
    const [list, setList] = useState([]);
    const [form, setForm] = useState({ name: "", capacity: "", status: "TRỐNG" });
    const [editingId, setEditingId] = useState(null);

    const load = async () => {
        try {
            const res = await api.get("/tables");
            setList(res.data || []);
        } catch (err) {
            console.error("❌ Lỗi tải bàn:", err);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const save = async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("⚠️ Vui lòng đăng nhập với quyền admin!");
        if (!form.name) return alert("⚠️ Nhập tên bàn!");

        try {
            if (editingId) {
                await api.put(`/tables/${editingId}`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("✅ Cập nhật bàn thành công!");
            } else {
                await api.post("/tables", form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("✅ Thêm bàn mới thành công!");
            }
            setForm({ name: "", capacity: "", status: "TRỐNG" });
            setEditingId(null);
            load();
        } catch (err) {
            console.error("❌ Lỗi khi lưu bàn:", err);
            alert("❌ Không thể lưu bàn!");
        }
    };

    const edit = (t) => {
        setForm(t);
        setEditingId(t.id);
    };

    const remove = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) return alert("⚠️ Đăng nhập quyền admin!");
        if (!window.confirm("Xác nhận xoá bàn này?")) return;

        try {
            await api.delete(`/tables/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("🗑️ Đã xoá bàn!");
            load();
        } catch (err) {
            console.error("❌ Lỗi xoá bàn:", err);
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#fffaf5",
                minHeight: "100vh",
                padding: "30px 60px",
                fontFamily: "'Poppins', sans-serif",
                color: "#3e2723",
            }}
        >
            <h2 style={{ fontSize: 24, marginBottom: 20 }}>🪑 Quản lý bàn</h2>

            <div
                style={{
                    backgroundColor: "#f8ede3",
                    padding: "16px",
                    borderRadius: 10,
                    marginBottom: 25,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr auto",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    <input
                        placeholder="Tên bàn"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={{
                            padding: "8px 10px",
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            fontSize: 14,
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Sức chứa"
                        value={form.capacity}
                        onChange={(e) =>
                            setForm({ ...form, capacity: Number(e.target.value) })
                        }
                        style={{
                            padding: "8px 10px",
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            fontSize: 14,
                        }}
                    />
                    <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        style={{
                            padding: "8px 10px",
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            fontSize: 14,
                        }}
                    >
                        <option value="TRỐNG">TRỐNG</option>
                        <option value="CÓ KHÁCH">CÓ KHÁCH</option>
                        <option value="ĐÃ THANH TOÁN">ĐÃ THANH TOÁN</option>
                    </select>

                    <button
                        onClick={save}
                        style={{
                            backgroundColor: "#6d4c41",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            padding: "8px 16px",
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        {editingId ? "💾 Cập nhật" : "➕ Thêm mới"}
                    </button>
                </div>
            </div>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    overflow: "hidden",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
            >
                <thead style={{ background: "#d7ccc8" }}>
                <tr>
                    <th style={thStyle}>Tên bàn</th>
                    <th style={thStyle}>Sức chứa</th>
                    <th style={thStyle}>Trạng thái</th>
                    <th style={thStyle}>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {list.map((t) => (
                    <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={tdStyle}>{t.name}</td>
                        <td style={tdStyle}>{t.capacity}</td>
                        <td style={tdStyle}>
                <span
                    style={{
                        backgroundColor:
                            t.status === "TRỐNG"
                                ? "#a5d6a7"
                                : t.status === "CÓ KHÁCH"
                                    ? "#ffe082"
                                    : "#bcaaa4",
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: 13,
                    }}
                >
                  {t.status}
                </span>
                        </td>
                        <td style={tdStyle}>
                            <button
                                onClick={() => edit(t)}
                                style={{
                                    background: "#4e342e",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "4px 10px",
                                    marginRight: 6,
                                    cursor: "pointer",
                                }}
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => remove(t.id)}
                                style={{
                                    background: "#b71c1c",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "4px 10px",
                                    cursor: "pointer",
                                }}
                            >
                                🗑️
                            </button>
                        </td>
                    </tr>
                ))}

                {list.length === 0 && (
                    <tr>
                        <td style={tdStyle} colSpan="4">
                            Chưa có bàn nào
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = {
    padding: "10px",
    borderBottom: "2px solid #a1887f",
    textAlign: "left",
    fontWeight: 600,
    color: "#3e2723",
};

const tdStyle = {
    padding: "10px",
    textAlign: "left",
    color: "#4e342e",
    fontSize: 14,
};
