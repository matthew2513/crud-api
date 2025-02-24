import express from "express";
import axios from "axios";

const router = express.Router();
const API_URL = "https://jsonplaceholder.typicode.com/";

router.get("/", (req, res) => {
  res.render("index");
});

//read all posts
router.get("/posts", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}posts`);
    const data = response.data;

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching post:", error.message);

    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ message: "Post not found." });
      }
      return res.status(error.response.status).json({
        error: `API error: ${error.response.statusText}`,
      });
    } else if (error.request) {
      return res
        .status(500)
        .json({ error: "No response from API. Please try again later." });
    } else {
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
});

//read a post
router.get("/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(404).json({ message: "Invalid post ID." });
  }

  try {
    const response = await axios.get(`${API_URL}posts/${id}`);
    const data = response.data;

    if (!data || Object.keys(data).length === 0) {
      return res.status(404).json({ message: "Post not found." });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching post:", error.message);

    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ message: "Post not found." });
      }
      return res.status(error.response.status).json({
        error: `API error: ${error.response.statusText}`,
      });
    } else if (error.request) {
      return res
        .status(500)
        .json({ error: "No response from API. Please try again later." });
    } else {
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
});

//create a post
router.post("/submit", async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required." });
  }

  try {
    const response = await axios.post(
      `${API_URL}posts`,
      { title, body },
      { headers: { "Content-Type": "application/json; charset=UTF-8" } }
    );

    const data = response.data;

    return res.status(201).json(data);
  } catch (error) {
    console.error("Error submitting post:", error.message);

    return res.status(500).json({
      error: "An error occurred while submitting the post.",
    });
  }
});

//update posts
router.put("/posts/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, body } = req.body;

  if (isNaN(id) || id <= 0) {
    return res.status(404).json({ message: "Invalid post ID." });
  }

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required." });
  }

  try {
    const response = await axios.put(
      `${API_URL}posts/${id}`,
      { title, body },
      { headers: { "Content-type": "application/json; charset=UTF-8" } }
    );
    const data = response.data;

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error submitting post:", error.message);

    return res.status(error.response?.status || 500).json({
      error:
        error.response?.data?.message ||
        "An error occurred while updating the post.",
    });
  }
});

//using patch
router.patch("/posts/:id/edit", async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, body } = req.body;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid post ID." });
  }

  if (!title && !body) {
    return res
      .status(400)
      .json({ message: "At least one field (title or body) is required." });
  }

  try {
    const response = await axios.patch(
      `${API_URL}posts/${id}`,
      { title, body },
      { headers: { "Content-type": "application/json; charset=UTF-8" } }
    );
    const data = response.data;

    return res.status(200).json(data);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Post not found." });
    }

    console.error("Error updating post:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the post." });
  }
});

//delete a post
router.delete("/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(404).json({ message: "Invalid post ID." });
  }

  try {
    const response = await axios.get(`${API_URL}posts/${id}`);
    if (!response.data || Object.keys(response.data).length === 0) {
      return res.status(404).json({ message: "Post not found." });
    }

    await axios.delete(`${API_URL}posts/${id}`);

    return res.status(200).json({ message: `Post with ID ${id} deleted.` });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Post not found." });
    }

    console.error("Error deleting post:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the post." });
  }
});

export default router;
