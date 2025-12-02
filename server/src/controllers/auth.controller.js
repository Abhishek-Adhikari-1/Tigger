export const loginController = (req, res) => {
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
  });
};
