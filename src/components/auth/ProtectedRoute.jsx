import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROUTES } from '../../constants/navigation.js';

/**
 * Оборачивает защищённые маршруты: пускает только пользователей с ролью admin.
 * При загрузке — показывает спиннер. При отказе — редирект на главную.
 */
export default function ProtectedRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#2D332F] text-[#F5F4F0]">
        <Loader2 className="h-12 w-12 animate-spin text-[#8F9779]" aria-hidden />
        <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#F5F4F0]/70">Загрузка</p>
        <span className="sr-only">Проверка доступа</span>
      </div>
    );
  }

  if (!user || role !== 'admin') {
    return <Navigate to={ROUTES.home} replace />;
  }

  return children;
}
