"use client";

import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { app } from "../firebase/firebase.config";

const AuthPage = () => {
  const auth = getAuth(app);
  const router = useRouter();

  const ADMIN_EMAIL = "admin@gmail.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsub;
  }, [auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Ro'yxatdan o'tdingiz!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Tizimga kirdingiz!");
      }
      clearForm();
    } catch (error) {
      console.log(error);
    }
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    if (user) {
      if (user.email === ADMIN_EMAIL) {
        router.push("/admin/products");
      } else {
        router.push("/");
      }
    }
  }, [user, router]);

  return (
    <div className="bg-[#245D30] min-h-screen flex items-center justify-center px-3">
      <style>
        {`
          .auth-card {
            width: 100%;
            max-width: 400px;
            border-radius: 12px;
          }

          @media (max-width: 768px) {
            .auth-card {
              padding: 20px !important;
            }
            input.form-control {
              font-size: 16px;
              padding: 12px;
            }
            button.btn {
              font-size: 16px;
              padding: 12px;
            }
          }
        `}
      </style>
      <div className="auth w-full flex justify-center">
        <form
          className="card p-4 bg-white text-[#245D30] shadow-lg auth-card"
          onSubmit={handleSubmit}
        >
          <h4 className="text-center mb-3">
            {isRegister ? "Ro'yxatdan o'tish" : "Kirish"}
          </h4>

          <label htmlFor="email">
            Email:
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email..."
              className="form-control mb-3 mt-1"
              required
            />
          </label>

          <label htmlFor="password">
            Parol:
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..."
              className="form-control mb-2 mt-1"
              required
            />
          </label>

          <button
            className="btn bg-[#245D30]! text-white w-100 mt-4"
            type="submit"
          >
            {isRegister ? "Ro'yxatdan o'tish" : "Kirish"}
          </button>

          <p className="text-[#245D30]! mb-0 text-center mt-3">
            Akkauntingiz bormi?
          </p>

          <button
            type="button"
            className="btn bg-[#245D30]! text-white w-100 mt-2"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Kirish" : "Ro'yxatdan o'tish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
