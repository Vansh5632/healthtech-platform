"use client";

import api from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ScheduleSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const setAvailability = (schedule: { schedule: ScheduleSlot[] }) => {
  return api.post("/availability", schedule);
};

export default function AvailabilityPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [schedule, setSchedule] = useState<ScheduleSlot[]>(
    daysOfWeek.map((_, index) => ({
      dayOfWeek: index,
      startTime: "09:00",
      endTime: "17:00",
    }))
  );

  const [enabledDays, setEnabledDays] = useState<boolean[]>([
    false,
    true,
    true,
    true,
    true,
    true,
    false,
  ]);

  useEffect(() => {
    if (user && user.role !== "PROVIDER") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const { mutate, isPending } = useMutation({
    mutationFn: setAvailability,
    onSuccess: () => {
      // Replace alert with toast notification
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      successDiv.textContent = 'Availability updated successfully!';
      document.body.appendChild(successDiv);
      setTimeout(() => {
        successDiv.remove();
      }, 3000);
    },
    onError: (error) => {
      // Replace alert with toast notification
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      errorDiv.textContent = `Failed to update availability: ${error.message}`;
      document.body.appendChild(errorDiv);
      setTimeout(() => {
        errorDiv.remove();
      }, 5000);
    },
  });

  const handleTimeChange = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const handleEnabledChange = (index: number) => {
    const newEnabledDays = [...enabledDays];
    newEnabledDays[index] = !newEnabledDays[index];
    setEnabledDays(newEnabledDays);
  };

  const handleSubmit = () => {
    const activeSchedule = schedule.filter((_, index) => enabledDays[index]);
    mutate({ schedule: activeSchedule });
  };

  if (!user || user.role !== "PROVIDER") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-sm text-gray-600">This page is only available to healthcare providers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Manage Your Availability</h1>
            <p className="text-teal-100 mt-2 text-lg">
              Set your weekly schedule to help patients book appointments when you&apos;re available
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Configuration */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <svg className="w-6 h-6 text-teal-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Weekly Schedule
          </h2>
          <p className="text-gray-600 mt-1">Configure your working hours for each day of the week</p>
        </div>

        <div className="p-6 space-y-6">
          {daysOfWeek.map((day, index) => {
            const isEnabled = enabledDays[index];
            return (
              <div 
                key={day} 
                className={`transition-all duration-200 rounded-xl border-2 p-6 ${
                  isEnabled 
                    ? 'border-teal-200 bg-teal-50/50 shadow-sm' 
                    : 'border-gray-200 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Custom Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabledDays[index]}
                        onChange={() => handleEnabledChange(index)}
                        className="sr-only peer"
                      />
                      <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                    
                    <div>
                      <h3 className={`text-lg font-semibold ${isEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
                        {day}
                      </h3>
                      <p className={`text-sm ${isEnabled ? 'text-teal-600' : 'text-gray-400'}`}>
                        {isEnabled ? 'Available for appointments' : 'Not available'}
                      </p>
                    </div>
                  </div>

                  {/* Time Inputs */}
                  <div className={`flex items-center space-x-4 transition-opacity duration-200 ${
                    isEnabled ? 'opacity-100' : 'opacity-40'
                  }`}>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={schedule[index].startTime}
                          onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                          disabled={!enabledDays[index]}
                          className={`block w-32 px-4 py-3 text-sm border rounded-xl shadow-sm transition-all duration-200 ${
                            isEnabled
                              ? 'border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 bg-white'
                              : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center py-8">
                      <div className="w-4 h-0.5 bg-gray-300 rounded"></div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={schedule[index].endTime}
                          onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                          disabled={!enabledDays[index]}
                          className={`block w-32 px-4 py-3 text-sm border rounded-xl shadow-sm transition-all duration-200 ${
                            isEnabled
                              ? 'border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 bg-white'
                              : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Save Changes</h3>
            <p className="text-gray-600 text-sm mt-1">
              Your availability will be updated and patients can book accordingly
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={`inline-flex items-center px-8 py-4 text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg ${
              isPending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:scale-105'
            } text-white focus:outline-none focus:ring-4 focus:ring-teal-200`}
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Availability
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Quick Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Set consistent hours to build patient trust and expectation</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Leave buffer time between appointments for proper care</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Update your schedule regularly to reflect any changes</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Consider time zones if you serve patients in different regions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
