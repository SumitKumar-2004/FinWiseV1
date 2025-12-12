import React, { useEffect, useState } from "react";
import { IndianRupee, IndianRupeeIcon, X } from "lucide-react";
import { toast } from "react-toastify";

const categories = [
  "Food",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Healthcare",
  "Other",
];
function Model({ isOpen, onClose, onSubmit, initialData }) {
  const empty = {
    description: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  };

  const [formData, setFormData] = useState(initialData || empty);
  useEffect(() => {
    setFormData(initialData || empty);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.description.trim()) {
      toast.error("Please enter a description", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      parseFloat(formData.amount) <= 0
    ) {
      toast.error("Please enter a valid amount greater than 0", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    onSubmit({ ...formData, amount: parseFloat(formData.amount) });
    setFormData(empty);
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="bg-white  rounded-3xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? "Edit Expense" : "Add Expense"}
            </h2>
            <p className="text-sm textgray500 mt-1 ">Track your spending</p>
          </div>
          <button
            type="submit"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="block text-sm font-bold text-gray-700 mb-2">
            <label>What did you buy?</label>
            <input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              type="text"
              placeholder="Enter description"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 "
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-4 w-4.5 h-4.5 text-gray-400" />
                <input
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <input
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  type="date"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* i will use map */}
              {categories.map((cat) => {
                return (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`p-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      formData.category === cat
                        ? "bg-indigo-600 text-white scale-105 shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Note(Optional)
            </label>
            <div className="relative">
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={2}
                placeholder="Add notes..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-bold cursor-pointer"
              >
                {initialData ? "Save Changes" : "Add Expense"}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-xl font-semibold border cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Model;
