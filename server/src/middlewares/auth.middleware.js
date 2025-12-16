import { getAuth } from "@clerk/express";

export const clerkAuth = (req, res, next) => {
  try {
    const auth = getAuth(req);
    

    if (!auth.isAuthenticated || !auth.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
        auth,
      });
    }

    req.clerk = auth;

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
