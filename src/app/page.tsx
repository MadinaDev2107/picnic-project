"use client";
import Image from "next/image";
import bg from "../../public/boshsahifa.png";
import rating from "../../public/Frame 10.svg";
import vektor from "../../public/Vector.svg";
import rasm from "../../public/Frame 57.png";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { MdAddShoppingCart } from "react-icons/md";
import { Category, Product } from "@/types";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { db } from "./firebase/firebase.config";

const BoshSahifa = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openAnswer, setopenAnswer] = useState<number | null>(null);

  const quesAns = [
    {
      question: "Mahsulotlarni qanday buyurtma qilsa bo‘ladi?",
      answer:
        "Siz tanlagan mahsulotni savatchaga qo‘shib, to‘lov jarayonini davom ettirish orqali buyurtma qilishingiz mumkin. Buyurtma jarayoni oddiy va qulay.",
    },
    {
      question: "To‘lov usullari qanday?",
      answer:
        "1. Naqd pul bilan yetkazib berishda to‘lash 2. Bank kartasi yoki onlayn terminal orqali to‘lash 3. Mobil ilova yoki sayt orqali elektron to‘lov.",
    },
    {
      question: "Yetkazib berish qancha vaqt oladi?",
      answer:
        "Picnic.uz da yetkazib berish odatda 3–4 ish kuni ichida amalga oshiriladi. Buyurtma holatini hisobingiz orqali kuzatishingiz mumkin.",
    },
    {
      question: "Mahsulotlar kafolatlanganmi?",
      answer:
        "Picnic mahsulotlari kafolatlangan. Siz xarid qilgan mahsulotda berilgan muddat ichida ishlab chiqarish yoki yetkazib berish nuqsonlari bo‘lsa, kafolat doirasida ta’mirlash yoki almashtirish imkoniyati mavjud.",
    },
    {
      question: "Mahsulotlarni qaytarish mumkinmi?",
      answer:
        "Xarid qilgan mahsulotingizni berilgan muddat ichida qaytarishingiz mumkin. Mahsulotda ishlab chiqarish yoki yetkazib berish nuqsoni bo‘lsa, kafolat doirasida ta’mirlash yoki almashtirish imkoniyati mavjud. Shartlar va muddatlarni Picnic.uz saytida batafsil tekshirish tavsiya qilinadi.",
    },
  ];
  const mijozlar = [
    {
      name: "Sarah M.",
      description:
        "Shop.co orqali olgan jihozlarim sifati va uslubi meni hayratda qoldirdi. Kundalik foydalanishdan tortib, maxsus tadbirlar uchun hamma narsa yuqori darajada!",
    },
    {
      name: "Alex K.",
      description:
        "Shaxsiy uslubimga mos keladigan jihozlarni topish qiyin edi, lekin Shop.co bilan tanishganimdan so‘ng, barcha kerakli narsalarni bir joydan topa oldim. Ularning tanlovi ajoyib!",
    },
    {
      name: "James L.",
      description:
        "Yangi va o‘ziga xos jihozlar qidirib yurganimda Shop.co saytini topdim. Ularning assortimentlari xilma-xil va dolzarb.",
    },
    {
      name: "Emily W.",
      description:
        "I was impressed by the variety and quality of products on Picnic.uz. Everything I ordered arrived quickly and looked just like in the photos!",
    },
    {
      name: "Daniel K.",
      description:
        "Picnic.uz made my outdoor adventures even better. The equipment is reliable and stylish — totally worth it!",
    },
    {
      name: "Sophie L.",
      description:
        "Fast delivery, great customer service, and amazing products. I’ll definitely shop here again!",
    },
  ];

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
  // savol javob
  const toggleAnswer = (index: number) => {
    setopenAnswer(openAnswer === index ? null : index);
  };
  //savatga qo'shish
  const addToCart = async (product: Product) => {
    try {
      await addDoc(collection(db, "cart"), {
        title: product.title,
        price: product.price,
        images: product.images[0],
        quantity: 1,
        createdAt: new Date(),
      });
      toast.success("Mahsulot savatga qo‘shildi ✅");
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };
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

  return (
    <div className="mt-5">
      <div className="flex hero justify-center mx-auto max-w-[1220px] gap-[30px] py-10 px-4 mt-5">
        <div className="max-w-[586px] ">
          <h1 className="titleBosh">
            Zo`r jihozlar bilan sarguzashtlarni kashf eting
          </h1>
          <p className="text-[#00000099] mt-3  text">
            Sarguzasht ishqibozlari uchun moʻljallangan ochiq havoda kerakli
            jihozlarimizni kashf eting. Yuqori sifatli chodirlardan qulay lager
            anjomlarigacha, hammasi sizning tajribangizni yuksaltirish uchun.
          </p>
          <button className=" bg-[#245D30] text-white rounded-full! boshButto  text-[16px]">
            Xarid qiling
          </button>
          <Image
            className="mt-5 img mx-auto w-full lg:mx-0"
            src={rasm}
            alt="rasm"
            width={596}
            height={69}
          />
        </div>
        <div>
          <Image src={bg} alt="rasm" width={714} height={563} />
        </div>
      </div>
      {/* --- Categories --- */}
      <div className="text-center mt-20">
        <h1 className="font-bold text-black mb-10 titleBosh">
          Kategoriya va Mahsulotlar
        </h1>
        <div className="flex gap-4 max-w-[1190px] overflow-x-auto hide-scrollbar  py-2 px-3 mx-auto mt-[70px]">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`flex items-center gap-2 btn transition rounded-full! w-[180px] h-[50px] shrink-0  ${
                activeCategory === category.id
                  ? "bg-gray-400 border"
                  : "btn-light "
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "400",
                }}
              >
                {category.name.slice(0, 9)}...
              </p>
            </button>
          ))}
        </div>

        {/* --- Products --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-[1220px] mx-auto px-4 mt-10">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border rounded-2xl hover:shadow-lg transition-shadow duration-300 p-2 border-gray-100"
              >
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="rounded-xl w-full h-[200px] object-cover"
                  />
                )}
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    marginTop: "15px",
                  }}
                  className="font-bold text-start"
                >
                  {product.title.slice(0, 12)}
                </h2>
                <div
                  style={{ marginTop: "-15px" }}
                  className="flex items-center gap-2 "
                >
                  <Image src={rating} width={104} height={18} alt="rating" />
                  <p className="mt-3">{product.rating}</p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2.5!">
                    <p style={{ fontSize: "24px", fontWeight: "600" }}>
                      ${product.price.toLocaleString()}
                    </p>
                    <p
                      style={{ fontSize: "24px", fontWeight: "600" }}
                      className=" text-secondary line-through"
                    >
                      ${Number(product.price) + 50}
                    </p>
                    <div
                      style={{ fontSize: "12px", fontWeight: "600" }}
                      className=" text-[#FF3333] bg-[#FF33331A] rounded-full  w-[55px] h-7 text-center mb-2"
                    >
                      <p className="mt-1">{product.discount}%</p>
                    </div>
                  </div>
                  <button onClick={() => addToCart(product)}>
                    <MdAddShoppingCart className="me-2 mb-3" size={24} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg col-span-full">
              Mahsulotlar topilmadi...
            </p>
          )}
        </div>
        <button className="rounded-full! w-[250px] h-[54px] bg-[#F0F0F0] mt-4">
          <Link
            href={`/mahsulotlar`}
            className="text-secondary text-decoration-none"
          >
            Hammasini ko`rish
          </Link>
        </button>
      </div>
      {/* --- Tez-tez beriladigan savollar --- */}
      <div className="mt-[100px]">
        <h1 className="font-bold text-black  text-center titleBosh">
          Tez-tez beriladigan savollar
        </h1>
        {quesAns.map((item, index) => (
          <div
            key={index}
            onClick={() => toggleAnswer(index)}
            className="mb-6  max-w-[780px] mx-auto bg-[#F5F5F5] p-3 rounded-lg cursor-pointer transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <p className="text-[16px] text-[#151515] mb-0">{item.question}</p>
              <div className="text-lg">
                {openAnswer === index ? <RxCross2 /> : <GoPlus />}
              </div>
            </div>
            {openAnswer === index && (
              <div>
                <hr />
                <p className="text-[#747474] text-[15px] leading-relaxed ">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* --- Mijozlar --- */}
      <div className="mt-[140px]">
        <div className="flex  justify-content-evenly mx-auto">
          <h1 className="font-bold text-black mb-10 text-center titleBosh">
            Bizning mamnun mijozlarimiz
          </h1>
          <div className="flex items-center gap-1 mt-3 cursor-pointer arrow">
            <FaArrowLeft />
            <FaArrowRight />
          </div>
        </div>

        <div className="overflow-x-auto flex gap-3 px-3 py-4 hide-scrollbar">
          {mijozlar.map((m, index) => (
            <div
              key={index}
              style={{ borderRadius: "25px" }}
              className="p-4 card min-w-[350px] max-w-[400px] h-[220px] bg-white shadow-md shrink-0"
            >
              <Image src={rating} width={138} height={22} alt="rating" />
              <div className="flex items-center gap-2">
                <h6 className="mt-2 font-semibold text-lg">{m.name}</h6>
                <Image src={vektor} width={19} height={19} alt="galichka" />
              </div>
              <p className="text-gray-600 text-sm mt-1 line-clamp-4">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoshSahifa;
