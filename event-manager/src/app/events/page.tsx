import { Header } from "@/components/layout/header";
import { EventList } from "@/components/events/event-list";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Your Events
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-xl mx-auto px-2">
            Organize, manage, and track all your events in one place.
          </p>
        </div>

        <EventList />
      </main>
    </div>
  );
}
