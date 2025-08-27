// In-memory database for the Event Manager
import {
  Event,
  Attendee,
  CreateEventInput,
  CreateAttendeeInput,
} from "./types";

class InMemoryDatabase {
  private events: Event[] = [];
  private attendees: Attendee[] = [];
  private eventIdCounter = 1;
  private attendeeIdCounter = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed with some initial events
    const now = new Date().toISOString();

    const event1: Event = {
      id: "1",
      title: "Team Standup",
      date: "2024-01-15T10:00:00.000Z",
      createdAt: now,
      updatedAt: now,
      attendeeCount: 0, // Will be updated after seeding attendees
    };

    const event2: Event = {
      id: "2",
      title: "Product Launch",
      date: "2024-02-01T14:00:00.000Z",
      createdAt: now,
      updatedAt: now,
      attendeeCount: 0, // Will be updated after seeding attendees
    };

    this.events = [event1, event2];
    this.eventIdCounter = 3;

    // Seed with some attendees
    const attendee1: Attendee = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      eventId: "1",
      createdAt: now,
    };

    const attendee2: Attendee = {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      eventId: "1",
      createdAt: now,
    };

    const attendee3: Attendee = {
      id: "3",
      name: "Bob Wilson",
      eventId: "2",
      createdAt: now,
    };

    this.attendees = [attendee1, attendee2, attendee3];
    this.attendeeIdCounter = 4;

    // Update attendee counts
    this.updateAttendeeCount("1");
    this.updateAttendeeCount("2");
  }

  private updateAttendeeCount(eventId: string) {
    const event = this.events.find((e) => e.id === eventId);
    if (event) {
      event.attendeeCount = this.attendees.filter(
        (attendee) => attendee.eventId === eventId
      ).length;
    }
  }

  // Event operations
  getAllEvents(): Event[] {
    return [...this.events];
  }

  getEventById(id: string): Event | null {
    return this.events.find((event) => event.id === id) || null;
  }

  createEvent(input: CreateEventInput): Event {
    const now = new Date().toISOString();
    const event: Event = {
      id: this.eventIdCounter.toString(),
      title: input.title,
      date: input.date,
      createdAt: now,
      updatedAt: now,
      attendeeCount: 0,
    };

    this.events.push(event);
    this.eventIdCounter++;
    return event;
  }

  deleteEvent(id: string): boolean {
    const index = this.events.findIndex((event) => event.id === id);
    if (index === -1) return false;

    this.events.splice(index, 1);
    // Also remove all attendees for this event
    this.attendees = this.attendees.filter(
      (attendee) => attendee.eventId !== id
    );
    return true;
  }

  // Attendee operations
  getAttendeesByEventId(eventId: string): Attendee[] {
    return this.attendees.filter((attendee) => attendee.eventId === eventId);
  }

  getAttendeeById(id: string): Attendee | null {
    return this.attendees.find((attendee) => attendee.id === id) || null;
  }

  createAttendee(input: CreateAttendeeInput): Attendee {
    const now = new Date().toISOString();
    const attendee: Attendee = {
      id: this.attendeeIdCounter.toString(),
      name: input.name,
      email: input.email,
      eventId: input.eventId,
      createdAt: now,
    };

    this.attendees.push(attendee);
    this.attendeeIdCounter++;
    this.updateAttendeeCount(input.eventId);
    return attendee;
  }

  deleteAttendee(id: string): boolean {
    const index = this.attendees.findIndex((attendee) => attendee.id === id);
    if (index === -1) return false;

    const attendee = this.attendees[index];
    this.attendees.splice(index, 1);
    this.updateAttendeeCount(attendee.eventId);
    return true;
  }

  getAttendeeCount(eventId: string): number {
    return this.attendees.filter((attendee) => attendee.eventId === eventId)
      .length;
  }
}

// Export a singleton instance
export const database = new InMemoryDatabase();
