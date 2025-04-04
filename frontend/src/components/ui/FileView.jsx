import React, { useState, useRef, useEffect } from "react";
import {
  FiFile,
  FiDownload,
  FiTrash2,
  FiStar,
  FiMoreVertical,
  FiEdit2,
  FiShare2,
  FiInfo,
  FiExternalLink,
  FiCopy,
  FiMove,
  FiCheck,
  FiX,
} from "react-icons/fi";

const FileView = ({
  file,
  onDownload,
  onDelete,
  onToggleStar,
  onRename,
  onShare,
  onCopy,
  onMove,
  viewMode,
  isStarred,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const menuRef = useRef(null);
  const renameInputRef = useRef(null);

  const handleDownload = (e) => {
    e.stopPropagation();
    onDownload(file._id);
    setIsMenuOpen(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(file._id, "file");
    setIsMenuOpen(false);
  };

  const handleToggleStar = (e) => {
    e.stopPropagation();
    onToggleStar(file._id, "file");
    setIsMenuOpen(false);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    setIsRenaming(true);
    setIsMenuOpen(false);
  };

  const handleRenameSubmit = (e) => {
    e.stopPropagation();
    if (newName.trim() && newName !== file.name) {
      onRename(file._id, newName);
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = (e) => {
    e.stopPropagation();
    setNewName(file.name);
    setIsRenaming(false);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    onShare(file._id);
    setIsMenuOpen(false);
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    onCopy(file._id);
    setIsMenuOpen(false);
  };

  const handleMove = (e) => {
    e.stopPropagation();
    onMove(file._id);
    setIsMenuOpen(false);
  };

  const handleOpen = (e) => {
    e.stopPropagation();
    window.open(file.path, "_blank");
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus rename input when entering rename mode
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  return (
    <div
      className={`max-w-full w-full ${
        viewMode === "grid"
          ? "xs:p-4 p-2 hover:bg-gray-50 rounded-lg"
          : "xs:p-4 p-2 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center max-w-full gap-2">
          <FiFile className="w-8 h-8 text-gray-500" />
          <div className="w-fit max-w-[140px]">
            {isRenaming ? (
              <div className="flex items-center gap-2">
                <input
                  ref={renameInputRef}
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSubmit(e);
                    if (e.key === "Escape") handleRenameCancel(e);
                  }}
                  className="block w-full text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={handleRenameSubmit}
                  className="p-1 text-green-600 hover:text-green-700"
                >
                  <FiCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRenameCancel}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <span className="block text-sm font-medium text-gray-900 truncate whitespace-nowrap overflow-hidden">
                  {file.name}
                </span>
                <p className="text-sm text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center max-w-full">
          <button
            onClick={handleToggleStar}
            className="p-2 text-gray-400 hover:text-yellow-500"
            aria-label={isStarred ? "Unstar file" : "Star file"}
          >
            <FiStar
              className={`w-5 h-5 ${isStarred ? "text-yellow-400" : ""}`}
            />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-2 text-gray-400 hover:text-gray-500"
              aria-label="More options"
            >
              <FiMoreVertical className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={handleOpen}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiExternalLink className="mr-3" />
                  Open
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiDownload className="mr-3" />
                  Download
                </button>
                <button
                  onClick={handleRename}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiEdit2 className="mr-3" />
                  Rename
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiShare2 className="mr-3" />
                  Share
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiCopy className="mr-3" />
                  Make a copy
                </button>
                <button
                  onClick={handleMove}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiMove className="mr-3" />
                  Move to
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <FiTrash2 className="mr-3" />
                  Delete
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FiInfo className="mr-3" />
                  About
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileView;
