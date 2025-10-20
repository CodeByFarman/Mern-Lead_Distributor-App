import express from "express";
import multer from "multer";
import { uploadFile, getDistributedLists } from "../controllers/uploadController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { getMyLeads } from "../controllers/agentController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", protect, authorizeRoles("admin"),upload.single("file"), uploadFile);

router.get("/lists", protect, authorizeRoles("admin"), getDistributedLists);

// Agent-only routes
router.get("/my-leads", protect, authorizeRoles("agent"), getMyLeads);


export default router;
