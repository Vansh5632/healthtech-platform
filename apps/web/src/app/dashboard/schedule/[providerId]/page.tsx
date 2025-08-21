"use client";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface AvailabilitySlot {
  slot: Date;
}

interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
}

const fetchAvailability = async (
  providerId: string
): Promise<CalendarEvent[]> => {
  const startDate = new Date();
  const endDate = new Date();

  endDate.setDate(startDate.getDate() + 30);

  const { data } = await api.get(`/availability/${providerId}`, {
    params: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });

  return data.map((slot: AvailabilitySlot) => {
    const startTime = new Date(slot.slot);
    const endTime = new Date(startTime.getTime() + 30 * 60000);
    return {
      start: startTime,
      end: endTime,
      title: "Available",
    };
  });
};

const bookAppointment = (newAppointment: {
  providerId: string;
  startTime: Date;
  endTime: Date;
}) => {
  return api.post("/appointments", newAppointment);
};

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const providerId = params.providerId as string;

  const {
    data: availableSlots,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["availability", providerId],
    queryFn: () => fetchAvailability(providerId),
    enabled: !!providerId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      alert("Appointment booked successfully");

      queryClient.invalidateQueries({ queryKey: ["availability", providerId] });
      router.push("/dashboard/appointments");
    },
    onError: (error) => {
      alert(`failed to book appointments: ${error.message}`);
    },
  });
  const handleSelectSlot = (event: CalendarEvent) => {
    if (
      window.confirm(`Book appointment for ${format(event.start, "PPP p")}?`)
    ) {
      mutate({
        providerId,
        startTime: event.start,
        endTime: event.end,
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
      <p className="mt-2 text-gray-600">
        Select an available time slot below to book your appointment.
      </p>
      <div
        className="mt-8 bg-white p-4 rounded-lg shadow-sm"
        style={{ height: "600px" }}
      >
        <Calendar
          localizer={localizer}
          events={availableSlots}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={["week", "day"]}
          step={30}
          timeslots={1}
          onSelectEvent={handleSelectSlot}
          selectable
        />
      </div>
    </div>
  );
}
