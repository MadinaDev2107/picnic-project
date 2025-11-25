"use client";

import { db } from "@/app/firebase/firebase.config";
import { Product, Category } from "@/types";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Rodal from "rodal";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    discount: "",
    rating: "",
    description: "",
    images: ["", "", ""],
  });

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const q = collection(db, "products");
      const snap = await getDocs(q);
      const data: Product[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Product, "id">),
      }));
      setProducts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, "categories"));
        const data: Category[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Category, "id">),
        }));
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
    fetchProducts();
  }, [fetchProducts]);

  // Delete product
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product successfully deleted!");
      fetchProducts();
    } catch (err) {
      console.log(err);
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  // Open edit
  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      title: p.title ?? "",
      price: String(p.price ?? ""),
      category: p.category ?? "",
      discount: String(p.discount ?? ""),
      rating: String(p.rating ?? ""),
      description: p.description ?? "",
      images:
        p.images && p.images.length ? p.images.slice(0, 10) : ["", "", ""],
    });
    setOpen(true);
  };

  // Open add
  const addProduct = () => {
    setEditId(null);
    setForm({
      title: "",
      price: "",
      category: "",
      discount: "",
      rating: "",
      description: "",

      images: ["", "", ""],
    });
    setOpen(true);
  };

  // Save add or edit
  const handleSubmit = async () => {
    const { title, price, category } = form;
    if (!title || !price || !category) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }
    const images = form.images.map((s) => s).filter(Boolean);
    if (images.length < 3) {
      toast.error("Kamida 3 ta rasm URL kiriting");
      return;
    }
    const productObj = {
      title: form.title,
      price: Number(form.price) || 0,
      category: form.category,
      discount: Number(form.discount) || 0,
      rating: Number(form.rating) || 0,
      description: form.description,
      images,
    };

    try {
      if (editId) {
        await updateDoc(doc(db, "products", editId), productObj);
        toast.success("Product successfully edited!");
      } else {
        await addDoc(collection(db, "products"), productObj);
        toast.success("Product successfully added!");
      }
      setOpen(false);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.log(err);
      toast.error("Saqlashda xatolik yuz berdi");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Mahsulotlar</h1>
        <div className="flex gap-2">
          <button onClick={addProduct} className="btn btn-dark">
            + Add product
          </button>
        </div>
      </div>
      <div className="h-75 hide-scrollbar">
        <table className="table w-full">
          <thead className="table-dark">
            <tr>
              <th>Photo</th>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Yuklanmoqda...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Mahsulot topilmadi
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.images?.[0]}
                      alt={p.title}
                      className="w-[50px] h-[50px] object-cover rounded"
                    />
                  </td>
                  <td>{p.title.slice(0, 15)}</td>
                  <td>${p.price}</td>
                  <td>
                    {categories.find((c) => c.id === p.category)?.name ||
                      p.category}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        <RiDeleteBin5Fill />
                      </button>
                      <button
                        onClick={() => openEdit(p)}
                        className="btn btn-outline-warning btn-sm"
                      >
                        <MdEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Rodal
        visible={open}
        onClose={() => setOpen(false)}
        customStyles={{ height: "max-content" }}
      >
        <div className="h-[500px] overflow-y-auto hide-scrollbar">
          <h2 className="text-xl font-bold mb-3">
            {editId ? "Edit Product" : "New Product"}
          </h2>

          <input
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            className="form-control mt-2"
            placeholder="Product name..."
          />

          <input
            value={form.price}
            onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
            className="form-control mt-2"
            placeholder="Product price..."
            type="number"
          />

          {/* Category select */}
          <select
            value={form.category}
            onChange={(e) =>
              setForm((s) => ({ ...s, category: e.target.value }))
            }
            className="form-control mt-2"
          >
            <option value="">Select category...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            value={form.discount}
            onChange={(e) =>
              setForm((s) => ({ ...s, discount: e.target.value }))
            }
            className="form-control mt-2"
            placeholder="Product discount... (%)"
            type="number"
          />

          <input
            value={form.rating}
            onChange={(e) => setForm((s) => ({ ...s, rating: e.target.value }))}
            className="form-control mt-2"
            placeholder="Product rating... (1-5)"
            type="number"
            min={0}
            max={5}
          />
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((s) => ({ ...s, description: e.target.value }))
            }
            placeholder="Product description..."
            className="form-control mt-2"
          ></textarea>
          <p className="font-medium mb-0 mt-2 ms-1">Photos:</p>
          {form.images.map((img, i) => (
            <input
              key={i}
              value={img}
              onChange={(e) => {
                const copy = [...form.images];
                copy[i] = e.target.value;
                setForm((s) => ({ ...s, images: copy }));
              }}
              className="form-control mb-2"
              placeholder={`Image ${i + 1}`}
            />
          ))}

          <div className="flex gap-2 mt-2">
            <button
              onClick={() =>
                setForm((s) => ({ ...s, images: [...s.images, ""] }))
              }
              className="btn btn-light btn-sm w-100"
            >
              + photo
            </button>
            <button
              onClick={() =>
                setForm((s) => ({
                  ...s,
                  images: s.images.slice(0, Math.max(3, s.images.length - 1)),
                }))
              }
              className="btn btn-light btn-sm w-100"
            >
              - photo
            </button>
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setOpen(false)}
              className="btn btn-danger btn-sm"
            >
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn btn-dark btn-sm">
              Save
            </button>
          </div>
        </div>
      </Rodal>
    </div>
  );
}
