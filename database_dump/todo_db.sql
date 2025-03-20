-- Create database
CREATE DATABASE todo_db;
\c todo_db;

-- Create User table
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT NOT NULL,
  "password" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create Todo table
CREATE TABLE "Todo" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "Todo_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes
CREATE INDEX "Todo_userId_idx" ON "Todo"("userId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Insert sample data
INSERT INTO "User" ("id", "name", "email", "password", "createdAt", "updatedAt")
VALUES
  ('clh1234567890', 'John Doe', 'john@example.com', '$2b$10$YourHashedPasswordHere', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('clh1234567891', 'Jane Smith', 'jane@example.com', '$2b$10$YourHashedPasswordHere', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Todo" ("id", "title", "description", "completed", "createdAt", "updatedAt", "userId")
VALUES
  ('clt1234567890', 'Complete project documentation', 'Write comprehensive documentation for the todo application', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'clh1234567890'),
  ('clt1234567891', 'Review code', 'Review and refactor the authentication flow', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'clh1234567890'),
  ('clt1234567892', 'Plan next sprint', 'Create tasks for the next development sprint', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'clh1234567891');