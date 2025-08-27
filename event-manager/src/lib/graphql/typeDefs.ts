import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Event {
    id: ID!
    title: String!
    date: String!
    createdAt: String!
    updatedAt: String!
    attendees: [Attendee!]!
    attendeeCount: Int!
  }

  type Attendee {
    id: ID!
    name: String!
    email: String
    eventId: String!
    createdAt: String!
  }

  input CreateEventInput {
    title: String!
    date: String!
  }

  input CreateAttendeeInput {
    name: String!
    email: String
    eventId: String!
  }

  type Query {
    events: [Event!]!
    event(id: ID!): Event
    attendees(eventId: ID!): [Attendee!]!
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Event!
    deleteEvent(id: ID!): Boolean!
    createAttendee(input: CreateAttendeeInput!): Attendee!
    deleteAttendee(id: ID!): Boolean!
  }
`;
