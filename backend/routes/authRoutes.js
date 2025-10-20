import express from "express";
import { registerAdmin, login } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", login);
router.get("/verify", protect, (req, res) => {
  res.json({ 
    valid: true,
    role: req.user.role,
   });
});

export default router;
