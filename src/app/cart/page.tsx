"use client";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { CartItem } from "@/types";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Rodal from "rodal";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    message: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      const querySnapshot = await getDocs(collection(db, "cart"));
      const items: CartItem[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<CartItem, "id">;
        return {
          id: doc.id,
          ...data,
        };
      });
      setCartItems(items);
    };
    fetchCart();
  }, []);

  const decreaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  const increaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const removeItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "cart", id));
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Mahsulot savatdan o'chirildi");
    } catch (error) {
      console.log("Cartni o'chirishda xatolik:", error);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = subtotal * 0.2;
  const total = subtotal - discount;

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Iltimos barcha maydonlarni to‘ldiring!");
      return;
    }
    try {
      await addDoc(collection(db, "orders"), {
        name: form.name,
        phone: form.phone,
        address: form.address,
        message: form.message,
        items: cartItems,
        totalPrice: total,
        createdAt: new Date(),
      });
      await clearCart();
      toast.success("Buyurtma muvaffaqiyatli yuborildi!");
      clearForm();
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi, qayta urinib ko‘ring.");
    }
  };

  const clearForm = () => {
    setForm({ name: "", phone: "", address: "", message: "" });
  };

  const clearCart = async () => {
    try {
      for (const item of cartItems) {
        await deleteDoc(doc(db, "cart", item.id));
      }
      setCartItems([]);
    } catch (error) {
      console.log("Cartni tozalashda xatolik:", error);
    }
  };

  return (
    <div className="divPro2 mx-auto max-w-[1200px] gap-3">
      <h1 className="text-3xl font-bold mb-3 mt-4">Sizning savatingiz</h1>
      <div className="flex cartButto cartDiv justify-between mx-auto max-w-[1200px] gap-3">
        <div className="p-3 cartWidth w-100  border rounded ">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="border-bottom py-2 flex justify-between"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.images}
                    alt={item.title}
                    className="w-[100px] h-[100px] object-cover rounded-lg border"
                  />
                  <div>
                    <h5 className="font-semibold mt-3">
                      {item.title.slice(0, 15)}
                    </h5>
                    <p className="mt-5">${item.price}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-danger"
                  >
                    <RiDeleteBin5Fill size={24} />
                  </button>

                  <div className="rounded-full w-[106px] h-[38px] mb-2 flex items-center border justify-evenly bg-[#F0F0F0] mt-5">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="fs-3 mb-2 text-secondary"
                    >
                      -
                    </button>
                    <p className="mt-3">{item.quantity}</p>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="fs-5 mb-2 text-secondary"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Link
              href={`/`}
              className="flex items-center gap-3 text-decoration-none text-black"
            >
              Savatcha hozircha bo`sh <FaArrowLeft size={24} />
            </Link>
          )}
        </div>

        <div className="border orderWidth w-50  rounded  p-3">
          <h3>Buyurtma xulosasi</h3>
          <div className="flex items-center justify-between mt-5">
            <p className="text-secondary">Oraliq jami</p>
            <b>${subtotal.toFixed(2)}</b>
          </div>
          <div className="flex items-center justify-between border-b mt-3">
            <p className="text-secondary">Chegirma (20%)</p>
            <b className="text-danger">-${discount.toFixed(2)}</b>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-secondary">Umumiy</p>
            <b>${total.toFixed(2)}</b>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-[#245D30] max-w-[450px] h-[50px] text-white rounded-full! mt-3 w-100"
          >
            Buyurtma berish
          </button>
        </div>
      </div>

      <Rodal
        visible={openModal}
        onClose={() => setOpenModal(false)}
        customStyles={{ height: "max-content", width: "450px" }}
      >
        <div className="h-[500px] overflow-y-auto hide-scrollbar flex flex-col gap-3">
          <h4 className="text-xl font-bold mt-4 text-center">
            Buyurtma Berish Ma`lumotlari
          </h4>
          <label htmlFor="name" className="font-medium mt-2">
            Ism Familiya
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className="form-control mt-1"
              placeholder="To'liq ism va familiyangiz..."
            />
          </label>
          <label htmlFor="phone" className="font-medium mt-3">
            Telefon raqam
            <input
              id="phone"
              value={form.phone}
              onChange={(e) =>
                setForm((s) => ({ ...s, phone: e.target.value }))
              }
              className="form-control mt-2"
              placeholder="+998 ** *** ** **"
              type="text"
            />
          </label>
          <label htmlFor="manzil" className="font-medium mt-3">
            Manzil
            <input
              id="manzil"
              value={form.address}
              onChange={(e) =>
                setForm((s) => ({ ...s, address: e.target.value }))
              }
              className="form-control mt-1"
              placeholder="Manzilingiz..."
              type="text"
            />
          </label>
          <label htmlFor="izoh" className="font-medium mt-3">
            Qo`shimcha ma`lumot
          </label>
          <textarea
            id="izoh"
            value={form.message}
            onChange={(e) =>
              setForm((s) => ({ ...s, message: e.target.value }))
            }
            className="form-control mt-1"
            placeholder="Izoh qoldirish majburiy emas..."
          ></textarea>

          <div className="flex justify-end gap-2 mt-4 mb-2">
            <button
              onClick={() => setOpenModal(false)}
              className="btn btn-danger btn-sm"
            >
              Bekor qilish
            </button>
            <button onClick={handleSubmit} className="btn btn-dark btn-sm">
              Yuborish
            </button>
          </div>
        </div>
      </Rodal>
    </div>
  );
}
