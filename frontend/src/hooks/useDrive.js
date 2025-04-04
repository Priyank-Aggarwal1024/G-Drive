import { useState, useEffect, use } from "react";
import { showToast } from "../components/ui/Toaster";
import { api, useAuth } from "../context/AuthContext";

export default function useDrive(params) {
  const { user, getUserStats } = useAuth();
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [stats, setStats] = useState({
    totalStorage: "1 GB",
    usedStorage: "0 GB",
    totalFiles: 0,
    totalFolders: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const filesResponse = await api.get("/files", {
        params: {
          folder: params?.folder || null,
        },
      });
      const foldersResponse = await api.get("/folders", {
        params: {
          parent: params?.parent || null,
        },
      });

      setFiles(filesResponse.data.data || []);
      setFolders(foldersResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    try {
      await api.post("/folders", { name: folderName });
      showToast("Folder created successfully");
      fetchData();
      getUserStats();
    } catch (error) {
      console.error("Error creating folder:", error);
      showToast("Failed to create folder");
    }
  };

  const handleDelete = async (itemId, type) => {
    try {
      await api.delete(`/${type}s/${itemId}`);
      type === "file"
        ? setFiles(files.filter((file) => file._id !== itemId))
        : setFolders(folders.filter((folder) => folder._id !== itemId));
      showToast("Item deleted successfully");
      getUserStats();
    } catch (error) {
      console.error("Error deleting item:", error);
      showToast("Failed to delete item");
    }
  };

  const handleToggleStar = async (itemId, type) => {
    try {
      await api.patch(`/${type}s/${itemId}/star`);
      type === "file"
        ? setFiles(
            files.map((file) =>
              file._id === itemId
                ? { ...file, isStarred: !file.isStarred }
                : file
            )
          )
        : setFolders(
            folders.map((folder) =>
              folder._id === itemId
                ? { ...folder, isStarred: !folder.isStarred }
                : folder
            )
          );
      showToast("Star toggled successfully");
      getUserStats();
    } catch (error) {
      console.error("Error toggling star:", error);
      showToast("Failed to toggle star");
    }
  };

  const totalPages = Math.ceil((files.length + folders.length) / itemsPerPage);
  const currentItems = [...folders, ...files].slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    setStats({
      totalStorage: `${(
        (user.storageLimit || 0) /
        (1024 * 1024 * 1024)
      ).toFixed(2)} GB`,
      usedStorage: `${((user.storageUsed || 0) / (1024 * 1024 * 1024)).toFixed(
        2
      )} GB`,
      totalFiles: user.totalFiles,
      totalFolders: user.totalFolders,
    });
  }, [user]);
  useEffect(() => {
    getUserStats();
    fetchData();
  }, [params?.folder, params?.parent]);
  return {
    files,
    folders,
    stats,
    loading,
    currentPage,
    totalPages,
    currentItems,
    fetchData,
    handleCreateFolder,
    handleDelete,
    handleToggleStar,
    setCurrentPage,
    getUserStats,
  };
}
