# Todo Application

A full-stack todo application built with Next.js, PostgreSQL, and NextAuth.js. The application features user authentication, CRUD operations for todos, and a modern UI using Tailwind CSS and shadcn/ui components.

## Features

### Authentication

- Email/Password authentication
- Google OAuth integration
- Protected routes
- Session management
- Automatic redirection to sign-in for unauthenticated users

### Todo Management

- Create new todos with title and description
- Edit existing todos
- Mark todos as complete/incomplete
- Delete todos
- Real-time updates
- Responsive design

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **ORM**: Prisma

## API Endpoints

### Authentication

- `POST /api/auth/register`
  - Register a new user
  - Body: `{ name, email, password }`
  - Returns: User object or error message

### Todos

- `GET /api/todos`

  - Get all todos for the authenticated user
  - Returns: Array of todo objects

- `POST /api/todos`

  - Create a new todo
  - Body: `{ title, description }`
  - Returns: Created todo object

- `GET /api/todos/[id]`

  - Get a specific todo
  - Returns: Todo object

- `PUT /api/todos/[id]`

  - Update a todo
  - Body: `{ title, description, completed }`
  - Returns: Updated todo object

- `DELETE /api/todos/[id]`
  - Delete a todo
  - Returns: Success message

## Database Schema

### User

```sql
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT NOT NULL,
  "password" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
```

### Todo

```sql
CREATE TABLE "Todo" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/todo_db"
   NEXTAUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Performance Analysis

### API Response Times

- Authentication: ~100-200ms
- Todo CRUD operations: ~50-150ms
- Todo listing: ~100-300ms (depending on number of todos)

### Time Complexity

- Todo Creation: O(1)
- Todo Deletion: O(1)
- Todo Update: O(1)
- Todo Listing: O(n) where n is the number of todos
- Todo Search: O(n) where n is the number of todos

### Assumptions

1. Users will have a reasonable number of todos (less than 1000)
2. Authentication state is maintained via sessions
3. Database indexes are properly set up for common queries
4. Network latency is minimal and consistent
5. User input is properly sanitized and validated

## Critical Functionalities Analysis

### 1. Todo Creation (O(1))

```javascript
const handleSubmit = async (e) => {
  // Single database insert operation
  const response = await fetch("/api/todos", {
    method: "POST",
    body: JSON.stringify(newTodo),
  });
};
```

- Time Complexity: O(1)
- Assumptions:
  - Database is properly indexed
  - Network latency is constant
  - Input validation is O(1)

### 2. Todo Deletion (O(1))

```javascript
const handleDelete = async (todoId) => {
  // Single database delete operation
  const response = await fetch(`/api/todos/${todoId}`, {
    method: "DELETE",
  });
};
```

- Time Complexity: O(1)
- Assumptions:
  - Primary key lookup is O(1)
  - Cascade delete operations are optimized

### 3. Todo Update (O(1))

```javascript
const handleSubmit = async (e) => {
  // Single database update operation
  const response = await fetch(`/api/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify(todo),
  });
};
```

- Time Complexity: O(1)
- Assumptions:
  - Primary key lookup is O(1)
  - Update operation is atomic

### 4. Todo Listing (O(n))

```javascript
const fetchTodos = async () => {
  // Fetches all todos for the user
  const response = await fetch("/api/todos");
  const data = await response.json();
  setTodos(data);
};
```

- Time Complexity: O(n) where n is the number of todos
- Assumptions:
  - Database query is optimized with proper indexes
  - Network bandwidth is sufficient for data transfer

### 5. Authentication (O(1))

```javascript
const handleSubmit = async (e) => {
  // Single database lookup operation
  const response = await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: false,
  });
};
```

- Time Complexity: O(1)
- Assumptions:
  - Email lookup is indexed
  - Password hashing is optimized
  - Session creation is O(1)

### Development Assumptions

#### Database

- PostgreSQL is properly configured and optimized
- Indexes are created for frequently queried fields
- Connection pool is properly sized
- Database can handle concurrent connections

#### Authentication

- JWT tokens are used for session management
- Password hashing is done using bcrypt
- Session storage is properly configured
- Rate limiting is implemented

#### Frontend

- React state updates are batched
- Component re-renders are optimized
- Network requests are properly cached
- Error boundaries are implemented

#### API

- API routes are properly rate limited
- Input validation is performed
- Error handling is comprehensive
- CORS is properly configured

#### Performance

- Network latency is minimal
- Database queries are optimized
- Frontend bundle size is optimized
- Images and assets are properly cached

#### Security

- Input is properly sanitized
- XSS protection is implemented
- CSRF protection is in place
- Secure headers are configured

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are used for session management
- API routes are protected with authentication middleware
- Input validation and sanitization
- CORS protection
- Rate limiting on authentication endpoints

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
