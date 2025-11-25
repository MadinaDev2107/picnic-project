import Image from "next/image";
import { FaFacebookF, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="flex items-center footer footer2 justify-evenly min-h-[486px] bg-[#245D30] text-white  w-100 mx-auto ">
      <div className="max-w-[148px]  h-[185px]  ms-4">
        <Image width={100} height={100} src="./logo.svg" alt="logo"></Image>
        <div className="flex items-center mt-5 gap-3">
          <div className="bg-white text-black rounded-full w-7  h-7 p-2  flex items-center justify-center cursor-pointer hover:bg-gray-300 ">
            <FaTwitter className="w-[11px]" />
          </div>
          <div className="bg-white text-black rounded-full w-7  h-7 p-2  flex items-center justify-center cursor-pointer hover:bg-gray-300 ">
            <FaFacebookF className="w-[11px]" />
          </div>
          <div className="bg-white text-black rounded-full w-7  h-7 p-2  flex items-center justify-center cursor-pointer hover:bg-gray-300 ">
            <FaInstagram className="w-[11px]" />
          </div>
          <div className="bg-white text-black rounded-full w-7  h-7 p-2  flex items-center justify-center cursor-pointer hover:bg-gray-300 ">
            <FaGithub className="w-[11px]" />
          </div>
        </div>
      </div>
      <div>
        <p className="ms-7.5 mb-2 footerTitle">KOMPANIYA</p>
        <ul className="text-start footerText  text-[#FFFFFF99]">
          <li>Biz haqimizda </li>
          <li>Xususiyatlar </li>
          <li>Ishlash jarayoni </li>
          <li>Karyera imkoniyatlari </li>
        </ul>
      </div>
      <div>
        <p className="ms-7.5 mb-2 footerTitle">YORDAM</p>
        <ul className="text-start footerText  text-[#FFFFFF99]">
          <li>Mijozlarni qo`llab-quvvatlash</li>
          <li>Yetkazib berish tafsilotlari </li>
          <li>Shartlar va qoidalar </li>
          <li>Maxfiylik siyosati </li>
        </ul>
      </div>
      <div>
        <p className="ms-7.5 mb-2 footerTitle ">SAVOLLAR</p>
        <ul className="text-start footerText text-[#FFFFFF99]">
          <li>Hisob</li>
          <li>Yetkazib berishni boshqarish</li>
          <li>Buyurtmalar </li>
          <li>To`lovlar </li>
        </ul>
      </div>
      <div>
        <p className="ms-7.5 mb-2 footerTitle">RESURSLAR</p>
        <ul className="text-start footerText text-[#FFFFFF99]">
          <li>Bepul e-kitoblar</li>
          <li>Dasturlash bo`yicha qo`llanmalar</li>
          <li>Qanday foydalanish - Blog</li>
          <li>YouTube pleylist</li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
