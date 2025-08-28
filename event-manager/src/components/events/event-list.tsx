"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useEffect, memo, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { GET_EVENTS } from "@/lib/graphql/queries";
import { Event } from "@/lib/types";
import { CalendarIcon, UsersIcon } from "@/components/ui/icons";

const EventCard = memo(({ event }: { event: Event }) => {
  const formattedDate = useMemo(() => {
    return new Date(event.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [event.date]);

  const formattedCreatedAt = useMemo(() => {
    return new Date(event.createdAt).toLocaleDateString();
  }, [event.createdAt]);

  const attendeeText = useMemo(() => {
    return `${event.attendeeCount} ${
      event.attendeeCount === 1 ? "attendee" : "attendees"
    }`;
  }, [event.attendeeCount]);

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200 flex-shrink-0">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full flex-shrink-0">
            {formattedCreatedAt}
          </span>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {event.title}
          </h3>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center text-gray-600">
            <div className="p-1 sm:p-1.5 bg-blue-50 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
              <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium truncate">
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <div className="p-1 sm:p-1.5 bg-green-50 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
              <UsersIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium">
              {attendeeText}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-xs text-blue-600 font-medium">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
});

EventCard.displayName = "EventCard";

const LoadingSkeleton = memo(() => {
  const skeletonItems = useMemo(() => [...Array(6)], []);

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {skeletonItems.map((_, i) => (
        <div
          key={i}
          className="bg-white/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 animate-pulse"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl"></div>
              <div className="w-16 h-4 bg-gray-200 rounded-full"></div>
            </div>
            <div className="w-3/4 h-5 sm:h-6 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg mr-3"></div>
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg mr-3"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

LoadingSkeleton.displayName = "LoadingSkeleton";

function EventListComponent() {
  const { data, loading, error } = useQuery<{ events: Event[] }>(GET_EVENTS);
  const handleError = useCallback(() => {
    if (error) {
      toast.error("Failed to load events. Please refresh the page.", {
        id: "events-error",
      });
    }
  }, [error]);

  useEffect(() => {
    handleError();
  }, [handleError]);
  const EmptyState = useMemo(
    () => (
      <div className="text-center py-12 sm:py-20 px-4">
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-6">
          <CalendarIcon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          No events yet
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm sm:text-base">
          Ready to get started? Create your first event and begin organizing
          amazing experiences.
        </p>
        <Link
          href="/events/new"
          className="inline-flex items-center space-x-2 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 text-sm sm:text-base"
        >
          <span>Create Your First Event</span>
        </Link>
      </div>
    ),
    []
  );

  const ErrorState = useMemo(
    () => (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Error loading events: {error?.message}</p>
      </div>
    ),
    [error?.message]
  );

  const EventsGrid = useMemo(() => {
    if (!data?.events) return null;

    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  }, [data?.events]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return ErrorState;
  }

  if (!data?.events || data.events.length === 0) {
    return EmptyState;
  }

  return EventsGrid;
}

export const EventList = memo(EventListComponent);
