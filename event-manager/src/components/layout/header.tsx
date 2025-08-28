"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarIcon, PlusIcon, ArrowLeftIcon } from "@/components/ui/icons";

export function Header() {
  const pathname = usePathname();

  // Show "Back to Events" on any event-related page (except the main events list)
  const isEventPage = pathname.startsWith("/events") && pathname !== "/events";

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2.5 sm:py-4">
          <Link
            href="/events"
            className="flex items-center space-x-2 sm:space-x-3 group min-w-0 flex-1"
          >
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-200 flex-shrink-0">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                Event Manager
              </h1>
              <p className="text-xs text-gray-500 -mt-0.5 hidden sm:block">
                Organize with ease
              </p>
            </div>
          </Link>

          <nav className="ml-3 sm:ml-4 flex-shrink-0">
            {isEventPage ? (
              <Link
                href="/events"
                className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 transform hover:-translate-y-0.5 px-3 py-1.5 text-sm"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Back to Events</span>
                <span className="sm:hidden ml-1">Back</span>
              </Link>
            ) : (
              <Link
                href="/events/new"
                className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 transform hover:-translate-y-0.5 px-3 py-1.5 text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Create Event</span>
                <span className="sm:hidden ml-1">Create</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
