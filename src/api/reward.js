import {
  Rewards,
  Goals,
  ProductiveSite,
  BlockSite,
  ExceptionSite,
} from "../models/reward.js";
import { Activity } from "../models/zapierData.js";
import Users from "../models/user.js";

// ---------------------------------------------------------Add Productive sites----------------------------------------

export const addProductiveSite = async (req, res) => {
  const { userId, site, method, goalId } = req.body;
  try {
    const oldData = await ProductiveSite.find({ userId }).select("site");
    const blockSites = await BlockSite.find({ userId }).select("site");

    if (oldData.some((goodSite) => goodSite.site === site)) {
      return res.status(400).json({ msg: "Site is already exists" });
    } else if (blockSites.some((blockSite) => blockSite.site === site)) {
      return res
        .status(400)
        .json({ msg: "Site is already added in block data for the user" });
    }
    const addproductiveSite = new ProductiveSite({
      goalId,
      userId,
      site,
      method,
    });
    const result = await addproductiveSite.save();
    return res.status(201).json({ result, msg: "data added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ---------------------------------------------------------Add_block_sites---------------------------------------------

export const addBlockedSite = async (req, res) => {
  const { userId, site } = req.body;
  try {
    // Fetch existing blocked sites for the user
    const data = await BlockSite.find({ userId }).select("site");
    const goodSite = await ProductiveSite.find({ userId }).select("site");

    // Check if the site already exists
    if (data.some((blockedSite) => blockedSite.site === site)) {
      return res.status(400).json({ msg: "Site is already exists" });
    } else if (goodSite.some((productive) => productive.site === site)) {
      return res
        .status(400)
        .json({ msg: "Site is already added in goal data for the user" });
    }
    
    // If the site doesn't exist, create a new document
    const addproductiveSite = new BlockSite({
      userId,
      site,
    });
    const result = await addproductiveSite.save();
    return res.status(201).json({ result, msg: "Data added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// --------------------------------------------------------Get_All_Sites--------------------------------------------------

export const getProductiveSites = async (req, res) => {
  const { userId, goalId } = req.body; // Assuming the user ID is passed as a route parameter

  try {
    // Find domains by user ID
    const result = await ProductiveSite.find({ userId, goalId });

    if (result.length === 0) {
      return res.status(200).json({
        message: "No domains found for the specified user ID",
        data: [],
      });
    }

    res.status(200).json({ message: "Data found", data: result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//  Blocked
export const getBlockedSites = async (req, res) => {
  const userId = req.params.userId; // Assuming the user ID is passed as a route parameter

  try {
    // Find domains by user ID
    const result = await BlockSite.find({ userId });

    if (result.length === 0) {
      return res.status(200).json({
        message: "No domains found for the specified user ID",
        data: [],
      });
    }

    res.status(200).json({ message: "Data found", data: result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//----------------------------------------------------------Add_Goals---------------------------------------------------

export const addGoalOfGoodSites = async (req, res) => {
  const {
    domain,
    total_time_count,
    total_time_spent,
    is_goal_achieved,
    spending_time,
    userId,
    difficulty,
  } = req.body;
  // It will take domain total time count (which is target set by user) and total_time_spent and a bolean field which is for checking
  // if goal has been achieved
  try {
    const addGoals = new Goals({
      domain,
      total_time_count,
      total_time_spent,
      is_goal_achieved,
      userId,
      difficulty,
    });

    const result = await addGoals.save();
    return res.status(201).json({ result, msg: "Goals added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};
//----------------------------------------------------------Delete_Goals---------------------------------------------------

// its for reseting the goal.It will take goalid and delete that particular goal from goal collections
export const deleteGoalById = async (req, res) => {
  const { goalId } = req.params;
  try {
    const addGoals = await Goals.findByIdAndRemove(goalId);

    if (!addGoals) {
      return res.status(404).json({ msg: "Goal not found!" });
    }
    return res.json({ msg: "Goal Deleted Successfuly!" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
//----------------------------------------------------------find Goal Completion---------------------------------------------------

// it will check the boolean field if goal has been completed
export const findIsGoalCompleted = async (req, res) => {
  const { goalId } = req.body;
  try {
    const goal = await Goals.findById(goalId);

    const { is_goal_achieved } = goal;

    if (is_goal_achieved) {
      return res.json({ goal, msg: "Goal has been achieved" });
    } else {
      return res.json({ msg: "Goal has not been achieved yet" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
//----------------------------------------------------------find Goal By UserID---------------------------------------------------

// it will check the boolean field if goal has been completed
export const findGoalByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const goal = await Goals.find({ userId: userId, is_goal_achieved: false });

    if (goal.length > 0) {
      return res.json({ goal, msg: "Goal Found!" });
    } else {
      return res.json({ goal: {}, msg: "Goal Not Found!" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ---------------------------------------------update Spending Time----------------------------------------------------

export const updateSpendingTime = async (req, res) => {
  const { goalId } = req.params;
  const { newSpendingTime } = req.body;

  try {
    const updatedGoal = await Goals.findByIdAndUpdate(
      goalId,
      { spending_time: newSpendingTime },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ msg: "Goal not found" });
    }
    return res
      .status(200)
      .json({ result: updatedGoal, msg: "Spending time updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
export const updateGoal = async (req, res) => {
  const goalId = req.params.goalId;
  const { ...updates } = req.body;

  try {
    const updatedGoal = await Goals.findByIdAndUpdate(goalId, updates, {
      new: true,
    });

    if (!updatedGoal) {
      return res.status(404).json({ msg: "Goal not found" });
    }

    return res
      .status(200)
      .json({ result: updatedGoal, msg: "Goal updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
// --------------------------------------get goal details-------------------------------------------------------------------------
export const getMygoalDetails = async (req, res) => {
  const { goalId } = req.params;

  try {
    const details = await Goals.findById(goalId);

    if (!details) {
      return res.status(404).json({ msg: "Goal not found" });
    }
    return res
      .status(200)
      .json({ result: details, msg: "Goal details retrieved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ----------------------------------Delete productive sites-------------------------------------------------------------------------

export const deleteProductiveSite = async (req, res) => {
  const siteId = req.params.siteId;
  try {
    const domain = await ProductiveSite.findByIdAndRemove(siteId);

    if (!domain) {
      return res.status(404).json({
        message: "Domain not found with ID " + siteId,
      });
    }
    res.json({ message: "Domain deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId" || error.name === "NotFound") {
      return res.status(404).json({
        message: "Domain not found with ID " + siteId,
      });
    }
    console.log({ error });
    res.status(500).json({
      message: "Could not delete domain with ID " + siteId,
    });
  }
};

// ----------------------------------Delete block sites-------------------------------------------------------------------------

export const deleteBlockSite = async (req, res) => {
  const siteId = req.params.siteId;
  try {
    const domain = await BlockSite.findByIdAndRemove(siteId);
    if (!domain) {
      return res.status(404).json({
        message: "Domain not found with ID " + siteId,
      });
    }
    res.json({ message: "Domain deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId" || error.name === "NotFound") {
      return res.status(404).json({
        message: "Domain not found with ID " + siteId,
      });
    }
    console.log({ error });

    res.status(500).json({
      message: "Could not delete domain with ID " + siteId,
    });
  }
};

// ---------------------------------------get zapier data and add it on database---------------------------------------------------

export const getZapierData = async (req, res) => {
  try {
    const newData = {
      ...req.body,
    };
    const result = await Activity.create(newData);
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const userId = user._id;
    let userReward = await Rewards.findOne({ userId: userId });

    if (!userReward) {
      const addReward = new Rewards({
        userId,
      });
      await addReward.save();
      userReward = addReward; // Assign the newly created reward to userReward
    }

    const rewardTime = parseFloat(userReward.reward_time);
    const totalRewardTime = parseFloat(userReward.total_reward_time);

    if (isNaN(rewardTime) || isNaN(totalRewardTime)) {
      return res.status(400).json({ msg: "Invalid reward time values" });
    }

    const newTotalTime = rewardTime + totalRewardTime;

    userReward.total_reward_time = newTotalTime;
    await userReward.save();

    let updateData = {
      ...result.toObject(),
      newTotalTime,
    };

    return res
      .status(200)
      .json({ msg: "Data received successfully", data: updateData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// -------------------------------------add reward time given by user------------------------------------------------------------

export const addRewardTime = async (req, res) => {
  const { reward_time } = req.body;
  const { userId } = req.params;
  try {
    const user = await Rewards.findOne({ userId: userId });
    if (!user) {
      const addReward = new Rewards({
        userId,
        reward_time,
      });
      const result = await addReward.save();
    } else {
      user.reward_time = reward_time;
      await user.save();
    }
    return res.status(201).json({ msg: "Reward added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// -----------------------------------------------------get reward time data-------------------------------------------------

export const getRewardData = async (req, res) => {
  try {
    const { userId } = req.params;
    const details = await Rewards.findOne({ userId: userId });
    if (!details) {
      return res.status(404).json({ msg: "Reward data not found" });
    }
    return res
      .status(200)
      .json({ result: details, msg: "Rewars details retrieved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// --------------------------------------------------------------Update total reward time using userId---------------------------------

export const updateRewardTime = async (req, res) => {
  try {
    const { userId } = req.params;
    let userReward = await Rewards.findOne({ userId: userId });
    // if (!userReward) {
    //   return res.status(404).json({ msg: "reward not found" });
    // }

    if (!userReward) {
      const addReward = new Rewards({
        userId,
      });
      await addReward.save();
      userReward = addReward; // Assign the newly created reward to userReward
    }
    const rewardTime = parseFloat(userReward.reward_time);
    const totalRewardTime = parseFloat(userReward.total_reward_time);

    if (isNaN(rewardTime) || isNaN(totalRewardTime)) {
      return res.status(400).json({ msg: "Invalid reward time values" });
    }
    const newTotalTime = rewardTime + totalRewardTime;  
    userReward.total_reward_time = newTotalTime;
    await userReward.save();
    return res
      .status(200)
      .json({ msg: "Reward time updated successfully", data: userReward });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ----------------------------------------------------update utiziled time------------------------------------------------------

export const updateUtilizeTime = async (req, res) => {
  const { userId } = req.params;
  const { utilizeTime } = req.body;

  try {
    const utilizeTimeValue = parseFloat(utilizeTime);
    if (isNaN(utilizeTimeValue)) {
      return res.status(400).json({ msg: "Invalid utilizeTime format" });
    }

    const updateResult = await Rewards.findOneAndUpdate(
      { userId: userId },
      { $inc: { total_utilized_time: utilizeTimeValue } },
      { new: true }
    );

    if (!updateResult) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if total_utilized_time equals total_reward_time
    if (updateResult.total_utilized_time >= updateResult.total_reward_time) {
      // If they are equal, set both to 0
      await Rewards.findOneAndUpdate(
        { userId: userId },
        { $set: { total_utilized_time: 0, total_reward_time: 0 } },
        { new: true }
      );
    }

    return res.status(200).json({ msg: "UtilizeTime updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ----------------------------------------------------get tracking data---------------------------------------------------------

export const getTrackingDataByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const blockedSite = await BlockSite.find({ userId: userId });
    const rewardTime = await Rewards.findOne({ userId: userId });
    let isBlocking = true;
    if (rewardTime) {
      if (rewardTime?.total_reward_time !== 0) {
        isBlocking = false;
      }
    }
    const rewardTracking = {
      blocking: blockedSite?.map((sites) => sites.site) || [],
      unblocking: [],
      isBlocking: isBlocking,
      rewardTime: rewardTime?.total_reward_time || 0,
      total_utilized_time: rewardTime?.total_utilized_time || 0,
    };

    return res
      .status(200)
      .json({ msg: "Data found successfully", rewardTracking });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// -----------------------------------------------------create exception sites----------------------------------------------------

export const createExceptionSite = async (req, res) => {
  const { userId, site } = req.body;
  try {
    const addExceptionSite = new ExceptionSite({
      userId,
      site,
    });
    const result = await addExceptionSite.save();
    return res.status(201).json({ result, msg: "data added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
