import { database } from "../database";
import { CreateEventInput, CreateAttendeeInput } from "../types";

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
      return database.createEvent(input);
    },

    deleteEvent: (_: unknown, { id }: { id: string }) => {
      return database.deleteEvent(id);
    },

    createAttendee: (_: unknown, { input }: { input: CreateAttendeeInput }) => {
      return database.createAttendee(input);
    },

    deleteAttendee: (_: unknown, { id }: { id: string }) => {
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
