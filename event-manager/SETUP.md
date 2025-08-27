# Event Manager - Setup Instructions

This is a Mini Event Manager built with Next.js 15, TypeScript, GraphQL, and TailwindCSS.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## Installation

1. **Clone the repository** (if from GitHub):

   ```bash
   git clone https://github.com/iamsubendu/EventManager.git
   cd event-manager
   ```

   Or if you have the zip file, extract it and navigate to the `event-manager` directory.

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Verify installation**:

   ```bash
   npm run dev
   ```

   The application should start on `http://localhost:3000`

## Running the Application

### Development Mode

To start the development server:

```bash
npm run dev
```

This will start:

- Next.js development server on `http://localhost:3000`
- GraphQL API endpoint at `http://localhost:3000/api/graphql`
- Hot reloading for both frontend and backend changes

### Production Build

To build and run the application for production:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Other Available Scripts

```bash
# Run TypeScript type checking
npm run type-check

# Run ESLint for code quality
npm run lint

# Fix ESLint issues automatically
npm run lint:fix
```

## Project Structure

```
event-manager/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/graphql/        # GraphQL API endpoint
│   │   ├── events/             # Event-related pages
│   │   │   ├── [id]/           # Dynamic event detail page
│   │   │   ├── new/            # Create event page
│   │   │   └── page.tsx        # Events list page
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── page.tsx            # Home page (redirects to /events)
│   ├── components/             # Reusable React components
│   │   ├── attendees/          # Attendee management components
│   │   ├── events/             # Event-related components
│   │   ├── layout/             # Layout components (Header)
│   │   ├── providers/          # React providers (Apollo)
│   │   └── ui/                 # UI components (Icons)
│   └── lib/                    # Utility libraries
│       ├── graphql/            # GraphQL schema, resolvers, queries
│       ├── apollo-client.ts    # Apollo Client configuration
│       ├── database.ts         # In-memory database
│       └── types.ts            # TypeScript type definitions
├── ENTITIES.md                 # Data model documentation
├── SETUP.md                    # This file
├── NOTES.md                    # Implementation notes and assumptions
└── package.json                # Project dependencies and scripts
```

## Features

### Core Functionality

- **Event Management**:

  - View all events with attendee counts
  - Create new events with title and date/time
  - View detailed event information
  - Navigate between events seamlessly

- **Attendee Management**:
  - Add attendees to events (name required, email optional)
  - Remove attendees from events
  - View attendee lists with creation dates

### Technical Features

- **GraphQL API**: Full GraphQL implementation with queries and mutations
- **Type Safety**: Complete TypeScript coverage with no `any` types
- **Form Validation**: Client-side validation using Formik and Yup
- **Responsive Design**: Mobile-friendly interface using TailwindCSS
- **Loading States**: Proper loading and error handling throughout
- **In-Memory Database**: Persistent data during development session

## API Endpoints

### GraphQL Endpoint

- **URL**: `http://localhost:3000/api/graphql`
- **Playground**: Available in development mode for testing queries

### Available Operations

**Queries:**

- `events`: Get all events
- `event(id: ID!)`: Get specific event with attendees
- `attendees(eventId: ID!)`: Get attendees for an event

**Mutations:**

- `createEvent(input: CreateEventInput!)`: Create new event
- `deleteEvent(id: ID!)`: Delete an event
- `createAttendee(input: CreateAttendeeInput!)`: Add attendee to event
- `deleteAttendee(id: ID!)`: Remove attendee from event

## Configuration

### Environment Variables

The application works out of the box without additional environment variables. For production deployment, you may want to configure:

```bash
# .env.local
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/api/graphql
```

### Database Configuration

Currently uses an in-memory database that resets on server restart. For production, you would replace `src/lib/database.ts` with a real database connection (PostgreSQL, MongoDB, etc.).

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**:

   ```bash
   # Use a different port
   npm run dev -- -p 3001
   ```

2. **Module not found errors**:

   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**:

   ```bash
   # Run type checking
   npm run type-check
   ```

4. **Build failures**:
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

### Performance Tips

- The in-memory database resets on server restart in development
- For better development experience, keep the dev server running
- Use browser dev tools to inspect GraphQL queries in Network tab

## Next Steps

To extend this application:

1. **Database Integration**: Replace in-memory database with PostgreSQL/MongoDB
2. **Authentication**: Add user authentication and authorization
3. **Real-time Updates**: Implement WebSocket subscriptions
4. **File Uploads**: Add event image/document upload functionality
5. **Email Notifications**: Send RSVP confirmations and reminders
6. **Advanced Features**: Event categories, recurring events, payment integration

## Support

For questions or issues:

1. Check the NOTES.md file for implementation details
2. Review the GraphQL schema in `src/lib/graphql/typeDefs.ts`
3. Examine the database structure in `src/lib/database.ts`
