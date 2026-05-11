import { Router } from "express";
import * as dashboardController from "./dashboard.controller.js"

const router = Router()

router.route("/counts").get(dashboardController.getDashboardCounts);
router.route("/latest-results").get(dashboardController.getLatestFiveResult)

export default router;