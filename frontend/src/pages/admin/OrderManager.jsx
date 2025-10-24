
import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

// ===== CẤU HÌNH NGÂN HÀNG MB BANK (VietQR) =====
const BANK_CODE = "MB";
const ACCOUNT_NO = "0342867097";
const ACCOUNT_NAME = "NGUYEN THI MINH NGUYET";

export default function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);
    const [products, setProducts] = useState([]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);

    const [newOrder, setNewOrder] = useState({ tableId: "", items: [] });
    const [newItem, setNewItem] = useState({
        productId: "",
        quantity: 1,
        unitPrice: 0,
    });

    const [editingOrder, setEditingOrder] = useState(null);
    const [editItems, setEditItems] = useState([]);
    const [editTempItem, setEditTempItem] = useState({
        productId: "",
        quantity: 1,
        unitPrice: 0,
    });

    const [paymentOrder, setPaymentOrder] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash"); // "cash" | "bank"

    // ===== LOAD DỮ LIỆU =====
    const loadData = async () => {
        try {
            const [resOrders, resTables, resProducts] = await Promise.all([
                api.get("/orders"),
                api.get("/tables"),
                api.get("/products"),
            ]);
            setOrders(resOrders.data || []);
            setTables(resTables.data || []);
            setProducts(resProducts.data || []);
        } catch (e) {
            console.error("❌ Lỗi khi tải dữ liệu:", e);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // ===== HÀM PHỤ =====
    const getTableName = (id) =>
        tables.find((t) => t.id === id || t._id === id)?.name || "Không rõ";

    const calcTotal = (arr) =>
        (arr || []).reduce(
            (sum, it) => sum + Number(it.quantity || 0) * Number(it.unitPrice || 0),
            0
        );

    const buildVietqrUrl = (order) => {
        const amount = calcTotal(order.items);
        const addInfo = `ThanhToan${getTableName(order.tableId)}`;
        return `https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
            addInfo
        )}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
    };

    // ===== THÊM ĐƠN =====
    const addNewItem = () => {
        if (!newItem.productId) return alert("⚠️ Chọn món!");
        const p = products.find(
            (x) => x.id === newItem.productId || x._id === newItem.productId
        );
        if (!p) return;

        const exist = newOrder.items.find(
            (x) => x.productId === (p.id || p._id)
        );
        if (exist) {
            exist.quantity += Number(newItem.quantity);
        } else {
            newOrder.items.push({
                productId: p.id || p._id,
                productName: p.name,
                quantity: Number(newItem.quantity),
                unitPrice: Number(newItem.unitPrice || p.price || 0),
            });
        }
        setNewOrder({ ...newOrder });
        setNewItem({ productId: "", quantity: 1, unitPrice: 0 });
    };

    const saveNewOrder = async () => {
        const token = localStorage.getItem("token");
        if (!newOrder.tableId) return alert("⚠️ Chọn bàn!");
        if (!newOrder.items.length) return alert("⚠️ Chưa có món!");

        try {
            const payload = {
                tableId: newOrder.tableId,
                items: newOrder.items,
                totalPrice: calcTotal(newOrder.items),
                status: "Đang phục vụ",
                businessDate: new Date().toISOString().split("T")[0],
            };

            await api.post("/orders", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("✅ Đã thêm đơn hàng!");
            setShowAddModal(false);
            setNewOrder({ tableId: "", items: [] });
            await loadData();
        } catch (e) {
            console.error("❌ Lỗi khi thêm đơn:", e);
            alert("⚠️ Không thể thêm đơn!");
        }
    };

    // ===== SỬA ĐƠN =====
    const openEdit = (o) => {
        if (o.status?.includes("Đã thanh toán")) {
            alert("⚠️ Không thể sửa đơn đã thanh toán!");
            return;
        }
        setEditingOrder(o);
        setEditItems([...o.items]);
        setShowEditModal(true);
    };

    const updateEditItem = (i, field, val) => {
        const copy = [...editItems];
        copy[i][field] = Number(val);
        setEditItems(copy);
    };

    const removeEditItem = (i) => {
        const copy = [...editItems];
        copy.splice(i, 1);
        setEditItems(copy);
    };

    const saveEditOrder = async () => {
        const token = localStorage.getItem("token");
        try {
            const payload = {
                tableId: editingOrder.tableId,
                items: editItems,
                totalPrice: calcTotal(editItems),
                status: editingOrder.status || "Đang phục vụ",
                businessDate:
                    editingOrder.businessDate || new Date().toISOString().split("T")[0],
            };

            await api.put(`/orders/${editingOrder.id || editingOrder._id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("✅ Đã lưu thay đổi!");
            setShowEditModal(false);
            await loadData();
        } catch (e) {
            console.error("❌ Lỗi cập nhật đơn:", e);
            alert("⚠️ Không thể lưu đơn hàng!");
        }
    };

    // ===== XÓA ĐƠN =====
    const deleteOrder = async (id) => {
        if (!window.confirm("Xóa đơn hàng này?")) return;
        const token = localStorage.getItem("token");
        try {
            await api.delete(`/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("🗑️ Đã xóa đơn!");
            await loadData();
        } catch (e) {
            console.error("❌ Lỗi xóa đơn:", e);
            alert("⚠️ Không thể xóa đơn!");
        }
    };

    // ===== THANH TOÁN =====
    const openBill = (order) => {
        if (order.status !== "Đang phục vụ") return;
        setPaymentOrder(order);
        setPaymentMethod("cash");
        setShowPayModal(true);
    };

    const confirmPayment = async () => {
        const token = localStorage.getItem("token");
        try {
            await api.put(
                `/orders/${paymentOrder.id || paymentOrder._id}/status?status=Đã thanh toán (${
                    paymentMethod === "bank" ? "Chuyển khoản" : "Tiền mặt"
                })`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("✅ Thanh toán thành công!");
            setShowPayModal(false);

            // Refresh orders + tables để update trạng thái bàn
            const [resOrders, resTables] = await Promise.all([
                api.get("/orders"),
                api.get("/tables"),
            ]);
            setOrders(resOrders.data || []);
            setTables(resTables.data || []);
        } catch (e) {
            console.error("❌ Lỗi thanh toán:", e);
            alert("⚠️ Có lỗi xảy ra khi thanh toán!");
        }
    };

    // ===== STYLE =====
    const s = {
        page: {
            background: "#fffaf5",
            minHeight: "100vh",
            padding: "40px 60px",
            fontFamily: "'Poppins', sans-serif",
            color: "#3e2723",
        },
        title: { fontSize: 24, fontWeight: 700, color: "#4e342e", marginBottom: 20 },
        btn: (bg = "#6d4c41", color = "#fff") => ({
            backgroundColor: bg,
            color,
            border: "none",
            borderRadius: 8,
            padding: "6px 12px",
            cursor: "pointer",
        }),
        overlay: {
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999999,
        },
        modal: {
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            width: 640,
            maxHeight: "85vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
        },
        td: { padding: 8, borderBottom: "1px solid #eee" },
    };

    // ===== GIAO DIỆN =====
    return (
        <div style={s.page}>
            <h2 style={s.title}>📋 Quản lý đơn hàng</h2>

            <button style={s.btn("#6d4c41")} onClick={() => setShowAddModal(true)}>
                ➕ Thêm đơn hàng
            </button>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "#fff",
                    marginTop: 10,
                }}
            >
                <thead style={{ background: "#d7ccc8" }}>
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
                    <tr
                        key={o.id || o._id}
                        style={
                            o.status?.includes("Đã thanh toán")
                                ? { background: "#e8f5e9" }
                                : {}
                        }
                    >
                        <td style={s.td}>{getTableName(o.tableId)}</td>
                        <td style={s.td}>{o.businessDate}</td>
                        <td style={s.td}>{o.totalPrice?.toLocaleString()} đ</td>
                        <td style={s.td}>{o.status}</td>
                        <td style={s.td}>
                            {o.status === "Đang phục vụ" && (
                                <>
                                    <button
                                        style={s.btn("#8d6e63")}
                                        onClick={() => openBill(o)}
                                    >
                                        💳 Thanh toán
                                    </button>
                                    <button
                                        style={s.btn("#5d4037")}
                                        onClick={() => openEdit(o)}
                                    >
                                        ✏️ Sửa
                                    </button>
                                </>
                            )}
                            <button
                                style={s.btn("#b71c1c")}
                                onClick={() => deleteOrder(o.id || o._id)}
                            >
                                🗑️ Xóa
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* === MODAL THÊM === */}
            {showAddModal && (
                <div style={s.overlay}>
                    <div style={s.modal}>
                        <button
                            onClick={() => setShowAddModal(false)}
                            style={{
                                position: "absolute",
                                right: 12,
                                top: 8,
                                background: "none",
                                border: "none",
                                fontSize: 20,
                            }}
                        >
                            ×
                        </button>
                        <h3>➕ Thêm đơn hàng</h3>

                        <label>Chọn bàn:</label>
                        <select
                            value={newOrder.tableId}
                            onChange={(e) =>
                                setNewOrder({ ...newOrder, tableId: e.target.value })
                            }
                            style={{ width: "100%", marginBottom: 12 }}
                        >
                            <option value="">-- Chọn bàn --</option>
                            {tables.map((t) => (
                                <option key={t.id || t._id} value={t.id || t._id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>

                        <h4>Thêm món</h4>
                        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                            <select
                                value={newItem.productId}
                                onChange={(e) => {
                                    const p = products.find(
                                        (x) => x.id === e.target.value || x._id === e.target.value
                                    );
                                    setNewItem({
                                        ...newItem,
                                        productId: e.target.value,
                                        unitPrice: p ? p.price : 0,
                                    });
                                }}
                                style={{ flex: 2 }}
                            >
                                <option value="">-- Chọn món --</option>
                                {products.map((p) => (
                                    <option key={p.id || p._id} value={p.id || p._id}>
                                        {p.name} — {p.price?.toLocaleString()} đ
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min="1"
                                value={newItem.quantity}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, quantity: e.target.value })
                                }
                                style={{ width: 70 }}
                            />
                            <input
                                type="number"
                                value={newItem.unitPrice}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, unitPrice: e.target.value })
                                }
                                style={{ width: 100 }}
                            />
                            <button style={s.btn("#6d4c41")} onClick={addNewItem}>
                                Thêm
                            </button>
                        </div>

                        {newOrder.items.length > 0 && (
                            <table style={{ width: "100%", marginBottom: 12 }}>
                                <thead style={{ background: "#f1e3d6" }}>
                                <tr>
                                    <th>Món</th>
                                    <th>SL</th>
                                    <th>Đơn giá</th>
                                    <th>Thành tiền</th>
                                </tr>
                                </thead>
                                <tbody>
                                {newOrder.items.map((it, i) => (
                                    <tr key={i}>
                                        <td style={s.td}>{it.productName}</td>
                                        <td style={s.td}>{it.quantity}</td>
                                        <td style={s.td}>
                                            {Number(it.unitPrice).toLocaleString()} đ
                                        </td>
                                        <td style={s.td}>
                                            {(it.quantity * it.unitPrice).toLocaleString()} đ
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}

                        <p style={{ textAlign: "right", fontWeight: 700 }}>
                            Tổng: {calcTotal(newOrder.items).toLocaleString()} đ
                        </p>
                        <div style={{ textAlign: "right" }}>
                            <button style={s.btn("#8d6e63")} onClick={saveNewOrder}>
                                💾 Lưu đơn hàng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* === MODAL SỬA === */}
            {showEditModal && editingOrder && (
                <div style={s.overlay}>
                    <div style={s.modal}>
                        <button
                            onClick={() => setShowEditModal(false)}
                            style={{
                                position: "absolute",
                                right: 12,
                                top: 8,
                                background: "none",
                                border: "none",
                                fontSize: 20,
                            }}
                        >
                            ×
                        </button>

                        <h3>✏️ Sửa đơn — {getTableName(editingOrder.tableId)}</h3>

                        <table style={{ width: "100%", marginBottom: 10 }}>
                            <thead style={{ background: "#f1e3d6" }}>
                            <tr>
                                <th>Món</th>
                                <th>SL</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {editItems.map((it, i) => (
                                <tr key={i}>
                                    <td style={s.td}>{it.productName}</td>
                                    <td style={s.td}>
                                        <input
                                            type="number"
                                            min="1"
                                            value={it.quantity}
                                            onChange={(e) =>
                                                updateEditItem(i, "quantity", e.target.value)
                                            }
                                            style={{ width: 60 }}
                                        />
                                    </td>
                                    <td style={s.td}>
                                        <input
                                            type="number"
                                            value={it.unitPrice}
                                            onChange={(e) =>
                                                updateEditItem(i, "unitPrice", e.target.value)
                                            }
                                            style={{ width: 100 }}
                                        />
                                    </td>
                                    <td style={s.td}>
                                        {(it.quantity * it.unitPrice).toLocaleString()} đ
                                    </td>
                                    <td style={s.td}>
                                        <button
                                            onClick={() => removeEditItem(i)}
                                            style={s.btn("#b71c1c")}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <h4>➕ Thêm món mới</h4>
                        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                            <select
                                value={editTempItem.productId}
                                onChange={(e) => {
                                    const p = products.find(
                                        (x) => x.id === e.target.value || x._id === e.target.value
                                    );
                                    setEditTempItem({
                                        ...editTempItem,
                                        productId: e.target.value,
                                        unitPrice: p ? p.price : 0,
                                    });
                                }}
                                style={{ flex: 2 }}
                            >
                                <option value="">-- Chọn món --</option>
                                {products.map((p) => (
                                    <option key={p.id || p._id} value={p.id || p._id}>
                                        {p.name} — {p.price?.toLocaleString()} đ
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min="1"
                                value={editTempItem.quantity}
                                onChange={(e) =>
                                    setEditTempItem({
                                        ...editTempItem,
                                        quantity: e.target.value,
                                    })
                                }
                                style={{ width: 70 }}
                            />
                            <input
                                type="number"
                                value={editTempItem.unitPrice}
                                onChange={(e) =>
                                    setEditTempItem({
                                        ...editTempItem,
                                        unitPrice: e.target.value,
                                    })
                                }
                                style={{ width: 100 }}
                            />
                            <button
                                style={s.btn("#6d4c41")}
                                onClick={() => {
                                    if (!editTempItem.productId) return alert("⚠️ Chọn món!");
                                    const p = products.find(
                                        (x) =>
                                            x.id === editTempItem.productId ||
                                            x._id === editTempItem.productId
                                    );
                                    if (!p) return;
                                    const exist = editItems.find(
                                        (x) => x.productId === (p.id || p._id)
                                    );
                                    if (exist) exist.quantity += Number(editTempItem.quantity);
                                    else
                                        editItems.push({
                                            productId: p.id || p._id,
                                            productName: p.name,
                                            quantity: Number(editTempItem.quantity),
                                            unitPrice: Number(editTempItem.unitPrice || p.price || 0),
                                        });
                                    setEditItems([...editItems]);
                                    setEditTempItem({ productId: "", quantity: 1, unitPrice: 0 });
                                }}
                            >
                                ➕ Thêm
                            </button>
                        </div>

                        <p style={{ textAlign: "right", fontWeight: 700 }}>
                            Tổng: {calcTotal(editItems).toLocaleString()} đ
                        </p>
                        <div style={{ textAlign: "right" }}>
                            <button style={s.btn("#8d6e63")} onClick={saveEditOrder}>
                                💾 Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* === MODAL THANH TOÁN === */}
            {showPayModal && paymentOrder && (
                <div style={s.overlay}>
                    <div style={s.modal}>
                        <button
                            onClick={() => setShowPayModal(false)}
                            style={{
                                position: "absolute",
                                right: 12,
                                top: 8,
                                background: "none",
                                border: "none",
                                fontSize: 20,
                            }}
                        >
                            ×
                        </button>

                        <h3 style={{ textAlign: "center", color: "#4e342e", marginBottom: 16 }}>
                            💰 Hóa đơn thanh toán
                        </h3>
                        <p>
                            <b>Bàn:</b> {getTableName(paymentOrder.tableId)}
                        </p>
                        <p>
                            <b>Ngày:</b> {paymentOrder.businessDate}
                        </p>

                        <table style={{ width: "100%", marginTop: 8 }}>
                            <thead style={{ background: "#f1e3d6" }}>
                            <tr>
                                <th>Món</th>
                                <th>SL</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paymentOrder.items.map((it, i) => (
                                <tr key={i}>
                                    <td style={s.td}>{it.productName}</td>
                                    <td style={s.td}>{it.quantity}</td>
                                    <td style={s.td}>
                                        {Number(it.unitPrice).toLocaleString()} đ
                                    </td>
                                    <td style={s.td}>
                                        {(it.quantity * it.unitPrice).toLocaleString()} đ
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <p style={{ textAlign: "right", fontWeight: 700, marginTop: 8 }}>
                            Tổng cộng: {calcTotal(paymentOrder.items).toLocaleString()} đ
                        </p>

                        <h4 style={{ marginTop: 16 }}>Chọn phương thức thanh toán:</h4>
                        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                            <button
                                style={s.btn(
                                    paymentMethod === "cash" ? "#6d4c41" : "#d7ccc8",
                                    paymentMethod === "cash" ? "#fff" : "#3e2723"
                                )}
                                onClick={() => setPaymentMethod("cash")}
                            >
                                💰 Tiền mặt
                            </button>
                            <button
                                style={s.btn(
                                    paymentMethod === "bank" ? "#6d4c41" : "#d7ccc8",
                                    paymentMethod === "bank" ? "#fff" : "#3e2723"
                                )}
                                onClick={() => setPaymentMethod("bank")}
                            >
                                🏦 Chuyển khoản
                            </button>
                        </div>

                        {paymentMethod === "bank" && (
                            <div style={{ textAlign: "center" }}>
                                <img
                                    src={buildVietqrUrl(paymentOrder)}
                                    alt="QR thanh toán"
                                    width="240"
                                    height="240"
                                    style={{
                                        borderRadius: 12,
                                        border: "2px solid #d7ccc8",
                                        marginBottom: 10,
                                    }}
                                />
                                <div style={{ fontSize: 14, color: "#4e342e" }}>
                                    <p>
                                        <b>Ngân hàng:</b> MB Bank
                                    </p>
                                    <p>
                                        <b>Chủ TK:</b> {ACCOUNT_NAME}
                                    </p>
                                    <p>
                                        <b>Số TK:</b> {ACCOUNT_NO}
                                    </p>
                                    <p>
                                        <b>Nội dung:</b> Thanh toán {getTableName(paymentOrder.tableId)}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div style={{ textAlign: "center", marginTop: 16 }}>
                            <button style={s.btn("#5d4037")} onClick={confirmPayment}>
                                ✅ Xác nhận thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
