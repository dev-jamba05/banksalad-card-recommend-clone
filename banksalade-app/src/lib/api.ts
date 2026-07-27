import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { transactions, recommendedCards } from '@/data/mock';
import type { Transaction, RecommendedCard } from '@/types';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('bs_user');
    if (user && config.headers) {
      config.headers.Authorization = `Bearer mock_token`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('bs_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export async function fetchTransactions(): Promise<Transaction[]> {
  await new Promise((r) => setTimeout(r, 400));
  return transactions;
}

export async function fetchRecommendedCards(): Promise<RecommendedCard[]> {
  await new Promise((r) => setTimeout(r, 300));
  return recommendedCards;
}

export async function submitApplication(
  cardId: string,
  formData: Record<string, string>
): Promise<{ applicationId: string; message: string }> {
  await new Promise((r) => setTimeout(r, 1500));
  console.log('Application submitted:', { cardId, formData });
  return { applicationId: `APP-${Date.now()}`, message: '신청이 완료되었습니다.' };
}

export default api;
