import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiFolder,
  FiArrowLeft,
  FiUpload,
  FiGrid,
  FiList,
  FiPlus,
} from "react-icons/fi";
import { showToast } from "../components/ui/toaster";
import { api } from "../context/AuthContext";
import Pagination from "../components/ui/Pagination";
import FileView from "../components/ui/FileView";
import useDrive from "../hooks/useDrive";

export default function FolderView() {
  const { id } = useParams();
  const {
    files,
    folders,
    stats,
    loading,
    fetchData,
    handleDelete,
    handleToggleStar,
  } = useDrive({ folder: id, parent: id });
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const handleDownload = async (fileId) => {
    try {
      const response = await api.get(`/files/${fileId}/download`);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const data = await response.json();

      // Create a link to download the file
      const a = document.createElement("a");
      a.href = data.data.downloadUrl;
      a.download = data.data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast("Download started");
    } catch (error) {
      showToast("Failed to download file");
      console.error("Error:", error);
    }
  };

  const handleRename = async (fileId) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;

    try {
      const response = await api.patch(`/files/${fileId}`, {
        name: newName,
      });

      if (!response.ok) {
        throw new Error("Rename failed");
      }

      showToast("File renamed successfully");
      fetchData();
    } catch (error) {
      showToast("Failed to rename file");
      console.error("Error:", error);
    }
  };

  const handleShare = async (fileId) => {
    try {
      const response = await api.post(`/files/${fileId}/share`);

      if (!response.ok) {
        throw new Error("Share failed");
      }

      const data = await response.json();
      const shareUrl = data.data.shareUrl;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      showToast("Share link copied to clipboard");
    } catch (error) {
      showToast("Failed to share file");
      console.error("Error:", error);
    }
  };

  const handleCopy = async (fileId) => {
    try {
      const response = await api.post(`/files/${fileId}/copy`);

      if (!response.ok) {
        throw new Error("Copy failed");
      }

      showToast("File copied successfully");
      fetchData();
    } catch (error) {
      showToast("Failed to copy file");
      console.error("Error:", error);
    }
  };

  const handleMove = async (fileId) => {
    const targetFolderId = prompt("Enter target folder ID:");
    if (!targetFolderId) return;

    try {
      const response = await api.patch(`/files/${fileId}/move`, {
        folder: targetFolderId,
      });

      if (!response.ok) {
        throw new Error("Move failed");
      }

      showToast("File moved successfully");
      fetchData();
    } catch (error) {
      showToast("Failed to move file");
      console.error("Error:", error);
    }
  };

  console.log(files, "files");
  // Pagination logic
  const allItems = [
    ...folders.map((folder) => ({ ...folder, type: "folder" })),
    ...files.map((file) => ({ ...file, type: "file" })),
  ];

  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = allItems.slice(startIndex, endIndex);
  console.log(currentItems, "currentItems");
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    try {
      await api.post("/folders", {
        name: folderName,
        parent: id,
      });
      showToast("Folder created successfully");
      fetchFolderContents();
    } catch (error) {
      showToast("Failed to create folder");
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {folders?.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateFolder}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <FiPlus className="mr-2" />
                New Folder
              </button>
              <button
                onClick={() => navigate(`/upload?folder=${id}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiUpload className="mr-2" />
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  className={`p-2 rounded-md ${
                    viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <FiGrid className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className={`p-2 rounded-md ${
                    viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <FiList className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div
            className={`p-4 ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "divide-y"
            }`}
          >
            {/* Subfolders and Files */}
            {allItems.length === 0 ? (
              <div className="col-span-full p-8 text-center text-gray-500">
                This folder is empty
              </div>
            ) : (
              <>
                {currentItems.map((item) =>
                  item.type === "folder" ? (
                    <div
                      key={item._id}
                      className={`${
                        viewMode === "grid"
                          ? "p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
                          : "p-4 hover:bg-gray-50 cursor-pointer"
                      }`}
                      onClick={() => navigate(`/folder/${item._id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FiFolder className="w-8 h-8 text-blue-500" />
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.itemCount || 0} items
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <FileView
                      key={item._id}
                      file={item}
                      onDownload={handleDownload}
                      onDelete={handleDelete}
                      onToggleStar={handleToggleStar}
                      onRename={handleRename}
                      onShare={handleShare}
                      onCopy={handleCopy}
                      onMove={handleMove}
                      viewMode={viewMode}
                      isStarred={item.isStarred}
                    />
                  )
                )}
              </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
