import { Router } from "express";
import jobDescriptionRouter from "./modules/jobDescription/jobDescription.routes.js";
import resumesRouter from "./modules/uploadResumes/resumes.routes.js";
import analysisResultRouter from "./modules/analysisResult/result.routes.js";
import dashboardRouter from "./modules/dashboard/dashboard.routes.js";

const router = Router();

router.use("/job-descriptions", jobDescriptionRouter);
router.use("/resumes", resumesRouter);
router.use("/analyze", analysisResultRouter);
router.use("/dashboard", dashboardRouter);

export default router;
