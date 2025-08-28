# Event Manager - Setup Instructions

This is a Mini Event Manager built with Next.js 15, TypeScript, GraphQL, and TailwindCSS.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## Installation

You can run this application in two ways: **Docker** (recommended) or **Local Development**.

### Option 1: Docker Installation (Recommended)

1. **Install Docker Desktop** (if not already installed):

   - Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
   - Install and restart your computer if prompted
   - Start Docker Desktop and wait for it to be ready

2. **Clone the repository** (if from GitHub):

   ```bash
   git clone https://github.com/iamsubendu/EventManager.git
   cd EventManager
   ```

   Or if you have the zip file, extract it and navigate to the `EventManager` directory.

3. **Ensure Docker Desktop is running**:

   ```bash
   # Verify Docker is ready
   docker --version
   docker ps
   ```

4. **Start with Docker Compose**:

   ```bash
   # Build and run the application
   docker-compose up --build
   ```

   The application will be available at `http://localhost:3000`

5. **Stop the application**:

   ```bash
   docker-compose down
   ```

### Option 2: Local Development Installation

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

### Docker Deployment (Recommended)

The application includes Docker configuration for containerized deployment. All Docker files are located in the root directory.

#### Prerequisites for Docker

- **Docker Desktop** (version 20.0 or higher) - Download from [docker.com](https://www.docker.com/products/docker-desktop/)
- **Docker Compose** (included with Docker Desktop)

**IMPORTANT**: Before running any Docker commands, ensure Docker Desktop is running:

1. **Start Docker Desktop**:

   - **Windows**: Search "Docker Desktop" in Start Menu and open it
   - **Mac**: Open Docker Desktop from Applications
   - **Linux**: Start Docker service: `sudo systemctl start docker`

2. **Wait for Docker to be ready**:

   - Look for whale icon in system tray (Windows/Mac)
   - Wait for "Docker Desktop is running" message
   - This can take 1-2 minutes on first startup

3. **Verify Docker is running**:

   ```bash
   docker --version
   docker-compose --version
   docker ps  # Should show running containers (may be empty)
   ```

4. **Test Docker works** (optional):
   ```bash
   docker run hello-world
   ```

#### Quick Start with Docker

1. **Navigate to the root directory** (EventManager/):

   ```bash
   cd EventManager
   ```

   ⚠️ **IMPORTANT**: You must be in the ROOT `EventManager/` directory, NOT the `event-manager/` subdirectory!

2. **Verify you're in the correct directory**:

   ```bash
   # Check current directory contents - you should see:
   ls -la
   # Expected: Dockerfile, docker-compose.yml, event-manager/ folder, README.md, etc.

   # If you see src/ folder instead, you're in the wrong directory:
   cd ..  # Go up one level to the root
   ```

3. **Ensure Docker Desktop is running** (CRITICAL STEP):

   ```bash
   # Check if Docker is running - this should work without errors:
   docker ps

   # If you get connection errors, start Docker Desktop and wait
   ```

4. **Build and run with Docker Compose**:

   ```bash
   docker-compose up --build
   ```

   The application will be available at `http://localhost:3000`

5. **Stop the application**:
   ```bash
   docker-compose down
   ```

#### Manual Docker Commands

If you prefer using Docker directly:

```bash
# Build the Docker image
docker build -t event-manager .

# Run the container
docker run -p 3000:3000 event-manager

# Run in background with restart policy
docker run -d -p 3000:3000 --restart unless-stopped --name event-manager event-manager

# Stop and remove the container
docker stop event-manager
docker rm event-manager
```

#### Docker Development Workflow

1. **Development with live reload** (run from EventManager/ root):

   ```bash
   # Start the container in detached mode
   docker-compose up -d --build

   # View logs
   docker-compose logs -f

   # Make changes to code (container will auto-restart)

   # Rebuild after major changes
   docker-compose down
   docker-compose up --build
   ```

2. **Health check monitoring**:

   ```bash
   # Check container health
   docker-compose ps

   # Test health endpoint directly
   curl http://localhost:3000/api/health
   ```

3. **Container management**:

   ```bash
   # View running containers
   docker ps

   # Access container shell
   docker exec -it eventmanager-event-manager-1 sh

   # View container logs
   docker logs eventmanager-event-manager-1
   ```

#### Production Docker Deployment

For production environments:

```bash
# Build optimized production image
docker build -t event-manager:production .

# Run with production settings
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  --restart unless-stopped \
  --name event-manager-prod \
  event-manager:production
```

#### Docker Features

- **Multi-stage build** for optimized image size (~100MB)
- **Non-root user** (nextjs:nodejs) for security
- **Health checks** at `/api/health` endpoint
- **Standalone Next.js output** for better performance
- **Auto-restart** policy for high availability
- **Environment variable** configuration

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

### Docker Issues

1. **Wrong directory error** (Most Common):

   ```bash
   # ERROR: You're running from event-manager/ instead of EventManager/
   # SOLUTION: Navigate to root directory
   cd ..
   ls -la  # Should see: Dockerfile, docker-compose.yml, event-manager/
   docker-compose up --build
   ```

2. **Docker daemon not running** (Your current issue):

   ```bash
   # WINDOWS: Start Docker Desktop application
   # - Open Docker Desktop from Start Menu
   # - Wait for Docker to fully start (whale icon in system tray)
   # - Look for "Docker Desktop is running" message

   # LINUX: Start Docker service
   sudo systemctl start docker

   # Verify Docker is running
   docker --version
   docker ps

   # If Docker Desktop is starting, wait and try again:
   docker-compose up --build
   ```

3. **Port 3000 already in use (Docker)**:

   ```bash
   # Use a different port
   docker run -p 3001:3000 event-manager

   # Or modify docker-compose.yml
   ports:
     - "3001:3000"
   ```

4. **Docker build failures**:

   ```bash
   # Clean Docker cache
   docker system prune -a

   # Rebuild without cache
   docker build --no-cache -t event-manager .

   # If you get Apollo Client/React compatibility errors:
   cd event-manager
   npm install @apollo/client@3.11.8 rxjs --legacy-peer-deps
   cd ..
   docker-compose up --build
   ```

5. **Container health check failures**:

   ```bash
   # Check container logs
   docker-compose logs event-manager

   # Test health endpoint manually
   curl http://localhost:3000/api/health
   ```

6. **Permission denied errors (Linux)**:
   ```bash
   # Add user to docker group
   sudo usermod -aG docker $USER
   # Log out and back in
   ```

### Local Development Issues

1. **Port 3000 already in use**:

   ```bash
   # Use a different port
   npm run dev -- -p 3001
   ```

2. **Module not found errors**:

   ```bash
   # Clear node_modules and reinstall (from event-manager/ directory)
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**:

   ```bash
   # Run type checking (from event-manager/ directory)
   npx tsc --noEmit
   ```

4. **Build failures**:
   ```bash
   # Clear Next.js cache (from event-manager/ directory)
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

- **Docker** (containerized deployment)
- **Vercel** (recommended for Next.js applications)
- **Netlify**
- **Railway**
- **Any Node.js hosting platform**
- **Kubernetes** (using the provided Docker image)

### Docker Deployment Options

1. **Local Docker**:

   ```bash
   docker build -t event-manager .
   docker run -p 3000:3000 event-manager
   ```

2. **Docker Compose** (recommended):

   ```bash
   docker-compose up -d --build
   ```

3. **Production Docker with custom settings**:
   ```bash
   docker run -p 3000:3000 \
     -e NODE_ENV=production \
     -e NEXT_TELEMETRY_DISABLED=1 \
     --restart unless-stopped \
     event-manager
   ```

### Container Features

- **Health checks** at `/api/health`
- **Non-root user** for security
- **Optimized image size** with multi-stage build
- **Standalone Next.js output** for better performance

For production deployment, consider:

1. Setting up environment variables
2. Replacing the in-memory database with a persistent solution
3. Configuring error tracking and monitoring
4. Setting up CI/CD pipelines
5. Using container orchestration (Docker Swarm, Kubernetes)

## Support

If you encounter any issues during setup or development, please refer to:

- **NOTES.md** for implementation details and assumptions
- **ENTITIES.md** for data model documentation
- Next.js documentation: https://nextjs.org/docs
- Apollo GraphQL documentation: https://www.apollographql.com/docs/
