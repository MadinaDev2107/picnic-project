"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";

import {
  FiMenu,
  FiLogOut,
  FiBox,
  FiFileText,
  FiPhone,
  FiShoppingBag,
} from "react-icons/fi";
import { auth } from "../firebase/firebase.config";

const ADMIN_EMAIL = "admin@gmail.com";

const links = [
  { name: "Mahsulotlar", path: "/admin/products", icon: <FiBox /> },
  { name: "Buyurtmalar", path: "/admin/order", icon: <FiShoppingBag /> },
  { name: "Postlar", path: "/admin/post", icon: <FiFileText /> },
  { name: "Aloqalar", path: "/admin/aloqa", icon: <FiPhone /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth");
        return;
      }
      if (user.email !== ADMIN_EMAIL) {
        router.push("/");
        return;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl">
        Yuklanmoqda...
      </div>
    );
  }

  const Chiqish = async () => {
    try {
      await signOut(auth);
      router.push("/auth");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`
          bg-white h-full shadow-md transition-all duration-300 
          ${open ? "w-64" : "w-16"} 
        `}
      >
        <button
          onClick={() => setOpen(!open)}
          className="text-2xl p-3 hover:bg-gray-200 w-full text-left flex items-center gap-2"
        >
          <FiMenu size={20} />
          {open && <span>Admin Panel</span>}
        </button>

        <ul className="mt-3 p-0">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                href={link.path}
                className={`
                  flex text-decoration-none text-black items-center gap-3 py-2 px-3 mb-2 rounded-lg transition 
                  ${
                    pathname === link.path
                      ? "bg-[#245D30] text-white font-semibold m-2"
                      : "hover:bg-gray-200 m-2"
                  }
                `}
              >
                <span className="text-xl">{link.icon}</span>
                {open && <span className="text-[16px]">{link.name}</span>}
              </Link>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-5 w-full m-2">
          <button
            onClick={Chiqish}
            className="flex items-center gap-3 bg-red-500 text-white px-3.5 py-2 rounded hover:bg-red-600"
          >
            <FiLogOut className="text-xl" />
            {open && <span>Chiqish</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">{children}</div>
    </div>
  );
}
