# Mini Event Manager

A modern event management application built with Next.js, TypeScript, GraphQL, and TailwindCSS.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Features

- ✅ View list of events with attendee counts
- ✅ Create new events with title and date/time
- ✅ View detailed event information
- ✅ Add/remove attendees to events
- ✅ Form validation with Formik and Yup
- ✅ Responsive design with TailwindCSS
- ✅ Full TypeScript coverage
- ✅ GraphQL API with Apollo Server/Client

## Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup and running instructions
- **[ENTITIES.md](./ENTITIES.md)** - Data model and entity relationships
- **[NOTES.md](./NOTES.md)** - Implementation notes and assumptions

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS
- **Backend**: GraphQL with Apollo Server
- **Forms**: Formik + Yup validation
- **State Management**: Apollo Client
- **Database**: In-memory (for demo purposes)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── lib/                 # Utilities, GraphQL, database
└── types.ts            # TypeScript definitions
```

Built as part of a take-home assignment demonstrating modern web development practices with focus on code quality, maintainability, and user experience.
