// In apps/web/src/app/dashboard/layout.tsx

"use client"; // This must be a Client Component to use hooks.

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import Providers from "../providers";

// Navigation items based on user role
const getNavigationItems = (role: "PATIENT" | "PROVIDER" | "ADMIN") => {
  const commonItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Appointments', href: '/dashboard/appointments', icon: 'calendar' },
  ];

  if (role === 'PATIENT') {
    return [
      ...commonItems,
      { name: 'Find Providers', href: '/dashboard/schedule', icon: 'search' },
      { name: 'Health Records', href: '/dashboard/ehr', icon: 'document' },
      { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: 'pill' },
    ];
  } else if (role === 'PROVIDER') {
    return [
      ...commonItems,
      { name: 'Availability', href: '/dashboard/availability', icon: 'clock' },
      { name: 'Patient Records', href: '/dashboard/ehr', icon: 'document' },
      { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: 'pill' },
    ];
  }
  
  return commonItems;
};

const Icon = ({ name, className }: { name: string; className?: string }) => {
  const iconMap = {
    dashboard: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0" />
      </svg>
    ),
    calendar: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    search: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    document: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    pill: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    clock: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };
  
  return iconMap[name as keyof typeof iconMap] || null;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, user, logout } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  if (!isHydrated || !accessToken || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const navigationItems = getNavigationItems(user.role);

  // If authenticated, render the main layout and the page content.
  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20">
        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 flex z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto bg-gradient-to-b from-white to-teal-50">
                <div className="flex-shrink-0 flex items-center px-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">HealthTech</h1>
                </div>
                <nav className="mt-5 px-2 space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                        pathname === item.href
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon
                        name={item.icon}
                        className={`mr-4 h-6 w-6 transition-colors duration-200 ${
                          pathname === item.href ? 'text-white' : 'text-gray-400 group-hover:text-teal-600'
                        }`}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 border-r border-teal-100 bg-gradient-to-b from-white to-teal-50/30">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">HealthTech</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
                    }`}
                  >
                    <Icon
                      name={item.icon}
                      className={`mr-3 h-6 w-6 transition-colors duration-200 ${
                        pathname === item.href ? 'text-white' : 'text-gray-400 group-hover:text-teal-600'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gradient-to-r from-teal-50 to-cyan-50">
            <button
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-teal-600 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 transition-all duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <main className="flex-1 bg-gradient-to-br from-gray-50 to-teal-50/30">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Top header */}
                <div className="mb-8 flex justify-between items-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-teal-100 shadow-lg">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Welcome back, {user.email.split('@')[0]}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                        user.role === 'PATIENT' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {user.role === 'PATIENT' ? '👤' : '⚕️'} {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
                
                {/* Page content */}
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Providers>
  );
}
