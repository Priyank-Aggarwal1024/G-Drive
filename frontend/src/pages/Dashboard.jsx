import FolderViewShimmer from "../components/ui/FolderViewShimmer";
import useDrive from "../hooks/useDrive";
import FolderView from "./FolderView";
export default function Dashboard() {
  const { loading } = useDrive();
  if (loading) {
    return <FolderViewShimmer />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FolderView />
      </div>
    </div>
  );
}
