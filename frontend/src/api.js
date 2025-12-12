import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v2";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: { Authorization: token ? `Bearer ${token}` : "" },
});

// Expense APIS
export const fetchExpenses = async () => {
  const res = await api.get("/expense");
  return (res.data && res.data.data) || [];
};

export const createExpense = async (payload) => {
  const res = await api.post("/expense", payload);
  return (res.data && res.data.data) || null;
};

export const updateExpense = async (id, payload) => {
  const res = await api.put(`/expense/${id}`, payload);
  return (res.data && res.data.data) || null;
};

export const deleteExpense = async (id) => {
  const res = await api.delete(`/expense/${id}`);
  return res.data || null;
};

// Auth APIs
export const forgotPassword = async (email) => {
  const res = await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await axios.post(`${BASE_URL}/auth/reset-password/${token}`, {
    password,
  });
  return res.data;
};
