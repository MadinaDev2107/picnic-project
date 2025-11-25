"use client";

import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../firebase/firebase.config";
import { Blog } from "@/types";
import Image from "next/image";
import play from "../../../public/play-circle-02.png";

const Page = () => {
  const [blogs, setblogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  console.log(loading);

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const q = collection(db, "blog");
      const snap = await getDocs(q);
      const data: Blog[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Blog, "id">),
      }));
      setblogs(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  return (
    <div>
      <div className="max-w-[892px] min-h-[152px]  mx-auto text-center mt-[90px]">
        <h1 className="titleAloqa">Sayohat va Lager Blogi</h1>
        <p className="max-w-[648px]  text-center mx-auto textAloqa textBlog  divPro2 text-[#626262]">
          Sayohatni sevuvchilar uchun qiziqarli hikoyalar, foydali maslahatlar
          va lager hayoti haqida ko`rsatmalar. Tabiatga yaqin bo`lish va
          sayohatlaringizni unutilmas qilish uchun o`z bilimlaringizni boyiting!
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 max-w-[1220px]  mx-auto px-4 mt-[90px] mb-[90px]">
        {blogs.length > 0 ? (
          blogs.map((b, index) => (
            <div
              key={index}
              className="bg-white  rounded-2xl hover:shadow-lg transition-shadow duration-300 p-2 border-gray-100"
            >
              {b.image && (
                <div className="position-relative">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="rounded-xl w-[380px] h-[253px] object-cover"
                  />
                  <Image
                    src={play}
                    alt="Play video"
                    width={80}
                    height={80}
                    className="absolute top-[35%] left-[40%]"
                  />
                </div>
              )}
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginTop: "12px",
                }}
                className="font-bold text-start line-clamp-3"
              >
                {b.title}
              </h2>
              <div className="border w-[201px] rounded-full">
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    marginTop: "12px",
                  }}
                  className=" text-black m-0 p-1  text-center"
                >
                  Payshanba, 2024-yil 8-yanvar
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-lg col-span-full">
            Mahsulotlar yuklanmoqda...
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
