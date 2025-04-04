import User from "../models/User.js";
import File from "../models/File.js";
import Folder from "../models/Folder.js";

const getUserProfileService = async (userId) => {
  const user = await User.findById(userId).select(
    "-password -refreshToken -createdAt -updatedAt"
  );
  if (!user) {
    throw new Error("User not found");
  }
  const totalFiles = await File.countDocuments({ owner: userId });
  const totalFolders = await Folder.countDocuments({ owner: userId });
  const userProfile = {
    id: user._id,
    name: user.name,
    email: user.email,
    address: user.address,
    bio: user.bio,
    profilePicture: user.profilePicture,
    totalFiles,
    totalFolders,
    storageUsed: user.storageUsed,
    storageLimit: user.storageLimit,
  };

  return userProfile;
};

const updateUserProfileService = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  return user;
};

export { getUserProfileService, updateUserProfileService };
