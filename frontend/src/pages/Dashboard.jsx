import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiFolder,
  FiFile,
  FiUpload,
  FiSearch,
  FiGrid,
  FiList,
  FiPlus,
  FiClock,
  FiTrash2,
  FiStar,
  FiX,
} from "react-icons/fi";
import { api } from "../context/AuthContext";
import { showToast } from "../components/ui/toaster";
import Pagination from "../components/ui/Pagination";
import useDrive from "../hooks/useDrive";
import FileView from "../components/ui/FileView";

export default function Dashboard() {
  const {
    files,
    folders,
    stats,
    loading,
    handleDelete,
    handleToggleStar,
    handleCreateFolder,
  } = useDrive();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedFile, setSelectedFile] = useState(null);

  const items = [
    ...folders.map((folder) => ({ ...folder, type: "folder" })),
    ...files.map((file) => ({ ...file, type: "file" })),
  ];
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedFile(null);
  };

  const handleFileClick = (item) => {
    if (item.type === "folder") {
      window.location.href = `/folder/${item._id}`;
    } else {
      setSelectedFile(item);
    }
  };
  const [recentActivities, setRecentActivities] = useState([]);
  const fetchActivities = async () => {
    try {
      const response = await api.get("/recent-activity", {
        params: {
          limit: 5,
        },
      });
      setRecentActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };
  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Drive</h1>
              <p className="text-sm text-gray-500">
                Welcome back, {user?.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiUpload className="mr-2" />
                Upload
              </Link>
              <button
                onClick={handleCreateFolder}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiPlus className="mr-2" />
                New Folder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Storage Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Storage
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Used Storage</span>
                    <span className="text-gray-900">
                      {stats.usedStorage}/{stats.totalStorage}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (parseFloat(stats.usedStorage) /
                            parseFloat(stats.totalStorage)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.totalFiles}
                    </p>
                    <p className="text-sm text-gray-500">Files</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.totalFolders}
                    </p>
                    <p className="text-sm text-gray-500">Folders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Access
              </h2>
              <div className="space-y-2">
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  <FiStar className="mr-3 text-yellow-400" />
                  Starred
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  <FiClock className="mr-3 text-gray-400" />
                  Recent
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  <FiTrash2 className="mr-3 text-gray-400" />
                  Trash
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Search and View Toggle */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="relative w-full sm:w-96">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search files and folders"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
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

            {/* Files and Folders Grid/List */}
            <div className="grid grid-cols-1 gap-6">
              <div
                className={`bg-white rounded-lg shadow-sm border border-gray-200 ${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
                    : "divide-y divide-gray-200"
                }`}
              >
                {currentItems.length === 0 ? (
                  <div className="col-span-full p-8 text-center text-gray-500">
                    No files or folders found
                  </div>
                ) : (
                  currentItems.map((item) =>
                    item.type === "folder" ? (
                      <div
                        key={item._id}
                        className={`cursor-pointer transition duration-200 ${
                          viewMode === "grid"
                            ? "p-4 hover:bg-gray-50 rounded-lg border border-gray-100"
                            : "p-4 hover:bg-gray-50"
                        }`}
                        onClick={() => handleFileClick(item)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FiFolder className="w-8 h-8 text-blue-500" />
                            <div className="ml-4">
                              <h3 className="text-sm font-medium text-gray-900">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {item.itemCount} items
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <FileView
                        key={item._id}
                        file={item}
                        onDownload={() => console.log(item._id)}
                        onDelete={() => console.log(item._id, "file")}
                        onToggleStar={() => console.log(item._id, "file")}
                        onRename={() => console.log(item._id)}
                        onShare={() => console.log(item._id)}
                        onCopy={() => console.log(item.id)}
                        onMove={() => console.log(item.id)}
                        viewMode={viewMode}
                        isStarred={item.isStarred}
                      />
                    )
                  )
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="mt-4"
                />
              )}
            </div>

            {/* File Preview */}
            {selectedFile && selectedFile.type === "file" && (
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium truncate max-w-[80%]">
                    {selectedFile.name}
                  </h3>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="aspect-w-16 aspect-h-9">
                  {selectedFile.mimeType?.startsWith("image/") ? (
                    (console.log(selectedFile, "selectedFile"),
                    (
                      <img
                        src={selectedFile.url}
                        alt={selectedFile.name}
                        className="object-contain w-[40px] h-[40px] rounded-full"
                      />
                    ))
                  ) : (
                    <div className="flex items-center justify-center bg-gray-100 rounded-lg">
                      <FiFile className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Size: {selectedFile.size}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last modified: {selectedFile.lastModified}
                  </p>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h2>
              </div>
              <div className="divide-y">
                {recentActivities.map((activity) => (
                  <div key={activity._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.action}</span>{" "}
                          <span className="truncate">
                            {activity.itemId.name}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
