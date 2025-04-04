import File from "../models/File.js";
import User from "../models/User.js";
import { logActivity } from "../services/recentActivity.service.js";
import {
  uploadToStorage,
  deleteFromStorage,
  getFileFromStorage,
} from "../services/storage.service.js";

export const uploadFiles = async (req, res) => {
  console.log("req.files", req.files);
  try {
    const files = req.files || req.body.files || [];

    if (files.length === 0) {
      console.log("No files uploaded", req.user, req.body);
      return res.status(400).json({
        success: false,
        message: "Please upload at least one file",
      });
    }

    const uploadedFiles = [];
    let totalSize = 0;

    const user = await User.findById(req.user.id);
    if (req.files) {
      totalSize = files.reduce((sum, file) => sum + file.size, 0);
    } else {
      totalSize = files.length * 1024 * 1024; // Assume 1MB per file
    }
    console.log("totalSize", totalSize);
    if (user.storageUsed + totalSize > user.storageLimit) {
      return res.status(400).json({
        success: false,
        message: "Storage limit exceeded",
      });
    }

    for (const file of files) {
      let filePath;

      if (req.files) {
        filePath = await uploadToStorage(file);
      } else {
        filePath = file.path;

        const newFile = await File.create({
          name: file.path.split("/").pop(),
          originalName: file.path.split("/").pop(),
          mimeType: "application/octet-stream",
          size: file.size,
          path: filePath,
          owner: req.user.id,
          folder: req.body.folder || null,
        });

        uploadedFiles.push(newFile);
        continue;
      }

      const newFile = await File.create({
        name: file.originalname,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath.Location,
        owner: req.user.id,
        folder: req.body.folder || null,
        Key: filePath.Key,
        ETag: filePath.ETag,
      });
      logActivity(req.user.id, newFile._id, "File", "uploaded", {
        name: newFile.name,
        size: newFile.size,
      });
      uploadedFiles.push(newFile);
    }

    user.storageUsed += totalSize;
    await user.save();

    res.status(201).json({
      success: true,
      data: uploadedFiles,
    });
  } catch (error) {
    console.log("Error uploading files", error);
    res.status(500).json({
      success: false,
      message: "Error uploading files",
      error: error.message,
    });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await File.find(
      {
        owner: req.user.id,
        folder: req.query.folder || null,
      },
      {
        Key: 0,
        ETag: 0,
      }
    ).sort("-createdAt");

    res.status(200).json({
      success: true,
      data: files,
      message: "Files fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching files",
      error: error.message,
    });
  }
};

export const getFile = async (req, res) => {
  try {
    const file = await File.findOne(
      {
        _id: req.params.id,
        owner: req.user.id,
      },
      {
        path: 0,
        Key: 0,
        ETag: 0,
      }
    );
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }
    logActivity(req.user.id, file._id, "File", "viewed", {
      name: file.name,
      size: file.size,
    });
    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching file",
      error: error.message,
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    await deleteFromStorage(file);

    const user = await User.findById(req.user.id);
    user.storageUsed -= file.size;
    await user.save();

    await File.deleteOne({ _id: file._id });
    logActivity(req.user.id, file._id, "File", "deleted", {
      name: file.name,
      size: file.size,
    });
    res.status(200).json({
      success: true,
      data: {},
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: error.message,
    });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }
    const signedUrl = await getFileFromStorage(file);
    logActivity(req.user.id, file._id, "File", "downloaded", {
      name: file.name,
      size: file.size,
    });
    res.status(200).json({
      success: true,
      data: {
        downloadUrl: signedUrl,
        filename: file.originalName,
        mimeType: file.mimeType,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error downloading file",
      error: error.message,
    });
  }
};

export const toggleStar = async (req, res) => {
  try {
    const file = await File.findOne(
      {
        _id: req.params.id,
        owner: req.user.id,
      },
      {
        path: 0,
        Key: 0,
        ETag: 0,
      }
    );
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    file.isStarred = !file.isStarred;
    await file.save();
    logActivity(req.user.id, file._id, "File", "starred", {
      name: file.name,
      size: file.size,
    });
    res.status(200).json({
      success: true,
      data: file,
      message: "File starred successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling file star",
      error: error.message,
    });
  }
};
