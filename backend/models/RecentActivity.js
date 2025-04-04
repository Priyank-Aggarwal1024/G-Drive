import mongoose from "mongoose";

const RecentActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "itemType",
  },
  itemType: {
    type: String,
    enum: ["File", "Folder"],
    required: true,
  },
  action: {
    type: String,
    enum: [
      "created",
      "uploaded",
      "renamed",
      "deleted",
      "moved",
      "shared",
      "starred",
      "downloaded",
      "viewed",
    ],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: Object, // Store additional details (e.g., old name when renaming, share settings)
    default: {},
  },
});

export default mongoose.model("RecentActivity", RecentActivitySchema);
