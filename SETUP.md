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
   cd EventManager
   ```

   Or if you have the zip file, extract it and navigate to the `EventManager` directory.

2. **Navigate to the application directory**:

   ```bash
   cd event-manager
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Verify installation**:

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
# Run ESLint for code quality
npm run lint
```

## Project Structure

```
EventManager/
├── event-manager/
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   │   ├── api/graphql/        # GraphQL API endpoint
│   │   │   ├── events/             # Event-related pages
│   │   │   │   ├── [id]/           # Dynamic event detail page
│   │   │   │   ├── new/            # Create event page
│   │   │   │   └── page.tsx        # Events list page
│   │   │   ├── layout.tsx          # Root layout with providers
│   │   │   ├── page.tsx            # Home page
│   │   │   └── globals.css         # Global styles
│   │   ├── components/             # React components
│   │   │   ├── attendees/          # Attendee management components
│   │   │   ├── events/             # Event components
│   │   │   ├── layout/             # Layout components (header)
│   │   │   ├── providers/          # Context providers
│   │   │   └── ui/                 # Reusable UI components
│   │   └── lib/                    # Utilities and configuration
│   │       ├── graphql/            # GraphQL schema and resolvers
│   │       ├── apollo-client.ts    # Apollo Client configuration
│   │       ├── database.ts         # In-memory database
│   │       ├── error-utils.ts      # Error handling utilities
│   │       └── types.ts            # TypeScript type definitions
│   ├── package.json                # Dependencies and scripts
│   ├── tsconfig.json              # TypeScript configuration
│   ├── next.config.ts             # Next.js configuration
│   └── tailwind.config.ts         # TailwindCSS configuration
├── ENTITIES.md                     # Data model design
├── NOTES.md                       # Implementation notes
├── SETUP.md                       # This file
└── README.md                      # Project overview
```

## Features Overview

### Core Functionality

- **Event Management**: Create, view, and list events with title and date
- **Attendee Management**: Add and remove attendees with name and optional email
- **Real-time Updates**: Changes reflect immediately across the application
- **Form Validation**: Comprehensive validation with user-friendly error messages
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
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
   npx tsc --noEmit
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

## Development Workflow

1. **Start the development server**: `npm run dev`
2. **Make changes**: Edit files in the `src/` directory
3. **View changes**: Changes are automatically reflected in the browser
4. **Test GraphQL**: Use the GraphQL playground at `/api/graphql`
5. **Build for production**: `npm run build` when ready to deploy

## Deployment

The application is ready for deployment to:

- **Vercel** (recommended for Next.js applications)
- **Netlify**
- **Railway**
- **Any Node.js hosting platform**

For production deployment, consider:

1. Setting up environment variables
2. Replacing the in-memory database with a persistent solution
3. Configuring error tracking and monitoring
4. Setting up CI/CD pipelines

## Support

If you encounter any issues during setup or development, please refer to:

- **NOTES.md** for implementation details and assumptions
- **ENTITIES.md** for data model documentation
- Next.js documentation: https://nextjs.org/docs
- Apollo GraphQL documentation: https://www.apollographql.com/docs/
