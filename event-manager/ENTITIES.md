# Entity Relationship Design

This document describes the data model for a realistic event management system that supports the requirements outlined in the assignment.

## Core Entities

### User

Represents users who can create and manage events.

- **id**: string (UUID, primary key)
- **name**: string (user's full name)
- **email**: string (unique email address)
- **password**: string (hashed password)
- **role**: enum ('admin', 'organizer', 'user') (user role/permissions)
- **createdAt**: timestamp
- **updatedAt**: timestamp

**Constraints:**

- email must be unique
- password should be hashed (bcrypt/argon2)

**Indexes:**

- Primary index on id
- Unique index on email
- Index on role for permission queries

### Event

Represents events that can be created and managed by users.

- **id**: string (UUID, primary key)
- **title**: string (event title, max 200 chars)
- **description**: text (optional detailed description)
- **date**: timestamp (event date and time)
- **location**: string (optional physical or virtual location)
- **maxAttendees**: number (optional capacity limit)
- **status**: enum ('draft', 'published', 'cancelled') (event status)
- **createdById**: string (references User.id, creator of the event)
- **createdAt**: timestamp
- **updatedAt**: timestamp

**Constraints:**

- title is required
- date must be in the future when creating
- maxAttendees must be positive if specified
- createdById must reference existing User

**Indexes:**

- Primary index on id
- Index on createdById for user's events
- Index on date for chronological queries
- Index on status for filtering
- Composite index on (status, date) for published events

### Tag

Represents categorization tags for events.

- **id**: string (UUID, primary key)
- **name**: string (unique tag name, max 50 chars)
- **color**: string (optional hex color for UI display)
- **description**: text (optional tag description)
- **createdAt**: timestamp

**Constraints:**

- name must be unique (case-insensitive)
- color must be valid hex format if provided

**Indexes:**

- Primary index on id
- Unique index on name (case-insensitive)

### Attendee

Represents people who attend events (not necessarily Users).

- **id**: string (UUID, primary key)
- **name**: string (attendee's name)
- **email**: string (optional email address)
- **phone**: string (optional phone number)
- **company**: string (optional company/organization)
- **notes**: text (optional notes about the attendee)
- **createdAt**: timestamp
- **updatedAt**: timestamp

**Constraints:**

- name is required
- email format validation if provided
- phone format validation if provided

**Indexes:**

- Primary index on id
- Index on email for lookup
- Index on name for search

## Join/Relationship Entities

### EventTag

Links events to their tags (many-to-many relationship).

- **eventId**: string (references Event.id)
- **tagId**: string (references Tag.id)
- **createdAt**: timestamp

**Constraints:**

- Composite primary key (eventId, tagId)
- eventId must reference existing Event
- tagId must reference existing Tag

**Indexes:**

- Primary index on (eventId, tagId)
- Index on eventId for event's tags
- Index on tagId for tag's events

### EventAttendance

Tracks attendance and RSVP status for attendees at events.

- **id**: string (UUID, primary key)
- **eventId**: string (references Event.id)
- **attendeeId**: string (references Attendee.id)
- **rsvpStatus**: enum ('pending', 'accepted', 'declined', 'maybe') (RSVP response)
- **attendanceStatus**: enum ('registered', 'attended', 'no_show') (actual attendance)
- **registeredAt**: timestamp (when they registered)
- **rsvpAt**: timestamp (when they responded to RSVP)
- **attendedAt**: timestamp (optional, when they actually attended)
- **notes**: text (optional notes about attendance)

**Constraints:**

- Composite unique key (eventId, attendeeId) - one record per attendee per event
- eventId must reference existing Event
- attendeeId must reference existing Attendee
- attendedAt can only be set if attendanceStatus is 'attended'

**Indexes:**

- Primary index on id
- Unique index on (eventId, attendeeId)
- Index on eventId for event attendees
- Index on attendeeId for attendee's events
- Index on rsvpStatus for filtering
- Index on attendanceStatus for reporting

### UserEventRole

Defines user roles/permissions for specific events (beyond just creation).

- **userId**: string (references User.id)
- **eventId**: string (references Event.id)
- **role**: enum ('creator', 'co_organizer', 'moderator') (role for this event)
- **permissions**: jsonb (specific permissions array)
- **assignedAt**: timestamp
- **assignedById**: string (references User.id, who assigned this role)

**Constraints:**

- Composite primary key (userId, eventId)
- userId must reference existing User
- eventId must reference existing Event
- assignedById must reference existing User

**Indexes:**

- Primary index on (userId, eventId)
- Index on userId for user's roles
- Index on eventId for event roles

## Performance Considerations

### Database Indexes

- **Composite indexes** on frequently queried combinations (status + date, userId + createdAt)
- **Partial indexes** on active/published events only
- **Full-text search indexes** on event titles and descriptions
- **GIN indexes** on JSONB fields (permissions, metadata)

### Caching Strategy

- Cache frequently accessed events and their attendee counts
- Cache user permissions and roles
- Cache tag lists for autocomplete
- Use Redis for session management and real-time features

### Scalability Considerations

- **Partitioning**: Events table could be partitioned by date ranges
- **Read Replicas**: For heavy read workloads on event listings
- **Event Sourcing**: For audit trails of event changes
- **CQRS**: Separate read/write models for complex reporting

## Data Model Assumptions

1. **User Authentication**: Users must be authenticated to create events, but anonymous attendee registration is allowed
2. **Event Privacy**: All events are assumed to be public; private events would need additional access control
3. **Attendee Uniqueness**: Same attendee (by email) can attend multiple events
4. **RSVP Workflow**: Attendees can RSVP and later mark actual attendance
5. **Soft Deletes**: Events and attendees use soft deletes (status field) rather than hard deletes for audit purposes
6. **Time Zones**: All timestamps stored in UTC, timezone handling done at application level
7. **File Attachments**: Not included in this model but could be added as separate FileAttachment entity
8. **Notifications**: Not modeled but would require separate notification/email queue tables
9. **Recurring Events**: Not included but could be added with RecurrenceRule entity
10. **Payment Integration**: Not included but would require separate Payment/Transaction entities

## Migration Considerations

When implementing this schema:

1. Start with core entities (User, Event, Attendee)
2. Add relationship tables (EventAttendance, EventTag)
3. Implement soft delete patterns
4. Add full-text search capabilities
5. Set up proper foreign key constraints
6. Create performance indexes based on query patterns
7. Implement audit logging for sensitive operations
