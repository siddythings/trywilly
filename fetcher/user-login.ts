import apiInstance from "@/api/api-instance";

export const userSignUp = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const response = await apiInstance({
      url: "/auth/register",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { email, password, name },
    });

    return response.data;
  } catch (e: any) {
    // handle error
    if (e.response && e.response.data) {
      throw new Error(e.response.data.error.message); // Throw the specific error message from the API
    }
    // Fallback to a generic error message if no specific message exists
    throw new Error(e.response?.statusText || "Something went wrong");
  }
};

export const userLogin = async (email: string, password: string) => {
  try {
    const response = await apiInstance({
      url: "/api/v1/auth/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { email, password },
    });

    return response.data;
  } catch (e: any) {
    // Ensure we get the exact message from the API
    if (e.response && e.response.data) {
      throw new Error(e.response.data.error.message); // Throw the specific error message from the API
    }
    // Fallback to a generic error message if no specific message exists
    throw new Error(e.response?.statusText || "Something went wrong");
  }
};

export const googleLogin = async (data: any) => {
  try {
    const response = await apiInstance({
      url: "/api/v1/auth/google-login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { ...data },
    });

    return response.data;
  } catch (e: any) {
    // Ensure we get the exact message from the API
    if (e.response && e.response.data) {
      throw new Error(e.response.data.error.message); // Throw the specific error message from the API
    }
    // Fallback to a generic error message if no specific message exists
    throw new Error(e.response?.statusText || "Something went wrong");
  }
};

export const getUserInfo = async () => {
  try {
    const response = await apiInstance({
      url: "/auth/user-info",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const logout = async () => {
  try {
    // let response = await apiInstance({
    //   url: "/auth/logout",
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // Clear local storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    
    // return response.data;
  } catch (e: any) {
    // Even if the API call fails, we should still clear local storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    
    if (e.response && e.response.data) {
      throw new Error(e.response.data.error.message);
    }
    throw new Error(e.response?.statusText || "Something went wrong");
  }
};

export const duplicateAgent = async (agent: any) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await apiInstance({
      url: "/api/v1/ai-agents/duplicate",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      data: { ...agent },
    });

    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.statusText || "Something went wrong");
  }
};