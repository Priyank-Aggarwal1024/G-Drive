import { useState, useEffect } from "react";
import { showToast } from "../components/ui/toaster";
import { api, useAuth } from "./AuthContext";

export default function useFile(folderId) {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch Files (Re-fetch when folderId changes)
  useEffect(() => {
    fetchFiles();
  }, [folderId]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await api.get("/files", {
        params: { folder: folderId || null },
      });
      setFiles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      showToast("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Upload File
  const uploadFile = async (file) => {
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
      showToast("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Rename File
  const renameFile = async (fileId, newName) => {
    if (!newName) return;

    try {
      const response = await api.patch(`/files/${fileId}`, { name: newName });
      setFiles(
        files.map((file) =>
          file._id === fileId ? { ...file, name: newName } : file
        )
      );
      showToast("File renamed successfully");
    } catch (error) {
      console.error("Error renaming file:", error);
      showToast("Failed to rename file");
    }
  };

  // ✅ Delete File
  const deleteFile = async (fileId) => {
    try {
      await api.delete(`/files/${fileId}`);
      setFiles(files.filter((file) => file._id !== fileId));
      showToast("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      showToast("Failed to delete file");
    }
  };

  // ✅ Toggle Star
  const toggleStar = async (fileId) => {
    try {
      await api.patch(`/files/${fileId}/star`);
      setFiles(
        files.map((file) =>
          file._id === fileId ? { ...file, isStarred: !file.isStarred } : file
        )
      );
      showToast("Star toggled successfully");
    } catch (error) {
      console.error("Error toggling star:", error);
      showToast("Failed to toggle star");
    }
  };

  // ✅ Download File
  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await api.get(`/files/${fileId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "file");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      showToast("Failed to download file");
    }
  };

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
