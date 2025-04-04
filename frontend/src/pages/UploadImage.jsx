import { useNavigate, useSearchParams } from "react-router-dom";
import FileUploader from "../components/FileUploader";

export default function UploadImage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get("folder");

  const handleUploadComplete = (data) => {
    if (folderId) {
      navigate(`/folder/${folderId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Files</h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload your files to {folderId ? "this folder" : "your drive"}
          </p>
        </div>

        <FileUploader onUploadComplete={handleUploadComplete} />
      </div>
    </div>
  );
}
