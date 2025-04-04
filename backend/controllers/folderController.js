import Folder from "../models/Folder.js";
import File from "../models/File.js";
// @desc    Create new folder
// @route   POST /api/folders
// @access  Private
export const createFolder = async (req, res) => {
  try {
    const folder = await Folder.create({
      name: req.body.name,
      owner: req.user.id,
      parent: req.body.parent || null,
    });

    res.status(201).json({
      success: true,
      data: folder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating folder",
      error: error.message,
    });
  }
};

export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({
      owner: req.user.id,
      isTrashed: false,
      parent: req.query.parent || null,
    }).sort("-createdAt");

    const foldersWithItemCount = await Promise.all(
      folders.map(async (folder) => {
        const [fileCount, subfolderCount] = await Promise.all([
          File.countDocuments({
            owner: req.user.id,
            folder: folder._id,
          }),
          Folder.countDocuments({
            owner: req.user.id,
            parent: folder._id,
            isTrashed: false,
          }),
        ]);
        const folderObj = folder.toObject();
        return {
          ...folderObj,
          itemCount: fileCount + subfolderCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: foldersWithItemCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching folders",
      error: error.message,
    });
  }
};

export const getFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user.id,
    })
      .populate({
        path: "files",
        match: { isTrashed: false },
      })
      .populate({
        path: "subfolders",
        match: { isTrashed: false },
      });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    res.status(200).json({
      success: true,
      data: folder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching folder",
      error: error.message,
    });
  }
};

export const updateFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    // Update folder
    folder.name = req.body.name || folder.name;
    folder.parent = req.body.parent || folder.parent;
    await folder.save();

    res.status(200).json({
      success: true,
      data: folder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating folder",
      error: error.message,
    });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    // Soft delete the folder
    folder.isTrashed = true;
    await folder.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting folder",
      error: error.message,
    });
  }
};

// @desc    Toggle folder star
// @route   PATCH /api/folders/:id/star
// @access  Private
export const toggleStar = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    folder.isStarred = !folder.isStarred;
    await folder.save();

    res.status(200).json({
      success: true,
      data: folder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling folder star",
      error: error.message,
    });
  }
};
