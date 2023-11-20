// This function handles HTTP requests with various options and error handling.
async function requestHandler(
  api, // The URL of the API to send the request to
  body = {}, // The request body, defaults to an empty object
  method = "GET", // The HTTP method, defaults to "GET"
  contentType = "application/json" // The content type, defaults to JSON
) {
  let requestOptions = {
    credentials: "include", // Include credentials (e.g., cookies) in the request
  };

  // Configure options based on the HTTP method and content type
  if (method !== "GET" && contentType === "application/json") {
    requestOptions = {
      method: method,
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": contentType,
      },
      body: JSON.stringify(body.req), // JSON-serialize the request body
    };
  }
  if (contentType === "multipart/form-data") {
    requestOptions = {
      method: method,
      credentials: "include",
      mode: "cors",
      body: body.req, // Use the provided request body
    };
  }

  try {
    const response = await fetch(api, requestOptions);

    if (!response.ok) {
      // Handle different error status codes here
      if (response.status === 403) {
        // Redirect to the Forbidden page if a 403 status code is received
        window.location.href = "/unauthorized";
      } else if (response.status === 500) {
        // Redirect to the Internal Server Error page if a 500 status code is received
        window.location.href = "/servererror";
      } else if (response.status === 401) {
        // Handle other specific error cases here, if needed
      } else {
        // Handle other error status codes here
        throw new Error("Something went wrong");
      }
    }

    // Parse the response body as JSON and return it
    const res = await response.json();
    return res;
  } catch (error) {
    // Handle network errors or other exceptions here
    throw new Error("Something went wrong");
  }
}

// Functions for common HTTP request methods using the requestHandler
export async function requestGet(api) {
  return requestHandler(api);
}

export async function requestPost(api, body, contentType) {
  return requestHandler(api, body, "POST", contentType);
}

export async function requestPut(api, body) {
  return requestHandler(api, { req: body }, "PUT");
}

export async function requestDelete(api, body) {
  return requestHandler(api, body, "DELETE");
}
