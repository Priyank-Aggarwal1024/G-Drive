import { useEffect, useState } from "react";

export function Toaster() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const handleToast = (event) => {
      setMessage(event.detail);
      setTimeout(() => setMessage(null), 3000);
    };

    window.addEventListener("toast", handleToast);
    return () => window.removeEventListener("toast", handleToast);
  }, []);

  return (
    message && (
      <div className="fixed bottom-5 right-5 bg-gray-900 text-white px-4 py-2 rounded shadow-lg">
        {message}
      </div>
    )
  );
}

// Utility function to trigger a toast notification
export function showToast(message) {
  window.dispatchEvent(new CustomEvent("toast", { detail: message }));
}
