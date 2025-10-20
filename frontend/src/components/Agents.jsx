import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import countryCodes from "../data/countryCodes.json";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    countryCode: "+91",
  });

  useEffect(() => {
    setCountryList(countryCodes);
  }, []);

  const fetchAgents = async () => {
    try {
      const { data } = await API.get("/agents");
      setAgents(data);
    } catch (err) {
      toast.error("Failed to fetch agents");
    }
  };

  const addAgent = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      ...form,
      mobile: `${form.countryCode}${form.mobile}`, // e.g., +91 9998887770
    };

    await API.post("/agents", payload);
    toast.success("Agent added successfully!");
    setForm({ name: "", email: "", mobile: "", password: "", countryCode: "+91" });
    fetchAgents();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to add agent");
  }
};


  const deleteAgent = async (id) => {
    toast(
      (t) => (
        <div className="flex flex-col space-y-3">
          <span>Are you sure you want to delete this agent?</span>
          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await API.delete(`/agents/${id}`);
                  toast.success("Agent deleted successfully");
                  fetchAgents();
                } catch {
                  toast.error("Failed to delete agent");
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
  <h2 className="text-xl font-semibold mb-4">Agents</h2>

  <form onSubmit={addAgent} className="mb-5">
    <div className="flex gap-3 flex-wrap items-start">
      <input
        className="border px-3 py-2 rounded-md flex-shrink-0"
        style={{ width: '192px' }}
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="border px-3 py-2 rounded-md flex-shrink-0"
        style={{ width: '192px' }}
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* Country code + mobile as one field */}
      <div className="flex border rounded-md flex-shrink-0" style={{ width: '192px' }}>
        <select
          className="bg-gray-100 px-2 py-2 border-r border-gray-300 flex-shrink-0"
          style={{ width: '70px' }}
          value={form.countryCode}
          onChange={(e) =>
            setForm({ ...form, countryCode: e.target.value })
          }
        >
          {countryList.map((c) => (
            <option key={c.code} value={c.dial_code}>
              {c.flag} {c.dial_code}
            </option>
          ))}
        </select>
        <input
          className="px-3 py-2 outline-none"
          style={{ width: 'calc(192px - 70px)' }}
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        />
      </div>

      <input
        className="border px-3 py-2 rounded-md flex-shrink-0"
        style={{ width: '192px' }}
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
        Add Agent
      </button>
    </div>
  </form>

  <ul className="divide-y">
    {agents.map((a) => (
      <li key={a._id} className="py-2 flex justify-between">
        <span>
          {a.name} ({a.email})
        </span>
        <span>{a.mobile}</span>
        <button
          onClick={() => deleteAgent(a._id)}
          className="text-red-500 hover:text-red-700 transition"
          title="Delete Agent"
        >
          <FaTrash />
        </button>
      </li>
    ))}
  </ul>
</div>
  );
}
