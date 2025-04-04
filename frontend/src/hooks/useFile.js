import { useState, useEffect, useCallback } from "react";
import { showToast } from "../components/ui/toaster";
import { api, useAuth } from "../context/AuthContext";

export default function useFile(folderId) {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) fetchFiles();
  }, [folderId, user]);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/files", {
        params: { folder: folderId || null },
      });
      setFiles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      showToast(error.response?.data?.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  const uploadFile = useCallback(
    async (file) => {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folderId || "");

      setUploading(true);
      try {
        const response = await api.post("/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setFiles((prevFiles) => [response.data.data, ...prevFiles]);
        showToast("File uploaded successfully");
      } catch (error) {
        console.error("Error uploading file:", error);
        showToast(error.response?.data?.message || "Failed to upload file");
      } finally {
        setUploading(false);
      }
    },
    [folderId]
  );

  const renameFile = useCallback(async (fileId, newName) => {
    if (!newName) return;

    try {
      await api.patch(`/files/${fileId}/rename`, { name: newName });
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file._id === fileId ? { ...file, name: newName } : file
        )
      );
      showToast("File renamed successfully");
    } catch (error) {
      console.error("Error renaming file:", error);
      showToast("Failed to rename file");
    }
  }, []);

  const deleteFile = useCallback(async (fileId) => {
    try {
      await api.delete(`/files/${fileId}`);
      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
      showToast("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      showToast("Failed to delete file");
    }
  }, []);

  const toggleStar = useCallback(async (fileId) => {
    try {
      await api.patch(`/files/${fileId}/star`);
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file._id === fileId ? { ...file, isStarred: !file.isStarred } : file
        )
      );
      showToast("Star toggled successfully");
    } catch (error) {
      console.error("Error toggling star:", error);
      showToast("Failed to toggle star");
    }
  }, []);

  const downloadFile = useCallback(async (fileId) => {
    try {
      const response = await api.get(`/files/${fileId}/download`);
      const { downloadUrl, filename } = response.data.data;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename || "file");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      showToast("Failed to download file");
    }
  }, []);

  return {
    files,
    loading,
    uploading,
    fetchFiles,
    uploadFile,
    renameFile,
    deleteFile,
    toggleStar,
    downloadFile,
  };
}
