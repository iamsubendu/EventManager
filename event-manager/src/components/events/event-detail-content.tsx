"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Header } from "@/components/layout/header";
import { AttendeeManager } from "@/components/attendees/attendee-manager";
import { GET_EVENT } from "@/lib/graphql/queries";
import { EventWithAttendees } from "@/lib/types";
import { ArrowLeftIcon, CalendarIcon } from "@/components/ui/icons";

interface Props {
  eventId: string;
}

export function EventDetailPageContent({ eventId }: Props) {
  const { data, loading, error } = useQuery<{ event: EventWithAttendees }>(
    GET_EVENT,
    {
      variables: { id: eventId },
    }
  );

  useEffect(() => {
    if (error) {
      toast.error("Failed to load event details. Please try again.", {
        id: "event-detail-error",
      });
    }
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error loading event: {error.message}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!data?.event) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              Event not found
            </h3>
            <p className="mt-2 text-gray-500">
              The event you&apos;re looking for doesn&apos;t exist.
            </p>
            <div className="mt-6">
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const event = data.event;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/events"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Events
          </Link>

          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>

            <div className="flex items-center text-gray-600 mb-4">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <span>
                {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="text-sm text-gray-500">
              <p>Created: {new Date(event.createdAt).toLocaleDateString()}</p>
              {event.updatedAt !== event.createdAt && (
                <p>Updated: {new Date(event.updatedAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <AttendeeManager eventId={event.id} attendees={event.attendees} />
        </div>
      </main>
    </div>
  );
}
