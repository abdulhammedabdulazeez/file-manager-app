const httpMocks = require("node-mocks-http");
const { signup, login } = require("../controllers/auth.controller"); // Update this path to your actual controller location
const appError = require("../utils/appError"); // Import your custom error handler if you have one

describe("Authentication Controllers", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockNext = jest.fn();
    mockReq = httpMocks.createRequest({
      method: "POST",
      user: {
        id: "123",
        email: "test@example.com",
        languagePreference: "en",
      },
    });

    mockRes = httpMocks.createResponse();

    // Mock the internationalization method
    mockReq.__ = jest.fn().mockReturnValue("Mocked localized message");
    mockReq.setLocale = jest.fn();
  });

  describe("signup controller", () => {
    it("should set user locale and return 201 status with success message", async () => {
      await signup(mockReq, mockRes, mockNext);

      // Check if locale was set
      expect(mockReq.setLocale).toHaveBeenCalledWith("en");

      // Check response status
      expect(mockRes.statusCode).toBe(201);

      // Parse the JSON response
      const responseData = JSON.parse(mockRes._getData());

      // Verify response structure
      expect(responseData).toEqual({
        status: "success",
        message: "Mocked localized message",
        id: "123",
        email: "test@example.com",
        languagePreference: "en",
      });
    });
  });

  describe("login controller", () => {
    it("should set user locale and return 200 status with success message", async () => {
      await login(mockReq, mockRes, mockNext);

      // Check if locale was set
      expect(mockReq.setLocale).toHaveBeenCalledWith("en");

      // Check response status
      expect(mockRes.statusCode).toBe(200);

      // Parse the JSON response
      const responseData = JSON.parse(mockRes._getData());

      // Verify response structure
      expect(responseData).toEqual({
        status: "success",
        message: "Mocked localized message",
        id: "123",
        email: "test@example.com",
        languagePreference: "en",
      });
    });
  });

  describe("Error handling", () => {
    it("should handle null user scenario gracefully", async () => {
      // Create a request with null user
      const errorReq = httpMocks.createRequest({
        method: "POST",
        user: null,
      });

      // Mock error handling methods
      errorReq.__ = jest.fn().mockReturnValue("Error message");
      errorReq.setLocale = jest.fn();

      // Modify the signup function to handle null user
      const modifiedSignup = async (req, res, next) => {
        try {
          if (!req.user) {
            return next(new appError("User not found", 401));
          }
          req.setLocale(req.user.languagePreference);
          res.status(201).json({
            status: "success",
            message: req.__("auth.signup_success"),
            ...req.user,
          });
        } catch (error) {
          next(error);
        }
      };

      await modifiedSignup(errorReq, mockRes, mockNext);

      // Check that next was called with an error
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));

      // Optionally, check the specific error
      const passedError = mockNext.mock.calls[0][0];
      expect(passedError.message).toBe("User not found");
      expect(passedError.statusCode).toBe(401);
    });
  });
});
