"use client";

import { auth, db } from "@/app/firebase/firebase.config";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AiFillProduct } from "react-icons/ai";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { GrCart } from "react-icons/gr";
import { IoHome } from "react-icons/io5";
import { RiContactsFill } from "react-icons/ri";
import { SiBloglovin } from "react-icons/si";
import { collection, getDocs } from "firebase/firestore";
import { Product } from "@/types";

const Header = () => {
  const [open, setOpen] = useState(false); // Sidebar
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const data: Product[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Product, "id">),
        }));
        setProducts(data);
      } catch (error) {
        console.log("Firebase xatolik:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setFilteredProducts([]);
      setShowResults(false);
      return;
    }
    const filtered = products.filter((p) =>
      p.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
    setShowResults(true);
  };

  const Chiqish = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/");
  };

  const Login = () => router.push("/auth");

  return (
    <>
      <div className="flex items-center justify-between border w-full px-4 py-2 mx-auto bg-white relative">
        <Link href={`/`}>
          <Image src="/logo.svg" width={60} height={60} alt="logo" />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className="hover:text-[#245D30] text-decoration-none text-black"
          >
            Bosh sahifa
          </Link>
          <Link
            href="/mahsulotlar"
            className="hover:text-[#245D30] text-decoration-none text-black"
          >
            Mahsulotlar
          </Link>
          <Link
            href="/aloqa"
            className="hover:text-[#245D30] text-decoration-none text-black"
          >
            Aloqa
          </Link>
          <Link
            href="/blog"
            className="hover:text-[#245D30] text-decoration-none text-black"
          >
            Blog
          </Link>
        </div>

        <div className="hidden lg:flex relative">
          <div className="flex items-center gap-2 border px-3 py-1 rounded-full bg-white">
            <FaSearch className="text-gray-600" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Mahsulot qidirish..."
              className="outline-none"
              onFocus={() => setShowResults(true)}
              onKeyDown={(e) => e.key === "Enter" && setShowResults(false)}
            />
          </div>

          {showResults && filteredProducts.length > 0 && (
            <div className="absolute top-12 w-[250px] bg-white shadow-lg rounded-lg p-3 z-40">
              {filteredProducts.slice(0, 6).map((p) => (
                <Link
                  href={`/mahsulotlar/${p.id}`}
                  key={p.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded text-decoration-none text-black"
                  onClick={() => setShowResults(false)}
                >
                  <Image
                    src={p.images[0]}
                    alt={p.title}
                    width={48}
                    height={48}
                    className="object-cover rounded"
                  />
                  <p className="text-sm">{p.title}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Link href="/cart" className="text-decoration-none text-black">
            <GrCart className="text-2xl" />
          </Link>
          {user ? (
            <button
              onClick={Chiqish}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Chiqish
            </button>
          ) : (
            <button
              onClick={Login}
              className="bg-[#245D30] text-white px-3 py-1 rounded"
            >
              Kirish
            </button>
          )}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="block lg:hidden text-2xl"
        >
          <FaBars />
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-[70%] sm:w-[50%] bg-white shadow-xl z-50 transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          onClick={() => setOpen(false)}
          className="text-2xl p-3 w-full text-right flex items-center gap-3"
        >
          <FaTimes /> <h2 className="text-[#245D30]! mt-2">Menyular</h2>
        </button>

        <ul className="flex flex-col gap-3 px-5 text-lg">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-decoration-none text-black"
          >
            <IoHome className="text-[#245D30]!" /> Bosh sahifa
          </Link>
          <Link
            href="/mahsulotlar"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-decoration-none text-black"
          >
            <AiFillProduct className="text-[#245D30]!" /> Mahsulotlar
          </Link>
          <Link
            href="/aloqa"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-decoration-none text-black"
          >
            <RiContactsFill className="text-[#245D30]!" /> Aloqa
          </Link>
          <Link
            href="/blog"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-decoration-none text-black"
          >
            <SiBloglovin className="text-[#245D30]!" /> Blog
          </Link>

          <div className="flex items-center gap-2 border border-[#245D30]! px-3 py-1 rounded-full mt-2">
            <FaSearch />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setShowResults(false)}
              placeholder="Mahsulot qidirish..."
              className="outline-none w-full"
            />
          </div>

          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 mt-1 text-decoration-none text-black"
          >
            <GrCart className="text-2xl" /> Savatcha
          </Link>

          {user ? (
            <button
              onClick={() => {
                Chiqish();
                setOpen(false);
              }}
              className="flex items-center gap-3 bg-red-500 text-white px-3.5 py-2 mt-5 rounded hover:bg-red-600"
            >
              <FiLogOut className="text-xl" /> Chiqish
            </button>
          ) : (
            <button
              onClick={() => {
                Login();
                setOpen(false);
              }}
              className="flex items-center gap-3 bg-[#245D30] text-white px-3.5 py-2 mt-5 rounded hover:bg-[#1e4724]"
            >
              Kirish
            </button>
          )}
        </ul>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40"
        ></div>
      )}
      {showResults && (
        <div
          onClick={() => setShowResults(false)}
          className="fixed inset-0 z-30"
        ></div>
      )}
    </>
  );
};

export default Header;
