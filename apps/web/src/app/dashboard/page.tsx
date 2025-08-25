// In apps/web/src/app/dashboard/page.tsx

"use client"; // We use a hook, so it's a Client Component.

import { useAuthStore } from "@/stores/useAuthStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  totalRecords?: number;
}

interface UpcomingAppointment {
  id: string;
  date: string;
  time: string;
  type: string;
  with?: string; // For patients - provider name
  patient?: string; // For providers - patient name
}

interface ApiAppointment {
  id: string;
  dateTime: string;
  type?: string;
  provider?: { email: string };
  patient?: { email: string };
}

const StatCard = ({ title, value, subtitle, icon, color, index }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  index?: number;
}) => (
  <div 
    className="bg-white/60 backdrop-blur-xl overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/30 hover:bg-white/70"
    style={{ 
      animationDelay: `${(index || 0) * 150}ms`,
      animation: 'slideUp 0.6s ease-out forwards'
    }}
  >
    <div className="p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`inline-flex items-center justify-center p-4 rounded-xl ${color} shadow-lg`}>
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-700 truncate">{title}</dt>
            <dd className="text-2xl font-bold text-gray-800 animate-fade-in">{value}</dd>
            <dd className="text-sm text-gray-600">{subtitle}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const QuickActionCard = ({ title, description, href, icon, color, index }: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  index?: number;
}) => (
  <Link href={href} className="block">
    <div 
      className="bg-white/60 backdrop-blur-xl overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/30 hover:bg-white/70"
      style={{ 
        animationDelay: `${(index || 0) * 100}ms`,
        animation: 'slideUp 0.6s ease-out forwards'
      }}
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className={`inline-flex items-center justify-center p-4 rounded-xl ${color} shadow-lg`}>
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch appointments
        const appointmentsResponse = await api.get('/appointments');
        const appointments: ApiAppointment[] = appointmentsResponse.data;
        
        const now = new Date();
        const upcoming = appointments.filter((apt: ApiAppointment) => new Date(apt.dateTime) > now);
        const completed = appointments.filter((apt: ApiAppointment) => new Date(apt.dateTime) <= now);
        
        setStats({
          totalAppointments: appointments.length,
          upcomingAppointments: upcoming.length,
          completedAppointments: completed.length,
        });

        // Set upcoming appointments for display
        setUpcomingAppointments(upcoming.slice(0, 3).map((apt: ApiAppointment) => ({
          id: apt.id,
          date: new Date(apt.dateTime).toLocaleDateString(),
          time: new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: apt.type || 'Consultation',
          with: user?.role === 'PATIENT' ? apt.provider?.email : apt.patient?.email,
          patient: user?.role === 'PROVIDER' ? apt.patient?.email : undefined,
        })));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getQuickActions = () => {
    if (user?.role === 'PATIENT') {
      return [
        {
          title: 'Book Appointment',
          description: 'Find a provider and schedule a consultation',
          href: '/dashboard/schedule',
          icon: (
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          color: 'bg-gradient-to-r from-blue-500 to-blue-600',
        },
        {
          title: 'View Health Records',
          description: 'Access your medical history and documents',
          href: '/dashboard/ehr',
          icon: (
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          color: 'bg-gradient-to-r from-green-500 to-emerald-600',
        },
        {
          title: 'Prescriptions',
          description: 'View and manage your prescriptions',
          href: '/dashboard/prescriptions',
          icon: (
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          ),
          color: 'bg-gradient-to-r from-purple-500 to-purple-600',
        },
      ];
    } else {
      return [
        {
          title: 'Manage Availability',
          description: 'Set your available times for appointments',
          href: '/dashboard/availability',
          icon: (
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'bg-gradient-to-r from-blue-500 to-blue-600',
        },
        {
          title: 'Patient Records',
          description: 'Access and manage patient information',
          href: '/dashboard/ehr',
          icon: (
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          color: 'bg-gradient-to-r from-green-500 to-emerald-600',
        },
        {
          title: 'Prescriptions',
          description: 'Write and manage prescriptions',
          href: '/dashboard/prescriptions',
          icon: (
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          ),
          color: 'bg-gradient-to-r from-purple-500 to-purple-600',
        },
      ];
    }
  };

  return (
    <div className="space-y-8 min-h-full">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          subtitle="All time"
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          index={0}
          icon={
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Upcoming"
          value={stats.upcomingAppointments}
          subtitle="Scheduled ahead"
          color="bg-gradient-to-r from-green-500 to-emerald-600"
          index={1}
          icon={
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Completed"
          value={stats.completedAppointments}
          subtitle="Past appointments"
          color="bg-gradient-to-r from-purple-500 to-indigo-600"
          index={2}
          icon={
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 animate-fade-in">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {getQuickActions().map((action, index) => (
            <QuickActionCard key={index} {...action} index={index} />
          ))}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 animate-fade-in">Upcoming Appointments</h2>
          <Link href="/dashboard/appointments" className="text-teal-600 hover:text-teal-700 text-sm font-medium hover:underline transition-all duration-200 animate-fade-in">
            View all
          </Link>
        </div>
        
        <div className="bg-white/60 backdrop-blur-xl shadow-xl rounded-2xl border border-white/30 animate-fade-in" style={{ animationDelay: '400ms' }}>
          {upcomingAppointments.length > 0 ? (
            <ul className="divide-y divide-gray-200/50">
              {upcomingAppointments.map((appointment, index) => (
                <li 
                  key={appointment.id} 
                  className="p-6 hover:bg-white/30 transition-colors duration-200"
                  style={{ 
                    animationDelay: `${500 + (index * 100)}ms`,
                    animation: 'slideUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {appointment.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user?.role === 'PATIENT' ? `with ${appointment.with}` : `Patient: ${appointment.patient}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">{appointment.date}</p>
                      <p className="text-sm text-gray-600">{appointment.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-teal-100/70 to-cyan-100/70 rounded-full flex items-center justify-center animate-bounce-gentle backdrop-blur-sm">
                <svg className="h-8 w-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">No upcoming appointments</h3>
              <p className="mt-2 text-sm text-gray-600">
                {user?.role === 'PATIENT' ? 'Book your first appointment with a provider.' : 'No appointments scheduled yet.'}
              </p>
              {user?.role === 'PATIENT' && (
                <div className="mt-6">
                  <Link
                    href="/dashboard/schedule"
                    className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-sm font-medium rounded-xl text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Book Appointment
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer spacer to ensure full coverage */}
      <div className="h-16"></div>
    </div>
  );
}
