// Response utility functions for consistent API responses

export const successResponse = (data, message = "Success", status = 200) => {
  return new Response(JSON.stringify({ success: true, data, message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

export const errorResponse = (message = "Server error", status = 500, error = null) => {
  return new Response(
    JSON.stringify({ 
      success: false, 
      message, 
      ...(error && { error: error.message || error }) 
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
};
