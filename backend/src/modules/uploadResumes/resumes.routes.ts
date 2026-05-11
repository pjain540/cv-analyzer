import { Router } from "express";
import { upload } from "../../middleware/multer.js";
import * as resumeController from "./resumes.controller.js";

const router = Router();

// 'resume' is the key, max 10 files at once
router.post("/upload", upload.array("resume", 10), resumeController.uploadResumes);
router.get("/", resumeController.getAllResumes);
router.get("/:id", resumeController.getResumeById);
router.delete("/delete/:id", resumeController.deleteResume);

export default router;
