import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a folder name"],
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  },
  isStarred: {
    type: Boolean,
    default: false,
  },
  isTrashed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
folderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for getting the total size of files in the folder
folderSchema.virtual("totalSize").get(function () {
  return this.files.reduce((total, file) => total + file.size, 0);
});

// Virtual for getting the number of items in the folder
folderSchema.virtual("itemCount").get(function () {
  return this.files.length + this.subfolders.length;
});

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;
