// In apps/web/src/app/dashboard/page.tsx

"use client"; // We use a hook, so it's a Client Component.

import { useAuthStore } from "@/stores/useAuthStore";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-4 text-lg">Welcome to your dashboard, {user?.email}!</p>
      <p className="mt-2 text-gray-600">
        Your role is: <strong>{user?.role}</strong>
      </p>

      {/* From here, you can start building the specific UI for patients or providers */}
    </div>
  );
}
