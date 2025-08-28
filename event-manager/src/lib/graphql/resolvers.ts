import { database } from "../database";
import { CreateEventInput, CreateAttendeeInput } from "../types";
function validateEventInput(input: CreateEventInput): void {
  if (!input.title || typeof input.title !== "string") {
    throw new Error("Event title is required and must be a string");
  }

  if (input.title.length < 3) {
    throw new Error("Event title must be at least 3 characters long");
  }

  if (input.title.length > 200) {
    throw new Error("Event title must be less than 200 characters");
  }

  if (!input.date || typeof input.date !== "string") {
    throw new Error("Event date is required and must be a valid date string");
  }

  const eventDate = new Date(input.date);
  if (isNaN(eventDate.getTime())) {
    throw new Error("Event date must be a valid date");
  }

  if (eventDate < new Date()) {
    throw new Error("Event date cannot be in the past");
  }
}

function validateAttendeeInput(input: CreateAttendeeInput): void {
  if (!input.name || typeof input.name !== "string") {
    throw new Error("Attendee name is required and must be a string");
  }

  if (input.name.length < 2) {
    throw new Error("Attendee name must be at least 2 characters long");
  }

  if (input.name.length > 100) {
    throw new Error("Attendee name must be less than 100 characters");
  }

  if (input.email && typeof input.email !== "string") {
    throw new Error("Email must be a string");
  }

  if (input.email && input.email.length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      throw new Error("Email must be a valid email address");
    }
  }

  if (!input.eventId || typeof input.eventId !== "string") {
    throw new Error("Event ID is required and must be a string");
  }
}

function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, "");
}

export const resolvers = {
  Query: {
    events: () => {
      return database.getAllEvents();
    },

    event: (_: unknown, { id }: { id: string }) => {
      return database.getEventById(id);
    },

    attendees: (_: unknown, { eventId }: { eventId: string }) => {
      return database.getAttendeesByEventId(eventId);
    },
  },

  Mutation: {
    createEvent: (_: unknown, { input }: { input: CreateEventInput }) => {
      validateEventInput(input);
      const sanitizedInput = {
        title: sanitizeString(input.title),
        date: input.date,
      };
      return database.createEvent(sanitizedInput);
    },

    deleteEvent: (_: unknown, { id }: { id: string }) => {
      if (!id || typeof id !== "string") {
        throw new Error("Event ID is required and must be a string");
      }
      const event = database.getEventById(id);
      if (!event) {
        throw new Error("Event not found");
      }
      return database.deleteEvent(id);
    },

    createAttendee: (_: unknown, { input }: { input: CreateAttendeeInput }) => {
      validateAttendeeInput(input);
      const event = database.getEventById(input.eventId);
      if (!event) {
        throw new Error("Event not found");
      }
      if (input.email && input.email.length > 0) {
        const existingAttendees = database.getAttendeesByEventId(input.eventId);
        const duplicateEmail = existingAttendees.find(
          (attendee) =>
            attendee.email &&
            attendee.email.toLowerCase() === input.email!.toLowerCase()
        );
        if (duplicateEmail) {
          throw new Error(
            "An attendee with this email is already registered for this event"
          );
        }
      }
      const sanitizedInput = {
        name: sanitizeString(input.name),
        email: input.email ? sanitizeString(input.email) : input.email,
        eventId: input.eventId,
      };
      return database.createAttendee(sanitizedInput);
    },

    deleteAttendee: (_: unknown, { id }: { id: string }) => {
      if (!id || typeof id !== "string") {
        throw new Error("Attendee ID is required and must be a string");
      }
      const attendee = database.getAttendeeById(id);
      if (!attendee) {
        throw new Error("Attendee not found");
      }
      return database.deleteAttendee(id);
    },
  },

  Event: {
    attendees: (parent: { id: string }) => {
      return database.getAttendeesByEventId(parent.id);
    },

    attendeeCount: (parent: { id: string }) => {
      return database.getAttendeeCount(parent.id);
    },
  },
};
