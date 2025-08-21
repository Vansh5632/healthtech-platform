"use client";

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Provider {
  id: string;
  email: string;
}

const fetchProviders = async (): Promise<Provider[]> => {
  const { data } = await api.get("/users/providers");
  return data;
};

export default function SchedulePage() {
  const {
    data: providers,
    isLoading,
    isError,
    error,
  } = useQuery<Provider[], Error>({
    queryKey: ["providers"],
    queryFn: fetchProviders,
  });

  if (isLoading) {
    return <span>Loading providers...</span>;
  }

  if (isError) {
    return <span>Error:{error.message}</span>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Find a Provider</h1>
      <p className="mt-2 text-gray-600">
        Select a provider to view their schedule and book an appointment.
      </p>
      <div className="mt-8 space-y-4">
        {providers?.map((provider) => (
          <div key={provider.id} className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">{provider.email}</p>
                <p className="text-sm text-gray-500">
                  Cardiology Specialist
                </p>{" "}
                {/* Placeholder */}
              </div>
              <Link href={`/dashboard/schedule/${provider.id}`}>
                <span className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 cursor-pointer">
                  View Schedule
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
