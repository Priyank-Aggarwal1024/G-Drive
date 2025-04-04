import {
  getUserProfileService,
  updateUserProfileService,
} from "../services/user.service.js";

const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userProfile = await getUserProfileService(req.user._id);
    res.status(200).json({
      message: "User profile fetched successfully",
      user: userProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, address, bio, profilePicture } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (address) updateFields.address = address;
    if (bio !== undefined) updateFields.bio = bio;
    if (profilePicture !== undefined)
      updateFields.profilePicture = profilePicture;

    await updateUserProfileService(req.user._id, updateFields);
    const userProfile = await getUserProfileService(req.user._id);
    res.json({
      message: "Profile updated successfully",
      user: userProfile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Server error", error: error });
  }
};

export { getUserProfile, updateUserProfile };
