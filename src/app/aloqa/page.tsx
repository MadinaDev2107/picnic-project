"use client";

import { useState } from "react";
import Image from "next/image";
import aloqabg from "../../../public/aloqabg.png";
import aloqaIcons from "../../../public/aloqaIcons.png";
import { db } from "../firebase/firebase.config";
import { collection, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";

type Aloqa = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

const Page = () => {
  const [formData, setFormData] = useState<Aloqa>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });


  //xabar yuborish
  const saveMessage = async () => {
    const { firstName, lastName, email, phone, message } = formData;
    if (!firstName || !lastName || !email || !phone || !message) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    try {
      await addDoc(collection(db, "aloqa"), {
        ...formData,
        createdAt: new Date(),
      });
      toast.success("Xabar muvaffaqiyatli yuborildi!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      toast.error("Xatolik yuz berdi, qayta urinib ko'ring.");
    }
  };

  return (
    <div>
      <div className="relative w-full h-[460px]">
        <Image
          src={aloqabg}
          alt="aloqa background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <h1 className="absolute left-5 top-1/2 text-white text-[50px] font-bold">
          Biz bilan bog’laning
        </h1>
      </div>
      <div className="cartButto divPro2  flex justify-between  max-w-[1100px] min-h-[570px]  mx-auto mt-[90px] text-[#011334]">
        <div className="max-w-[570px] max-h-[388px] divPro4">
          <h1 className="textAloqa titleAloqa">
            Keling, biz bilan gaplashaylik
          </h1>
          <p className="max-w-[340px] min-h-[50px]  textAloqa">
            Savollar, sharhlar yoki takliflar? Shaklni to`ldiring va biz tez
            orada bog`lanamiz.
          </p>
          <div>
            <Image
              src={aloqaIcons}
              width={365}
              height={136}
              alt="aloqalar turi"
              priority={false}
            />
          </div>
        </div>
        <div>
          <div
            style={{ borderRadius: "30px" }}
            className="max-w-[480px] border min-h-[425px] p-4"
          >
            <div className="flex flex-col gap-3 mt-3">
              <div className="flex cartButto2 items-center justify-between gap-3 ">
                <input
                  type="text"
                  name="firstName"
                  className="form-control p-2 rounded-lg"
                  placeholder="First Name*..."
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  className="form-control p-2 rounded-lg"
                  placeholder="Last Name*..."
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                className="form-control p-2 rounded-lg"
                placeholder="Email*..."
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <input
                type="number"
                name="phone"
                className="form-control p-2 rounded-lg"
                placeholder="Phone Number*"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
              <textarea
                name="message"
                className="form-control p-2 rounded-lg"
                placeholder="Your message..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              ></textarea>
              <button
                onClick={saveMessage}
                className="bg-[#245D30] max-w-[460px] h-[45px] text-white rounded-full! mt-3"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
