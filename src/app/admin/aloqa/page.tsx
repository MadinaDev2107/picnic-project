"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/app/firebase/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { Aloqa } from "@/types";
import Rodal from "rodal";

export default function AloqaTable() {
  const [messages, setMessages] = useState<Aloqa[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Aloqa | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const q = collection(db, "aloqa");
      const snap = await getDocs(q);
      const data: Aloqa[] = snap.docs.map((doc) => ({
        ...(doc.data() as Aloqa),
        createdAt: doc.data().createdAt,
      }));
      setMessages(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Aloqa Xabarlar</h1>

      <div className="overflow-x-auto">
        <table className="table  w-full">
          <thead className="table-dark">
            <tr>
              <th>Ism</th>
              <th>Familiya</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Xabar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Yuklanmoqda...
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Xabarlar topilmadi
                </td>
              </tr>
            ) : (
              messages.map((m, i) => (
                <tr key={i}>
                  <td>{m.firstName}</td>
                  <td>{m.lastName}</td>
                  <td>{m.email}</td>
                  <td>{m.phone}</td>
                  <td>
                    <button
                      onClick={() => setSelectedMessage(m)}
                      className="btn btn-success btn-sm"
                    >
                      Ko‘rish
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedMessage && (
        <Rodal
          visible={true}
          onClose={() => setSelectedMessage(null)}
          customStyles={{ height: "max-content" }}
        >
          <h5 className="mt-3 font-bold">Mijoz xabari</h5>
          <p className="border p-3 rounded-[10px] mt-3">
            {selectedMessage.message}
          </p>
        </Rodal>
      )}
    </div>
  );
}
