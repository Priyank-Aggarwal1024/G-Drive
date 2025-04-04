import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiX } from "react-icons/fi";
import { showToast } from "./ui/toaster";
import { api } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";

export default function FileUploader({ onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get("folder");

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      showToast("Please select files to upload");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();

      // Append each file as a blob
      files.forEach((file) => {
        formData.append(
          "files",
          new Blob([file], { type: file.type }),
          file.name
        );
      });

      if (folderId) {
        formData.append("folder", folderId);
      }

      const response = await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          folder: folderId,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          if (files.length === 1) {
            setUploadProgress({ 0: percentCompleted });
          } else {
            // For multiple files, distribute progress evenly across all files
            const progressPerFile = percentCompleted / files.length;
            const newProgress = {};
            files.forEach((_, index) => {
              newProgress[index] = progressPerFile;
            });
            setUploadProgress(newProgress);
          }
        },
      });

      const data = response.data.data;
      console.log("data", data);
      showToast("Files uploaded successfully");
      setFiles([]);
      setUploadProgress({});
      if (onUploadComplete) {
        onUploadComplete(data);
      }
    } catch (error) {
      showToast(error.message || "Failed to upload files");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? "Drop the files here..."
            : "Drag and drop files here, or click to select files"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supported formats: Images, PDF, Word, Excel
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Selected Files</h3>
          <ul className="mt-2 divide-y divide-gray-200">
            {files.map((file, index) => (
              <li
                key={index}
                className="py-3 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="ml-2 text-sm text-gray-900">
                      {file.name}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  {uploading && uploadProgress[index] !== undefined && (
                    <div className="w-full mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress[index]}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {Math.round(uploadProgress[index])}%
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-gray-500 ml-4"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
