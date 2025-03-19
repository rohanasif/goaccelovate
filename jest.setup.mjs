import "@testing-library/jest-dom";

// Optional: Add custom matchers
expect.extend({
  toHaveBeenCalledWithMatch(received, ...expected) {
    const pass = received.mock.calls.some((call) =>
      expected.every((arg, index) => {
        if (typeof arg === "object") {
          return expect.objectContaining(arg).asymmetricMatch(call[index]);
        }
        return arg === call[index];
      }),
    );

    if (pass) {
      return {
        message: () =>
          `expected ${received.getMockName()} not to have been called with matching arguments`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received.getMockName()} to have been called with matching arguments`,
        pass: false,
      };
    }
  },
});
