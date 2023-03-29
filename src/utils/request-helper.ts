export namespace RequestHelper {
  export let token = "";

  export const setToken = (newToken = "") => {
    token = newToken;
  };

  export const doRequest = async <T>(
    uri: string,
    method: RequestInit["method"],
    data?: Record<string, T>
  ) => {
    const response = await fetch(uri, {
      method: method,
      body: data ? JSON.stringify(data) : "",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    return response;
  };
}
