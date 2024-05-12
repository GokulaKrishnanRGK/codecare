jest.mock("@clerk/express", () => {
  return {
    clerkMiddleware: () => (req, _res, next) => {
      if (req.__testClerkUserId) {
        req.auth = {userId: req.__testClerkUserId};
      }
      next();
    },
    getAuth: (req) => {
      return req.__testClerkUserId ? {userId: req.__testClerkUserId}
          : {userId: null};
    },
  };
});
