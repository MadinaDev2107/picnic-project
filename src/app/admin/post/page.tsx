"use client";

import { db } from "@/app/firebase/firebase.config";
import { Blog } from "@/types";
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
import Rodal from "rodal";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    image: "",
    author: "",
    description: "",
  });
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const q = collection(db, "blog");
      const snap = await getDocs(q);
      const data: Blog[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Blog, "id">),
      }));
      setBlogs(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);
  //delete
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "blog", id));
      toast.success("Blog o'chirildi!");
      fetchBlogs();
    } catch (err) {
      console.log(err);
      toast.error("Xatolik!");
    }
  };
  //edit button
  const openEdit = (b: Blog) => {
    setEditId(b.id);
    setForm({
      title: b.title ?? "",
      image: b.image ?? "",
      author: b.author ?? "",
      description: b.description ?? "",
    });
    setOpen(true);
  };
  //add button
  const addBlog = () => {
    setEditId(null);
    setForm({
      title: "",
      image: "",
      author: "",
      description: "",
    });
    setOpen(true);
  };
  //add yoki edit
  const handleSubmit = async () => {
    const { title, image, author, description } = form;
    if (!title || !image || !author || !description) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }
    const obj = {
      title: form.title,
      image: form.image,
      author: form.author,
      description: form.description,
    };

    try {
      if (editId) {
        await updateDoc(doc(db, "blog", editId), obj);
        toast.success("Blog yangilandi!");
      } else {
        await addDoc(collection(db, "blog"), {
          ...obj,
          createdAt: new Date(),
        });
        toast.success("Yangi blog qo'shildi!");
      }

      setOpen(false);
      fetchBlogs();
    } catch (err) {
      console.log(err);
      toast.error("Saqlashda xatolik!");
    }
  };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Bloglar</h1>
        <button onClick={addBlog} className="btn btn-dark">
          + Add Blog
        </button>
      </div>
      <div className="overflow-y-auto h-75 hide-scrollbar">
        <table className="table">
          <thead className="table-dark">
            <tr>
              <th>Photo</th>
              <th>Author</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4 text-center">Yuklanmoqda...</td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td className="p-4 text-center">Bloglar topilmadi</td>
              </tr>
            ) : (
              blogs.map((b) => (
                <tr key={b.id}>
                  <td>
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-[50px] h-10 object-cover rounded "
                    />
                  </td>
                  <td>{b.author}</td>
                  <td>{b.title.slice(0, 20)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        <RiDeleteBin5Fill />
                      </button>

                      <button
                        onClick={() => openEdit(b)}
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
        <div className="h-[400px] overflow-y-auto hide-scrollbar">
          <h2 className="text-xl font-bold mb-3">
            {editId ? "Edit Blog" : "Add Blog"}
          </h2>
          <input
            value={form.image}
            onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))}
            className="form-control mt-2"
            placeholder="Image URL..."
          />
          <input
            value={form.author}
            onChange={(e) => setForm((s) => ({ ...s, author: e.target.value }))}
            className="form-control mt-2"
            placeholder="Author..."
          />
          <input
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            className="form-control mt-2"
            placeholder="Blog title..."
          />
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((s) => ({ ...s, description: e.target.value }))
            }
            placeholder="Blog description..."
            className="form-control mt-2"
          ></textarea>
          <div className="flex justify-end gap-2 mt-3">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-dark btn-sm" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </Rodal>
    </div>
  );
}
