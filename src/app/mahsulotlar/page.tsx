"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase/firebase.config";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Category, Product } from "@/types";
import { MdAddShoppingCart } from "react-icons/md";
import rating from "../../../public/Frame 10.svg";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data: Product[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Product, "id">),
        }));
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Xatolik:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const data: Category[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Category, "id">),
        }));
        setCategories(data);
      } catch (error) {
        console.error("Xatolik:", error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);
  //filter
  const handleCategoryClick = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
      setFilteredProducts(products);
    } else {
      setActiveCategory(categoryId);
      setFilteredProducts(products.filter((p) => p.category === categoryId));
    }
  };
  //savatga quwiw
  const addToCart = async (product: Product) => {
    try {
      await addDoc(collection(db, "cart"), {
        title: product.title,
        price: product.price,
        images: product.images[0],
        quantity: 1,
        createdAt: new Date(),
      });
      toast.success("Mahsulot savatga qo'shildi ");
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  return (
    <div>
      <div className="w-[1180px] mx-auto my-6">
        <Link href={`/`}>
          <FaArrowLeft size={24} className="text-black ms-2" />
        </Link>
      </div>
      {/* --- Categories --- */}
      <div
        style={{ marginTop: "10px", marginBottom: "30px" }}
        className="flex gap-4 max-w-[1220px] overflow-x-auto hide-scrollbar py-2 px-3 mx-auto"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            className={`flex items-center gap-2 btn transition rounded-full! w-[180px] h-[50px] shrink-0 border ${
              activeCategory === category.id ? "bg-gray-300" : "btn-light"
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div>
              <p style={{ fontSize: "20px", fontWeight: "400" }}>
                {category.name.slice(0, 10)}...
              </p>
            </div>
          </button>
        ))}
      </div>
      {/* --- Products Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-[1220px] mx-auto px-4 mb-[60px] mt-[60px]">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link
              href={`/mahsulotlar/${product.id}`}
              key={product.id}
              className="bg-white text-decoration-none text-black rounded-2xl hover:shadow-lg transition-shadow duration-300 p-2 border-gray-100"
            >
              {product.images?.[0] && (
                <div>
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="rounded-xl w-full h-[200px] object-cover"
                  />
                </div>
              )}
              <h2
                style={{ fontSize: "20px", fontWeight: "700" }}
                className="font-bold text-start"
              >
                {product.title.slice(0, 10)}...
              </h2>
              <div
                style={{ marginTop: "-15px" }}
                className="flex items-center gap-2 "
              >
                <Image src={rating} width={104} height={18} alt="rating" />
                <p className="mt-3">{product.rating}</p>
              </div>
              <div
                style={{ marginTop: "-15px" }}
                className="flex items-center justify-between"
              >
                <p style={{ fontSize: "24px", fontWeight: "600" }}>
                  ${product.price.toLocaleString()}
                </p>
                <button onClick={() => addToCart(product)}>
                  <MdAddShoppingCart className="me-2" size={24} />
                </button>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-lg col-span-full">
            Mahsulotlar topilmadi...
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
