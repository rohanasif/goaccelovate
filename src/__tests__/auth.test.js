import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";
import Register from "@/app/auth/register/page";
import SignIn from "@/app/auth/signin/page";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe("Authentication", () => {
  describe("Register Page", () => {
    it("renders register form", () => {
      render(<Register />);
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create account/i }),
      ).toBeInTheDocument();
    });

    it("handles successful registration", async () => {
      render(<Register />);

      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "password123" },
      });

      fireEvent.click(screen.getByRole("button", { name: /create account/i }));

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith("credentials", {
          email: "test@example.com",
          password: "password123",
          redirect: false,
        });
      });
    });

    it("handles registration error", async () => {
      render(<Register />);

      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: "existing@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "password123" },
      });

      fireEvent.click(screen.getByRole("button", { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });

    it("disables form during submission", async () => {
      render(<Register />);

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(nameInput, {
        target: { value: "Test User" },
      });
      fireEvent.change(emailInput, {
        target: { value: "test@example.com" },
      });
      fireEvent.change(passwordInput, {
        target: { value: "password123" },
      });

      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(nameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
    });
  });

  describe("Sign In Page", () => {
    it("renders sign in form", () => {
      render(<SignIn />);
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign in/i }),
      ).toBeInTheDocument();
    });

    it("handles successful sign in", async () => {
      render(<SignIn />);

      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "password123" },
      });

      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith("credentials", {
          email: "test@example.com",
          password: "password123",
          redirect: false,
        });
      });
    });

    it("handles sign in error", async () => {
      signIn.mockResolvedValueOnce({ error: "Invalid credentials" });
      render(<SignIn />);

      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: "wrong@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "wrongpassword" },
      });

      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it("disables form during submission", async () => {
      render(<SignIn />);

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, {
        target: { value: "test@example.com" },
      });
      fireEvent.change(passwordInput, {
        target: { value: "password123" },
      });

      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
    });
  });
});
