import axios from "axios";

const API = "http://localhost:5000/api/comments";

export const getComments = async (postId) => {
  return await axios.get(`${API}/${postId}`);
};

export const addComment = async (postId, text, token) => {
  return await axios.post(
    API,
    { postId, text },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
