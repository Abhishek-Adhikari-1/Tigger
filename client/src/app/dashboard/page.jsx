import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function DashboardPage() {
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [copyStatus, setCopyStatus] = useState("Copy JWT Token");

  const handleClick = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("http://localhost:8080/api/protected", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const copyToken = async () => {
    const token = await getToken();
    await navigator.clipboard.writeText(token);
    console.log(token);
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus("Copy JWT Token"), 2000);
  };

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-50 border-zinc-200 dark:bg-zinc-900 border dark:border-zinc-800 shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-lack dark:text-white">Dashboard</h1>
          <p className="text-sm text-zinc-400">
            Clerk authentication test panel
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleClick}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 rounded-xl font-medium py-2.5 transition
              ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
              } text-white`}
          >
            {/* Leading Icon */}
            {loading && <Spinner />}
            {!loading && status === "success" && <SuccessIcon />}
            {!loading && status === "error" && <ErrorIcon />}

            <span>
              {loading
                ? "Checking..."
                : status === "success"
                ? "API Success"
                : status === "error"
                ? "API Failed"
                : "Check Protected API"}
            </span>
          </button>

          <div className="flex flex-col gap-3">
            <button
              onClick={copyToken}
              className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 transition text-zinc-200 font-medium py-2.5 border border-zinc-700"
            >
              {copyStatus}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-zinc-500">
          Localhost · Clerk · Secure API
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg className="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6l-12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
