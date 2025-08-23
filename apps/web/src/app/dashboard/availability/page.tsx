"use client";

import api from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { scheduler } from "timers/promises";

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
  const { user } = useAuthStore;
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
    if (user && user.role !== "DOCTOR") {
      router.push("dashboard");
    }
  }, [user, router]);

  const { mutate, isPending } = useMutation({
    mutationFn: setAvailability,
    onSuccess: () => {
      alert("Availability updated successfully");
    },
    onError: (error) => {
      alert(`Failed to update availability:${error.message}`);
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
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Manage Your Availability
      </h1>
      <p className="mt-2 text-gray-600">
        Set your weekly working hours. Patients will only be able to book slots
        during these times.
      </p>

      <div className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-sm">
        {daysOfWeek.map((day, index) => (
          <div key={day} className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                id={`enabled-${index}`}
                checked={enabledDays[index]}
                onChange={() => handleEnabledChange(index)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor={`enabled-${index}`}
                className="ml-3 block text-sm font-medium text-gray-900"
              >
                {day}
              </label>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor={`start-time-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  id={`start-time-${index}`}
                  value={schedule[index].startTime}
                  onChange={(e) =>
                    handleTimeChange(index, "startTime", e.target.value)
                  }
                  disabled={!enabledDays[index]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor={`end-time-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>
                <input
                  type="time"
                  id={`end-time-${index}`}
                  value={schedule[index].endTime}
                  onChange={(e) =>
                    handleTimeChange(index, "endTime", e.target.value)
                  }
                  disabled={!enabledDays[index]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
