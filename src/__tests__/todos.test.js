import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodosPage from "@/app/todos/page";
import EditTodoPage from "@/app/todos/[id]/edit/page";

describe("Todos", () => {
  describe("Todos Page", () => {
    it("renders todos list and add todo form", async () => {
      render(<TodosPage />);

      // Check if loading state is shown initially
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Wait for todos to load
      await waitFor(() => {
        expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
        expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
      });

      // Check if add todo form is present
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /add todo/i }),
      ).toBeInTheDocument();
    });

    it("adds a new todo", async () => {
      render(<TodosPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      });

      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole("button", { name: /add todo/i });

      fireEvent.change(titleInput, {
        target: { value: "New Todo" },
      });
      fireEvent.change(descriptionInput, {
        target: { value: "New Description" },
      });

      fireEvent.click(submitButton);

      // Check if form is disabled during submission
      expect(submitButton).toBeDisabled();
      expect(titleInput).toBeDisabled();
      expect(descriptionInput).toBeDisabled();

      // Wait for the new todo to appear
      await waitFor(() => {
        expect(screen.getByText("New Todo")).toBeInTheDocument();
        expect(screen.getByText("New Description")).toBeInTheDocument();
      });
    });

    it("toggles todo completion", async () => {
      render(<TodosPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      });

      const checkbox = screen.getByRole("checkbox", { name: /todo-1/i });
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);

      // Check if checkbox is disabled during toggle
      expect(checkbox).toBeDisabled();

      // Wait for the todo to be updated
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });

    it("deletes a todo", async () => {
      render(<TodosPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", { name: /delete/i });

      // Mock confirm dialog
      window.confirm = jest.fn(() => true);

      fireEvent.click(deleteButton);

      // Check if delete button is disabled during deletion
      expect(deleteButton).toBeDisabled();

      // Wait for the todo to be removed
      await waitFor(() => {
        expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
      });
    });

    it("navigates to edit todo page", async () => {
      const mockRouter = {
        push: jest.fn(),
      };
      jest
        .spyOn(require("next/navigation"), "useRouter")
        .mockImplementation(() => mockRouter);

      render(<TodosPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      });

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      expect(mockRouter.push).toHaveBeenCalledWith("/todos/1/edit");
    });
  });

  describe("Edit Todo Page", () => {
    it("renders edit todo form with todo data", async () => {
      render(<EditTodoPage params={{ id: "1" }} />);

      // Check if loading state is shown initially
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Wait for todo to load
      await waitFor(() => {
        expect(screen.getByLabelText(/title/i)).toHaveValue("Test Todo 1");
        expect(screen.getByLabelText(/description/i)).toHaveValue(
          "Test Description 1",
        );
        expect(
          screen.getByRole("checkbox", { name: /mark as completed/i }),
        ).not.toBeChecked();
      });
    });

    it("updates todo", async () => {
      const mockRouter = {
        push: jest.fn(),
      };
      jest
        .spyOn(require("next/navigation"), "useRouter")
        .mockImplementation(() => mockRouter);

      render(<EditTodoPage params={{ id: "1" }} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/title/i)).toHaveValue("Test Todo 1");
      });

      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const checkbox = screen.getByRole("checkbox", {
        name: /mark as completed/i,
      });
      const saveButton = screen.getByRole("button", { name: /save changes/i });

      fireEvent.change(titleInput, {
        target: { value: "Updated Todo" },
      });
      fireEvent.change(descriptionInput, {
        target: { value: "Updated Description" },
      });
      fireEvent.click(checkbox);

      // Check if form is disabled during submission
      expect(saveButton).toBeDisabled();
      expect(titleInput).toBeDisabled();
      expect(descriptionInput).toBeDisabled();
      expect(checkbox).toBeDisabled();

      fireEvent.click(saveButton);

      // Wait for navigation
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/todos");
      });
    });

    it("handles navigation back to todos list", async () => {
      const mockRouter = {
        push: jest.fn(),
      };
      jest
        .spyOn(require("next/navigation"), "useRouter")
        .mockImplementation(() => mockRouter);

      render(<EditTodoPage params={{ id: "1" }} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/title/i)).toHaveValue("Test Todo 1");
      });

      const backButton = screen.getByRole("button", { name: /back/i });
      fireEvent.click(backButton);

      expect(mockRouter.push).toHaveBeenCalledWith("/todos");
    });

    it("handles non-existent todo", async () => {
      render(<EditTodoPage params={{ id: "999" }} />);

      await waitFor(() => {
        expect(screen.getByText(/todo not found/i)).toBeInTheDocument();
      });
    });
  });
});
