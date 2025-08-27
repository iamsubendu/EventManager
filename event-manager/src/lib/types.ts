// Core types for the Event Manager application

export interface Event {
  id: string;
  title: string;
  date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  attendeeCount: number;
}

export interface Attendee {
  id: string;
  name: string;
  email?: string;
  eventId: string;
  createdAt: string;
}

export interface CreateEventInput {
  title: string;
  date: string;
}

export interface CreateAttendeeInput {
  name: string;
  email?: string;
  eventId: string;
}

export interface EventWithAttendees extends Event {
  attendees: Attendee[];
  attendeeCount: number;
}
