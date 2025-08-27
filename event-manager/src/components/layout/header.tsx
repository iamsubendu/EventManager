import Link from "next/link";
import { CalendarIcon, PlusIcon } from "@/components/ui/icons";

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/events" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Event Manager
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Organize with ease</p>
            </div>
          </Link>

          <nav>
            <Link
              href="/events/new"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create Event</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
