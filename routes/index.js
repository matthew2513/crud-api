import express from "express";
import axios from "axios";

const router = express.Router();
const API_URL = "https://jsonplaceholder.typicode.com/";

router.get("/", (req, res) => {
  res.render("index");
});

export default router;
