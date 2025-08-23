"use client";

import api from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";

type Appointment = {
  id: string;
  startTime: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELED";
  patient: { id: string; email: string };
  provider: { id: string; email: string };
};

const fetchMyAppointments = async (): Promise<Appointment[]> => {
  const { data } = await api.get("appointments/me");
  return data;
};

export default function MyAppointtmentsPage() {
  const { user } = useAuthStore();
  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useQuery<Appointment[], Error>({
    queryKey: ["Appointments"],
    queryFn: fetchMyAppointments,
  });

  if (isLoading) return <span>Loading your appointments...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      {user?.role === "PROVIDER" ? "Patient" : "Provider"}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Date & Time
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {appointments?.map((appt) => (
                    <tr key={appt.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {user?.role === "PROVIDER"
                          ? appt.patient.email
                          : appt.provider.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(appt.startTime), "PPP p")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            appt.status === "SCHEDULED"
                              ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                              : appt.status === "COMPLETED"
                                ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                                : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {/* In a real app, a link to the video call would go here */}
                        {appt.status === "SCHEDULED" && (
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Join Call
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
