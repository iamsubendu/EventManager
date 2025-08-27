import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      date
      attendeeCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      title
      date
      createdAt
      updatedAt
      attendees {
        id
        name
        email
        createdAt
      }
      attendeeCount
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      date
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`;

export const CREATE_ATTENDEE = gql`
  mutation CreateAttendee($input: CreateAttendeeInput!) {
    createAttendee(input: $input) {
      id
      name
      email
      eventId
      createdAt
    }
  }
`;

export const DELETE_ATTENDEE = gql`
  mutation DeleteAttendee($id: ID!) {
    deleteAttendee(id: $id)
  }
`;
