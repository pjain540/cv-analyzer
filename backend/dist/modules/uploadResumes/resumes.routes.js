import { Router } from "express";
import { upload } from "../../middleware/multer.js";
import * as resumeController from "./resumes.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
const router = Router();
router.use(verifyJWT);
// 'resume' is the key, max 10 files at once
router.post("/upload", upload.array("resume", 10), resumeController.uploadResumes);
router.get("/", resumeController.getAllResumes);
router.get("/:id", resumeController.getResumeById);
router.delete("/delete/:id", resumeController.deleteResume);
export default router;
//# sourceMappingURL=resumes.routes.js.map