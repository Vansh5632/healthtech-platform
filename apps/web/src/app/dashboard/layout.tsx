// In apps/web/src/app/dashboard/layout.tsx

"use client"; // This must be a Client Component to use hooks.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import Providers from "../providers";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { accessToken, user, logout } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // This effect ensures we only check for the token on the client-side after hydration.
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      // If hydration is complete and there's no token, redirect to login.
      router.push("/login");
    }
  }, [isHydrated, accessToken, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // While hydrating, we can show a loader or nothing to prevent flicker.
  if (!isHydrated || !accessToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // If authenticated, render the main layout and the page content.
  return (
    <Providers>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-indigo-600">
                    HealthTech
                  </h1>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-4">
                  Welcome, {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </Providers>
  );
}
