import React, { useEffect, useState } from "react";
import {
  IndianRupee,
  Plus,
  ShoppingCart,
  TrendingUp,
  Wallet,
  DollarSign,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StatCard from "../components/StatCard";
import SpendingChart from "../components/SpendingChart";
import CategoryChart from "../components/CategoryChart";
import TransactionList from "../components/TransactionList";
import Model from "../components/Model";

import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../api.js";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [userName, setUserName] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Load user name from localStorage
  useEffect(() => {
    const name = localStorage.getItem("name") || "User";
    setUserName(name);
  }, []);

  // Show welcome toast if redirected from login
  useEffect(() => {
    const showToast = localStorage.getItem("showWelcomeToast");
    if (showToast === "true") {
      toast.success(`Welcome back, ${userName}!`, {
        position: "top-right",
        autoClose: 4000,
      });
      localStorage.removeItem("showWelcomeToast");
    }
  }, [userName]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location.href = "/login";
  };

  // Stats Calculation
  const calculationStats = (expenseList) => {
    const list = expenseList || [];
    const total = list.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const categoryTotals = list.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0);
      return acc;
    }, {});

    return {
      total,
      count: list.length,
      avg: list.length > 0 ? total / list.length : 0,
      highest:
        list.length > 0
          ? Math.max(...(list.map((e) => Number(e.amount)) || 0))
          : 0,
      categoryTotals,
    };
  };

  const stats = calculationStats(expenses);

  // Load initial expenses
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [expData] = await Promise.all([fetchExpenses()]);
        const normalized = (expData || []).map((e) => ({
          ...e,
          date: e?.date
            ? String(e.date).split("T")[0]
            : new Date().toISOString().split("T")[0],
        }));
        setExpenses(normalized);
      } catch (error) {
        console.error("load error:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Add Expense
  const handleAddExpense = async (payload) => {
    try {
      const created = await createExpense(payload);
      if (!created) throw new Error("No created expense returned");

      setExpenses((prev) => [
        { ...created, date: created.date.split("T")[0] },
        ...prev,
      ]);
      setIsModelOpen(false);
      toast.success("Expense added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Create error: ", error);
      toast.error("Failed to add expense. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Edit Expense
  const onEdit = (expense) => {
    setEditingExpense(expense);
    setIsModelOpen(true);
  };

  const handleSaveEdit = async (payload) => {
    if (!editingExpense) return;

    try {
      const updated = await updateExpense(editingExpense._id, payload);

      setExpenses((prev) =>
        prev.map((e) =>
          e._id === updated._id
            ? { ...updated, date: updated.date.split("T")[0] }
            : e
        )
      );

      setEditingExpense(null);
      setIsModelOpen(false);
      toast.success("Expense updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Edit error: ", error);
      toast.error("Failed to update expense. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Delete Expense
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Expense")) return;

    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
      toast.success("Expense deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Delete error: ", error);
      toast.error("Failed to delete expense. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-xl lg:text-4xl font-bold text-gray-700 mb-1">
                  FinWise
                </h1>
                <p className="text-gray-700 text-sm sm:text-base">
                  Smart Finance Management
                </p>
              </div>
            </div>

            {/* Right side: Add Expense + User info */}
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all flex items-center gap-2 cursor-pointer text-sm sm:text-base"
                onClick={() => {
                  setEditingExpense(null);
                  setIsModelOpen(true);
                }}
              >
                <Plus className="w-4 h-4" /> Add Expense
              </button>

              {/* User info and logout */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all flex items-center cursor-pointer text-sm sm:text-base"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Welcome message */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome back, {userName}
          </h2>
          <p className="text-gray-600">Here's an overview of your expenses.</p>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            value={`₹${stats.total.toFixed(2)}`}
            title="Total Spent"
            icon={Wallet}
            subtitle="This Month"
            bgColor="bg-gradient-to-br from-emerald-500 to-teal-600"
            iconColor="bg-emerald-600"
          />
          <StatCard
            value={`${stats.count}`}
            title="Expenses"
            icon={ShoppingCart}
            subtitle={`${stats.count} transactions`}
            bgColor="bg-gradient-to-br from-blue-500 to-cyan-600"
            iconColor="bg-blue-600"
          />
          <StatCard
            value={`₹${stats.avg.toFixed(2)}`}
            title="Average"
            icon={TrendingUp}
            subtitle="Per Expense"
            bgColor="bg-gradient-to-br from-amber-500 to-orange-600"
            iconColor="bg-amber-600"
          />
          <StatCard
            value={`₹${stats.highest.toFixed(2)}`}
            title="Highest"
            icon={IndianRupee}
            subtitle="Single Expense"
            bgColor="bg-gradient-to-br from-rose-500 to-pink-600"
            iconColor="bg-rose-600"
          />
        </div>

        {/* charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-3">
            <SpendingChart expenses={expenses} />
          </div>
          <div className="lg:col-span-2">
            <CategoryChart categoryTotal={stats.categoryTotals} />
          </div>
        </div>

        {/* Transaction List */}
        <TransactionList
          expenses={expenses}
          onDelete={handleDelete}
          onEdit={onEdit}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
        />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-lg">
                Made with ❤️ by{" "}
                <span className="font-semibold text-gray-800">Sumit Kumar</span>
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-lg">
                © {new Date().getFullYear()} FinWise. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <Model
        isOpen={isModelOpen}
        onClose={() => {
          setIsModelOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={editingExpense ? handleSaveEdit : handleAddExpense}
        initialData={editingExpense}
      />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default Dashboard;
