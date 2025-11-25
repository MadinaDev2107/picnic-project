"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase.config";
import { OrderItem } from "@/types";
import toast from "react-hot-toast";
import Rodal from "rodal";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const data: OrderItem[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as OrderItem)
      );
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const markAsDelivered = async (orderId: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { delivered: true });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, delivered: true } : order
        )
      );
      toast.success("Mahsulot yetkazildi");
    } catch (error) {
      console.log("Delivered belgilanmadi:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Buyurtmalar</h1>

      <table className="w-full table  border-gray-300">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Ism</th>
            <th>Telefon</th>
            <th>Manzil</th>
            <th>Mahsulotlar</th>
            <th>Jami</th>
            <th>Delivered</th>
            <th>Harakat</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>{order.name}</td>
              <td>{order.phone}</td>
              <td>{order.address}</td>
              <td>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="btn bg-green-500! text-white btn-sm"
                >
                  Products
                </button>
              </td>
              <td>${order.totalPrice}</td>
              <td>
                <input
                  type="checkbox"
                  checked={order.delivered || false}
                  className="form-check-input"
                  readOnly
                />
              </td>
              <td>
                {!order.delivered && (
                  <button
                    onClick={() => markAsDelivered(order.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Delivered
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <Rodal
          visible={true}
          onClose={() => setSelectedOrder(null)}
          customStyles={{ height: "max-content" }}
        >
          <h5 className="mt-3 font-bold">Buyurtma mahsulotlari</h5>
          {selectedOrder.items.map((item, i) => (
            <div key={i} className="border-bottom py-2">
              {item.title} x {item.quantity} (${item.price})
            </div>
          ))}
        </Rodal>
      )}
    </div>
  );
}
