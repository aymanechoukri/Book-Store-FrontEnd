import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Cookies from "js-cookie";

export default function PDFDownload({ pdfUrl, filename, bookId }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is authenticated based on token
  const isAuth = useMemo(() => {
    const token = Cookies.get("token");
    return !!token;
  }, []);

  const handleDownload = async () => {
    if (!isAuth) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      const token = Cookies.get("token");
      
      // Step 1: Verify token validity FIRST
      const verifyRes = await fetch("http://localhost:5000/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (verifyRes.status === 401) {
        Cookies.remove("token");
        Cookies.remove("role");
        navigate("/login");
        return;
      }

      if (!verifyRes.ok) {
        throw new Error("Token verification failed");
      }

      // Step 2: Verify that user has purchased this specific book
      const purchaseCheckRes = await fetch("http://localhost:5000/api/verify-purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ bookId }),
      });

      if (purchaseCheckRes.status === 403) {
        alert("❌ أنت لم تشتري هذا الكتاب! يرجى شراؤه أولاً.");
        navigate("/");
        return;
      }

      if (purchaseCheckRes.status === 401) {
        navigate("/login");
        return;
      }

      if (!purchaseCheckRes.ok) {
        throw new Error("Purchase verification failed");
      }

      // Step 3: If all checks pass, proceed with download
      const res = await fetch(pdfUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.status === 403) {
        alert("❌ ليس لديك الصلاحية لتحميل هذا الملف!");
        return;
      }

      if (!res.ok) {
        throw new Error(`Download failed with status ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("حدث خطأ في التحميل: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isAuth ? (
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Downloading..." : "Download PDF"}
        </button>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Login to download
        </button>
      )}
    </>
  );
}