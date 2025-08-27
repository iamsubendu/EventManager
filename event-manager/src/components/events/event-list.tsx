"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { GET_EVENTS } from "@/lib/graphql/queries";
import { Event } from "@/lib/types";
import { CalendarIcon, UsersIcon } from "@/components/ui/icons";

export function EventList() {
  const { data, loading, error } = useQuery<{ events: Event[] }>(GET_EVENTS);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load events. Please refresh the page.", {
        id: "events-error",
      });
    }
  }, [error]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white/50 p-6 rounded-2xl shadow-lg border border-gray-100 animate-pulse"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="w-16 h-4 bg-gray-200 rounded-full"></div>
              </div>
              <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Error loading events: {error.message}</p>
      </div>
    );
  }

  if (!data?.events || data.events.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <CalendarIcon className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No events yet
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Ready to get started? Create your first event and begin organizing
          amazing experiences.
        </p>
        <Link
          href="/events/new"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <span>Create Your First Event</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.events.map((event) => (
        <Link
          key={event.id}
          href={`/events/${event.id}`}
          className="group block bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="space-y-4">
            {/* Event Header */}
            <div className="flex items-start justify-between">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                {new Date(event.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Event Title */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {event.title}
              </h3>
            </div>

            {/* Event Details */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <div className="p-1.5 bg-blue-50 rounded-lg mr-3">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <div className="p-1.5 bg-green-50 rounded-lg mr-3">
                  <UsersIcon className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">
                  {event.attendeeCount}{" "}
                  {event.attendeeCount === 1 ? "attendee" : "attendees"}
                </span>
              </div>
            </div>

            {/* Hover Indicator */}
            <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-xs text-blue-600 font-medium">
                View details →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
