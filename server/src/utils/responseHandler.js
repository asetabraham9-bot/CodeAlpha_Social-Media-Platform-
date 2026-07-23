export const successResponse = (res, statusCode, message, data = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

export const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};
