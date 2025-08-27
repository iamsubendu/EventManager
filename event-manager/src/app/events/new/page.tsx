import Link from "next/link";
import { Header } from "@/components/layout/header";
import { EventForm } from "@/components/events/event-form";
import { ArrowLeftIcon } from "@/components/ui/icons";

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/events"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-6 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Events
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create New Event
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ready to organize something amazing? Fill in the details below to
              create your new event.
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-gray-100">
          <EventForm />
        </div>
      </main>
    </div>
  );
}
