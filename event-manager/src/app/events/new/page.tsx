"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/header";
import { EventForm } from "@/components/events/event-form";

export default function NewEventPage() {
  useEffect(() => {
    // Override body styles for this page
    const originalBackground = document.body.style.background;
    const originalMinHeight = document.body.style.minHeight;

    document.body.style.background = "#f9fafb";
    document.body.style.minHeight = "auto";

    // Cleanup on unmount
    return () => {
      document.body.style.background = originalBackground;
      document.body.style.minHeight = originalMinHeight;
    };
  }, []);

  return (
    <div className="bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Create New Event
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-xl mx-auto px-2">
            Fill in the details below to create your new event.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200">
          <EventForm />
        </div>
      </main>
    </div>
  );
}
