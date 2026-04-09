export async function apiCall(url, options = {}, authContext = null) {
  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401) {
    const data = await response.json();
    if (data.code === "TOKEN_EXPIRED" && authContext) {
      const newToken = await authContext.refreshToken();
      if (newToken) {
        const headers = options.headers || {};
        headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });
      }
    }
  }
  return response;
}
