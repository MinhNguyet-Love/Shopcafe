import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function TableManager() {
    const [list, setList] = useState([]);
    const [form, setForm] = useState({ name: "", capacity: 0, status: "TRỐNG" });
    const [editingId, setEditingId] = useState(null);

    // 🟢 Lấy danh sách bàn
    const load = async () => {
        try {
            const res = await api.get("/tables");
            setList(res.data || []);
        } catch (err) {
            console.error("❌ Lỗi tải danh sách bàn:", err);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // 🟢 Lưu bàn mới hoặc cập nhật
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
            setForm({ name: "", capacity: 0, status: "TRỐNG" });
            setEditingId(null);
            load();
        } catch (err) {
            console.error("❌ Lỗi khi lưu bàn:", err);
            alert("❌ Không thể lưu bàn (kiểm tra quyền admin hoặc token)!");
        }
    };

    const edit = (t) => {
        setForm(t);
        setEditingId(t.id);
    };

    const remove = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) return alert("⚠️ Vui lòng đăng nhập với quyền admin!");
        if (!window.confirm("Xác nhận xóa bàn này?")) return;

        try {
            await api.delete(`/tables/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("🗑️ Đã xóa bàn!");
            load();
        } catch (err) {
            console.error("❌ Lỗi khi xóa bàn:", err);
            alert("❌ Không thể xóa bàn (kiểm tra quyền admin hoặc token)!");
        }
    };

    return (
        <div>
            <h2>🪑 Quản lý bàn</h2>
            <div className="card" style={{ marginBottom: 16 }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 12,
                    }}
                >
                    <input
                        className="input"
                        placeholder="Tên bàn"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        className="input"
                        type="number"
                        placeholder="Sức chứa"
                        value={form.capacity}
                        onChange={(e) =>
                            setForm({ ...form, capacity: Number(e.target.value) })
                        }
                    />
                    <select
                        className="input"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                        <option value="TRỐNG">TRỐNG</option>
                        <option value="CÓ KHÁCH">CÓ KHÁCH</option>
                        <option value="ĐÃ THANH TOÁN">ĐÃ THANH TOÁN</option>
                    </select>
                </div>
                <button className="button primary" onClick={save}>
                    {editingId ? "💾 Cập nhật" : "➕ Thêm mới"}
                </button>
            </div>

            <table className="table">
                <thead>
                <tr>
                    <th>Tên bàn</th>
                    <th>Sức chứa</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {list.map((t) => (
                    <tr key={t.id}>
                        <td>{t.name}</td>
                        <td>{t.capacity}</td>
                        <td>{t.status}</td>
                        <td>
                            <button className="button" onClick={() => edit(t)}>
                                ✏️ Sửa
                            </button>
                            <button
                                className="button"
                                style={{ marginLeft: 8 }}
                                onClick={() => remove(t.id)}
                            >
                                🗑️ Xóa
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
