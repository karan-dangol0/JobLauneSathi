import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; 
import upload from "./../middlewares/upload.middlware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

router.post("/upload-image", upload.single("image"), (req, res) => {
  console.log(req.file, req.body);
  if (!req.file) {
    return res.status(200).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

export default router;
