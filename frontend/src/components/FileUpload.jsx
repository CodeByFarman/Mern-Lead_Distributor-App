import { useState } from "react";
import API from "../services/api";
import { useLeads } from "../context/LeadsContext";
import { toast } from "react-hot-toast";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const { refreshLists } = useLeads();
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return toast.error("Please select a file before uploading!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await API.post("/upload", formData);
      toast.success("File uploaded & distributed successfully!");
      setFile(null);
      refreshLists();
      e.target.reset(); // reset file input
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Upload CSV / XLSX</h2>
      <form onSubmit={handleUpload} className="flex items-center gap-3">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
