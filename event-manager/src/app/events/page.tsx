import { Header } from "@/components/layout/header";
import { EventList } from "@/components/events/event-list";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Events</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Organize, manage, and track all your events in one beautiful place.
            Create memorable experiences with ease.
          </p>
        </div>

        <EventList />
      </main>
    </div>
  );
}
