import { Router } from "express";
import * as resultController from "./result.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT)

router.route("/create").post(resultController.createAnalysis);
router.route("/").get(resultController.getAllAnalysis);
router.route("/:id")
    .get(resultController.getAnalysis)
    .delete(resultController.deleteAnalysis);

export default router;
