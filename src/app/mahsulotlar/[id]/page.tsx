"use client";

import { useEffect, useState } from "react";
import { getDoc, addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { useParams } from "next/navigation";
import { Product } from "@/types";
import rating from "../../../../public/Frame 10.svg";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docRef = doc(db, "products", id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { ...(docSnap.data() as Product), id: docSnap.id };
        setProduct(data);
        setCurrentImage(data.images[0]);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!product) return;

    try {
      await addDoc(collection(db, "cart"), {
        productId: product.id,
        title: product.title,
        price: product.price,
        images: product.images[0],
        quantity: quantity,
        createdAt: new Date(),
      });

      toast.success(`"${product.title}" savatga qo‘shildi`);
    } catch (error) {
      console.error("Xatolik:", error);
      toast.error("Savatga qo‘shishda xatolik yuz berdi");
    }
  };

  if (!product) {
    return <p className="text-center mt-10 text-gray-600">⏳ Yuklanmoqda...</p>;
  }

  return (
    <div className="max-w-[1200px] mx-auto py-10">
      <Link href={`/mahsulotlar`}>
        <FaArrowLeft
          size={24}
          className="mb-4 cursor-pointer text-decoration-none text-black"
        />
      </Link>

      <div className="flex gap-3 cartButto2">
        <div className="flex gap-4 m-2">
          <div className="flex flex-col gap-3 shrink-0">
            {product.images.slice(1, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentImage(img)}
                className="max-w-[120px] imagePro h-[120px] object-cover border  rounded-xl cursor-pointer"
              >
                <Image
                  src={img}
                  alt={product.title}
                  width={430}
                  height={500}
                  className=" max-w-[110px] imagePro h-[110px] p-1   rounded-xl  object-cover"
                />
              </div>
            ))}
          </div>

          <div className="relative max-w-[440px] rounded-xl mb-5 ">
            <Image
              src={currentImage || product.images[0]}
              alt={product.title}
              width={430}
              height={500}
              className="object-cover imagePro2 border rounded-xl"
              priority
            />
          </div>
        </div>

        <div className="max-w-[712px] min-h-[530px] divPro">
          <h1 className="textPro text-[36px] ">{product.title}</h1>

          <div className="flex items-center gap-2 mt-2">
            <Image src={rating} width={193} height={24} alt="rating" />
            <p className="mt-3">{product.rating}</p>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <p className="font-bold text-black text-[32px]">${product.price}</p>
            <p className="font-bold text-secondary text-[32px] line-through">
              ${Number(product.price) + 50}
            </p>
            <p className="px-1 text-[#FF3333] bg-[#FF33331A] rounded-full w-[72px] h-[34px] text-center">
              {product.discount}%
            </p>
          </div>

          <p className="text-lg mt-3 mb-4">
            <b>Mahsulot haqida malumot: </b> {product.description}
          </p>

          <div className="flex items-center gap-2 mt-2 cartButto ">
            <div className="cartQuan rounded-full w-[193px] h-[45px] flex items-center border justify-evenly bg-[#F0F0F0] ">
              <button
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                className="fs-1 mb-2 text-secondary"
              >
                -
              </button>
              <p className="mt-3">{quantity}</p>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="fs-2 mb-2 text-secondary"
              >
                +
              </button>
            </div>
            <button
              onClick={addToCart}
              className="rounded-full! btn btn-success w-full py-2"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
