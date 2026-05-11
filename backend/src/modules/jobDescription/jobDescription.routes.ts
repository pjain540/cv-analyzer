import { Router } from "express";
import * as jobDescriptionController from "./jobDescription.controllers.js";

const router = Router();

router.route("/create").post(jobDescriptionController.createJobDescription);
router.route("/").get(jobDescriptionController.getAllJobDescriptions);
router.route("/:id").get(jobDescriptionController.getJobDescriptionById);
router.route("/update/:id").patch(jobDescriptionController.updateJobDescription);
router.route("/delete/:id").delete(jobDescriptionController.deleteJobDescription);

export default router;
