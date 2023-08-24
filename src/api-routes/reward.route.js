import express from "express";
const routes = express.Router();
import { check, query } from "express-validator";

import {
  // rewardRedemption,
  addGoalOfGoodSites,
  updateSpendingTime,
  // getMygoalDetails,
  addProductiveSite,
  addBlockedSite,
  getProductiveSites,
  getBlockedSites,
  deleteProductiveSite,
  deleteBlockSite,
  getZapierData,
  addRewardTime,
  getRewardData,
  updateRewardTime,
  getTrackingDataByUser,
  deleteGoalById,
  findIsGoalCompleted,
  findGoalByUserId,
  updateGoal,
  updateUtilizeTime
} from "../api/reward.js";
import { ValidationErrors } from "../helper/validationMiddleware.js";

// -----------------------------addRewards-------------------------------------------------------------------
routes.post(
  "/reward-redemption",
  [check("userId").not().isEmpty().withMessage("User is required")],
  ValidationErrors,
  // rewardRedemption
);

// ----------------------------addGoals-----------------------------------------------------------------------
routes.post(
  "/addGoals",
  [
    check("total_time_count")
      .not()
      .isEmpty()
      .withMessage("Please add goal time"),
  ],
  ValidationErrors,
  addGoalOfGoodSites
);
// ----------------------------deleteGoals-----------------------------------------------------------------------
routes.delete(
  "/deleteGoal/:goalId",
  [check("goalId").not().isEmpty().withMessage("Please add goal id")],
  ValidationErrors,
  deleteGoalById
);
// ----------------------------Goal Completed?-----------------------------------------------------------------------
routes.get(
  "/getGoal",
  [check("goalId").not().isEmpty().withMessage("Please add goal id")],
  ValidationErrors,
  findIsGoalCompleted
);
// ----------------------------Goal By UserId-----------------------------------------------------------------------
routes.get(
  "/getGoalUserId/:userId",
  [check("userId").not().isEmpty().withMessage("Please add user id")],
  ValidationErrors,
  findGoalByUserId
);
/* ---------------------------update goals----------------------------------------------------------------------------
get spent time of user and update it to database 
*/

routes.put(
  "/goal/update/:goalId",
  [
    query("goalId").exists().withMessage("Please add goal id"),
    check("spending_time")
      .not()
      .isEmpty()
      .withMessage("Please add spending time"),
  ],
  ValidationErrors,
  updateSpendingTime
);
routes.put(
  "/goal/updateGoal/:goalId",
  [check("goalId").not().isEmpty().withMessage("Please add goal id")],
  ValidationErrors,
  updateGoal
);

// routes.get(
//   "goal/:goalId",
//   [query("goalId").exists().withMessage("Please add goal id")],
//   ValidationErrors,
//   getMygoalDetails
// );

// --------------------------------------------------------------add productive sites--------------------------------------

routes.post(
  "/productive/site",
  [
    check("userId").not().isEmpty().withMessage("User is required"),
    check("site").not().isEmpty().withMessage("Please add minimum one site."),
    check("method").not().isEmail().withMessage("Please add difficulty method"),
  ],
  ValidationErrors,
  addProductiveSite
);

//------------------------------------------addBlockedSite---------------------------------------------------------------------
routes.post(
  "/block/site",
  [
    check("userId").not().isEmpty().withMessage("User is required"),
    check("site").not().isEmpty().withMessage("Please add minimum one site."),
  ],
  ValidationErrors,
  addBlockedSite
);

// ---------------------------------------getProductiveSites---------------------------------------------------------------------
routes.get(
  "/productive/sites/:userId",
  [check("userId").not().isEmpty().withMessage("User is required")],
  ValidationErrors,
  getProductiveSites
);

routes.get("/productive/sites", getProductiveSites);

// -----------------------------------------getBlockedSites----------------------------------------------------------------------
routes.get(
  "/block/sites/:userId",
  [check("userId").exists().withMessage("User is required")],
  ValidationErrors,
  getBlockedSites
);

// ------------------------------------------deleteProductiveSite-----------------------------------------------------------------
routes.delete(
  "/goodSite/:siteId",
  [check("siteId").exists().withMessage("Domain is required")],
  ValidationErrors,
  deleteProductiveSite
);

// ------------------------------------------deleteBlockSite-----------------------------------------------------------------------

routes.delete(
  "/blockSite/:siteId",
  [check("siteId").exists().withMessage("Domain is required")],
  ValidationErrors,
  deleteBlockSite
);

// --------------------------------------------getZapierData---------------------------------------------------------------------
routes.post("/zapier/data", getZapierData);

// ---------------------------------------------addRewardTime---------------------------------------------------------------------

routes.post(
  "/add/reward/:userId",
  [check("userId").exists().withMessage("User is required")],
  ValidationErrors,
  addRewardTime
);

// ----------------------------------------------------getRewardTime-------------------------------------------------------------------

routes.get(
  "/get/reward/:userId",
  [check("userId").exists().withMessage("User is required")],
  ValidationErrors,
  getRewardData
);

// ----------------------------------------------------updateRewardTime-------------------------------------------------------------------

routes.post(
  "/update/reward/:userId",
  [check("userId").exists().withMessage("userId is required")],
  ValidationErrors,
  updateRewardTime
);

routes.put(
  "/update/spentTime/:userId",
  [check("userId").exists().withMessage("User is required")],
  ValidationErrors,
  updateUtilizeTime
);

routes.get("/get/tracking/:userId", getTrackingDataByUser);

export default routes;
