import { setupServer } from "msw/node";
import { rest } from "msw";

// Mock data
const mockTodos = [
  {
    id: "1",
    title: "Test Todo 1",
    description: "Test Description 1",
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Test Todo 2",
    description: "Test Description 2",
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const handlers = [
  // Auth endpoints
  rest.post("/api/auth/register", async (req, res, ctx) => {
    const { email, password, name } = await req.json();
    if (email === "existing@example.com") {
      return res(
        ctx.status(400),
        ctx.json({ message: "Email already exists" }),
      );
    }
    return res(
      ctx.status(201),
      ctx.json({
        id: "1",
        email,
        name,
      }),
    );
  }),

  // Todos endpoints
  rest.get("/api/todos", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTodos));
  }),

  rest.post("/api/todos", async (req, res, ctx) => {
    const { title, description } = await req.json();
    const newTodo = {
      id: "3",
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return res(ctx.status(201), ctx.json(newTodo));
  }),

  rest.get("/api/todos/:id", (req, res, ctx) => {
    const { id } = req.params;
    const todo = mockTodos.find((t) => t.id === id);
    if (!todo) {
      return res(ctx.status(404), ctx.json({ message: "Todo not found" }));
    }
    return res(ctx.status(200), ctx.json(todo));
  }),

  rest.put("/api/todos/:id", async (req, res, ctx) => {
    const { id } = req.params;
    const updates = await req.json();
    const todo = mockTodos.find((t) => t.id === id);
    if (!todo) {
      return res(ctx.status(404), ctx.json({ message: "Todo not found" }));
    }
    const updatedTodo = { ...todo, ...updates };
    return res(ctx.status(200), ctx.json(updatedTodo));
  }),

  rest.delete("/api/todos/:id", (req, res, ctx) => {
    const { id } = req.params;
    const todo = mockTodos.find((t) => t.id === id);
    if (!todo) {
      return res(ctx.status(404), ctx.json({ message: "Todo not found" }));
    }
    return res(ctx.status(204));
  }),
];

export const server = setupServer(...handlers);
