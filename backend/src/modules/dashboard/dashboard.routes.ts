import { Router } from "express";
import * as dashboardController from "./dashboard.controller.js"
import { verifyJWT } from "../../middleware/auth.middleware.js";

const router = Router()

router.use(verifyJWT)
router.route("/counts").get(dashboardController.getDashboardCounts);
router.route("/latest-results").get(dashboardController.getLatestFiveResult)

export default router;