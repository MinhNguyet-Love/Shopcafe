import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function ProductManager() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
    });
    const [file, setFile] = useState(null);
    const [editId, setEditId] = useState(null);

    // 🟢 Lấy danh sách sản phẩm
    const fetchProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data || []);
        } catch (err) {
            console.error("❌ Lỗi khi tải sản phẩm:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // 🟢 Gửi form thêm / cập nhật món
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("⚠️ Bạn cần đăng nhập với quyền ADMIN!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append(
                "product",
                new Blob([JSON.stringify(form)], { type: "application/json" })
            );
            if (file) formData.append("image", file);

            const url = editId ? `/products/${editId}` : "/products";
            const method = editId ? "put" : "post";

            await api.request({
                url,
                method,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`, // 🔑 Token gửi lên server
                },
            });

            alert(editId ? "✅ Cập nhật món thành công!" : "✅ Thêm món mới thành công!");
            setForm({ name: "", price: "", category: "", description: "" });
            setFile(null);
            setEditId(null);
            fetchProducts();
        } catch (err) {
            console.error("❌ Upload lỗi:", err);
            alert("❌ Không thể lưu món (kiểm tra quyền admin hoặc token)!");
        }
    };

    // 🟢 Chọn món để chỉnh sửa
    const handleEdit = (p) => {
        setForm({
            name: p.name,
            price: p.price,
            category: p.category,
            description: p.description,
        });
        setEditId(p.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 🟢 Xoá món
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("⚠️ Bạn cần đăng nhập với quyền ADMIN!");
            return;
        }

        if (!window.confirm("Bạn có chắc muốn xóa món này?")) return;

        try {
            await api.delete(`/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("🗑️ Xóa món thành công!");
            fetchProducts();
        } catch (err) {
            console.error("❌ Lỗi khi xóa món:", err);
            alert("❌ Không thể xóa món (kiểm tra quyền admin hoặc token)!");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-3">🍜 Quản lý món ăn</h2>

            {/* Form thêm / sửa món */}
            <form
                onSubmit={handleSubmit}
                className="border p-4 rounded bg-gray-50 mb-4 shadow-sm"
            >
                <input
                    type="text"
                    placeholder="Tên món"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="block w-full border p-2 mb-2 rounded"
                    required
                />
                <input
                    type="number"
                    placeholder="Giá (VND)"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="block w-full border p-2 mb-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Loại (ví dụ: cà phê, nước, bánh...)"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="block w-full border p-2 mb-2 rounded"
                />
                <textarea
                    placeholder="Mô tả món ăn"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="block w-full border p-2 mb-2 rounded"
                    rows="3"
                ></textarea>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="block mb-3"
                />

                <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                    {editId ? "💾 Cập nhật món" : "➕ Thêm món"}
                </button>
            </form>

            {/* Danh sách món ăn */}
            <table className="w-full border-collapse border text-sm">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2 w-[80px]">Ảnh</th>
                    <th className="border p-2">Tên món</th>
                    <th className="border p-2">Giá (VND)</th>
                    <th className="border p-2">Loại</th>
                    <th className="border p-2">Mô tả</th>
                    <th className="border p-2 w-[120px] text-center">Hành động</th>
                </tr>
                </thead>
                <tbody>
                {products.map((p) => (
                    <tr key={p.id}>
                        <td className="border p-2 text-center">
                            <img
                                src={
                                    p.imageUrl
                                        ? `http://localhost:8080${p.imageUrl}`
                                        : "https://via.placeholder.com/60x60?text=No+Image"
                                }
                                alt={p.name}
                                className="w-14 h-14 object-cover mx-auto rounded"
                            />
                        </td>
                        <td className="border p-2">{p.name}</td>
                        <td className="border p-2">
                            {p.price ? p.price.toLocaleString() : ""}
                        </td>
                        <td className="border p-2">{p.category}</td>
                        <td className="border p-2">{p.description}</td>
                        <td className="border p-2 text-center">
                            <button
                                onClick={() => handleEdit(p)}
                                className="text-blue-600 hover:underline mr-2"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => handleDelete(p.id)}
                                className="text-red-600 hover:underline"
                            >
                                🗑️
                            </button>
                        </td>
                    </tr>
                ))}

                {products.length === 0 && (
                    <tr>
                        <td colSpan="6" className="text-center p-3 text-gray-500">
                            Chưa có món nào trong hệ thống
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
