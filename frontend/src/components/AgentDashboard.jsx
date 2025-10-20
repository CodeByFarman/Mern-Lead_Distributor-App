import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { useLeads } from "../context/LeadsContext";

export default function AgentDashboard({ onLogout }) {
  const [leads, setLeads] = useState([]);
  const [agentName, setAgentName] = useState("");
  const { refreshTrigger } = useLeads();
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/upload/my-leads");
      setLeads(data.leads || []);
      setAgentName(data.agentName || "Agent");
    } catch (err) {
      toast.error("Failed to fetch your leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [refreshTrigger]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {agentName}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">My Assigned Leads</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : leads.length === 0 ? (
          <p className="text-gray-500">No leads assigned yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100 border-b sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr
                    key={i}
                    className={`border-b ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-4 py-2">{lead.phone}</td>
                    <td className="px-4 py-2">{lead.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
