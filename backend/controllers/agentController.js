import Agent from "../models/Agent.js";
import AssignedList from "../models/AssignedList.js";

export const addAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const existingAgent = await Agent.findOne({ email });
    if (existingAgent)
      return res.status(400).json({ message: "Agent already exists" });

    const agent = new Agent({ name, email, mobile, password });
    await agent.save();

    res.status(201).json({ message: "Agent added successfully", agent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.status(200).json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyLeads = async (req, res) => {
  try {
    const agentId = req.user.id;
    const assigned = await AssignedList.findOne({ agentId }).populate("agentId", "name");

    if (!assigned) return res.json({ message: "No leads assigned yet" });

    res.json({
      agentName: assigned.agentId.name,
      leads: assigned.assignedLeads,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch agent leads" });
  }
};

export const deleteAgent = async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: "Agent deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete agent" });
  }
};
