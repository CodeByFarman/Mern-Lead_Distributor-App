import express from "express";
import { addAgent, deleteAgent, getAgents, } from "../controllers/agentController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), addAgent);
router.get("/", protect, authorizeRoles("admin"), getAgents);
router.delete("/:id", protect, authorizeRoles("admin"), deleteAgent);


export default router;
