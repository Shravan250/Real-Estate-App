import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};

export const listPageLoader = async ({ request, params }) => {
  try {
    const url = new URL(request.url);
    const query = url.search;
    const postPromise = apiRequest(`/posts${query}`);
    return defer({
      postResponse: postPromise,
    });
  } catch (error) {
    console.error("Loader failed:", error);
    throw error; // Ensure errors are handled in the component
  }
};

export const profilePageLoader = async ({ request, params }) => {
  const postPromise = apiRequest("/users/profilePosts");
  const chatPromise = apiRequest("/chats");
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};
