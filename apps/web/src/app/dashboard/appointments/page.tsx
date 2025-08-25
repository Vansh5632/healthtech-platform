"use client";

import api from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns/format";
import Link from "next/link";
import { useState } from "react";

type Appointment = {
  id: string;
  startTime: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELED";
  patient: { id: string; email: string };
  provider: { id: string; email: string };
  type?: string;
  notes?: string;
};

const fetchMyAppointments = async (): Promise<Appointment[]> => {
  const { data } = await api.get("appointments/me");
  return data;
};

const cancelAppointment = async (appointmentId: string): Promise<void> => {
  await api.patch(`appointments/${appointmentId}`, { status: 'CANCELED' });
};

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  switch (status) {
    case 'SCHEDULED':
      return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Scheduled</span>;
    case 'COMPLETED':
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
    case 'CANCELED':
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Canceled</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
  }
};

export default function MyAppointmentsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  
  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useQuery<Appointment[], Error>({
    queryKey: ["Appointments"],
    queryFn: fetchMyAppointments,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Appointments"] });
    },
  });

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelMutation.mutateAsync(appointmentId);
      } catch (error) {
        console.error('Failed to cancel appointment:', error);
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  const filteredAppointments = appointments?.filter(appt => {
    const now = new Date();
    const apptDate = new Date(appt.startTime);
    
    switch (filter) {
      case 'upcoming':
        return apptDate > now && appt.status === 'SCHEDULED';
      case 'completed':
        return appt.status === 'COMPLETED';
      default:
        return true;
    }
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Appointments</h1>
              <p className="text-teal-100 mt-2 text-lg">
                View and manage your healthcare appointments
              </p>
            </div>
          </div>
          {user?.role === 'PATIENT' && (
            <Link
              href="/dashboard/schedule"
              className="inline-flex items-center px-6 py-3 border-2 border-white/30 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 hover:scale-105"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book New Appointment
            </Link>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'all', label: 'All Appointments', count: filteredAppointments.length },
              { key: 'upcoming', label: 'Upcoming', count: appointments?.filter(apt => new Date(apt.startTime) > new Date() && apt.status === 'SCHEDULED').length || 0 },
              { key: 'completed', label: 'Completed', count: appointments?.filter(apt => apt.status === 'COMPLETED').length || 0 },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 flex items-center space-x-2 ${
                  filter === tab.key
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                  filter === tab.key 
                    ? 'bg-teal-100 text-teal-600' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Appointments list */}
        <div className="p-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {user?.role === 'PATIENT' 
                  ? 'Get started by booking your first appointment with one of our qualified healthcare providers.' 
                  : 'No appointments scheduled yet. Patients will be able to book appointments during your available hours.'}
              </p>
              {user?.role === 'PATIENT' && (
                <Link
                  href="/dashboard/schedule"
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-base font-medium rounded-xl text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 hover:scale-105 transition-all duration-200"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Book Your First Appointment
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appt) => {
                const isUpcoming = new Date(appt.startTime) > new Date();
                const canJoin = appt.status === 'SCHEDULED' && isUpcoming;
                const canCancel = appt.status === 'SCHEDULED' && isUpcoming;
                
                return (
                  <div 
                    key={appt.id}
                    className="bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <p className="text-lg font-semibold text-gray-900">
                                {user?.role === "PROVIDER"
                                  ? `Patient: ${appt.patient.email}`
                                  : `Dr. ${appt.provider.email.split('@')[0]}`}
                              </p>
                              <StatusBadge status={appt.status} />
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium">
                                  {format(new Date(appt.startTime), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                                </span>
                              </div>
                              
                              {appt.type && (
                                <div className="flex items-center">
                                  <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span>{appt.type}</span>
                                </div>
                              )}
                            </div>
                            
                            {appt.notes && (
                              <div className="mt-3 flex items-start">
                                <svg className="mr-2 h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <p className="text-sm text-gray-600 break-words bg-gray-50 rounded-lg px-3 py-2">
                                  {appt.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {canJoin && (
                            <Link
                              href={`/dashboard/appointments/${appt.id}/call`}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                            >
                              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Join Call
                            </Link>
                          )}
                          {canCancel && (
                            <button
                              onClick={() => handleCancelAppointment(appt.id)}
                              disabled={cancelMutation.isPending}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              {cancelMutation.isPending ? (
                                <svg className="animate-spin mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                              {cancelMutation.isPending ? 'Canceling...' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
