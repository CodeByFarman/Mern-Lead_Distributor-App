import { useState, useEffect } from "react";
import API from "../services/api";
import { useLeads } from "../context/LeadsContext";
import { toast } from "react-hot-toast";

export default function DistributedLists() {
  const [lists, setLists] = useState([]);
  const { refreshTrigger } = useLeads();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/upload/lists");
      setLists(data);
      if (data.length === 0) toast("No leads distributed yet");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch distributed lists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, [refreshTrigger]);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Distributed Lists
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : lists.length === 0 ? (
        <p className="text-gray-500">No lists found.</p>
      ) : (
        <div className="space-y-4">
          {lists.map((agent, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden shadow-sm bg-gray-50"
            >
              <div
                className="flex justify-between items-center px-4 py-3 bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
                onClick={() => toggleExpand(index)}
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {agent.agentName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Total Leads: {agent.totalLeads}
                  </p>
                </div>
                <span className="text-gray-500 text-sm">
                  {expanded === index ? "▲" : "▼"}
                </span>
              </div>

              {expanded === index && (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border-t bg-white">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-600">
                          Phone
                        </th>
                        <th className="px-4 py-2 text-left text-gray-600">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {agent.leads.map((lead, i) => (
                        <tr
                          key={i}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-2">{lead.phone || "-"}</td>
                          <td className="px-4 py-2">{lead.notes || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
