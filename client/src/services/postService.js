import axios from "axios";

const API = "http://localhost:5000/api/posts";

export const getPosts = async () => {
  return await axios.get(API);
};

export const createPost = async (data, token) => {
  return await axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const likePost = async (postId, token) => {
  return await axios.put(`${API}/like/${postId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updatePost = async (postId, caption, token) => {
  return await axios.put(`${API}/${postId}`, 
    { content: caption },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deletePost = async (postId, token) => {
  return await axios.delete(`${API}/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};