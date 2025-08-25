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
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your healthcare appointments
          </p>
        </div>
        {user?.role === 'PATIENT' && (
          <div className="mt-4 sm:mt-0">
            <Link
              href="/dashboard/schedule"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book New Appointment
            </Link>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Appointments' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Appointments list */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {user?.role === 'PATIENT' 
              ? 'Get started by booking your first appointment.' 
              : 'No appointments scheduled yet.'}
          </p>
          {user?.role === 'PATIENT' && (
            <div className="mt-6">
              <Link
                href="/dashboard/schedule"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredAppointments.map((appt) => {
              const isUpcoming = new Date(appt.startTime) > new Date();
              const canJoin = appt.status === 'SCHEDULED' && isUpcoming;
              const canCancel = appt.status === 'SCHEDULED' && isUpcoming;
              
              return (
                <li key={appt.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {user?.role === "PROVIDER"
                                ? `Patient: ${appt.patient.email}`
                                : `Dr. ${appt.provider.email.split('@')[0]}`}
                            </p>
                            <div className="ml-2">
                              <StatusBadge status={appt.status} />
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p>
                              {format(new Date(appt.startTime), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          {appt.type && (
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <p>
                                {appt.type}
                              </p>
                            </div>
                          )}
                          {appt.notes && (
                            <div className="mt-1 flex items-start text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                              </svg>
                              <p className="break-words">
                                {appt.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {canJoin && (
                          <Link
                            href={`/dashboard/appointments/${appt.id}/call`}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                          >
                            {cancelMutation.isPending ? 'Canceling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
