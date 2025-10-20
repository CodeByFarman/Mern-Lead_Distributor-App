import csv from "csv-parser";
import fs from "fs";
import xlsx from "xlsx";
import Agent from "../models/Agent.js";
import AssignedList from "../models/AssignedList.js";

// Upload File Controller
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) 
      return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    const ext = req.file.originalname.split(".").pop().toLowerCase();

    let leads = [];

    // Parse CSV
    if (ext === "csv") {
      leads = await parseCSV(filePath);
    } 
    // Parse XLSX / XLS
    else if (["xlsx", "xls"].includes(ext)) {
      leads = parseXLSX(filePath);
    } 
    else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Invalid file format" });
    }

    // Validate required columns
    const requiredCols = ["FirstName", "Phone", "Notes"];
    const invalid = leads.some(row => !requiredCols.every(col => col in row));
    if (invalid) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Invalid file format: missing required columns" });
    }

    // Distribute Leads
    await distributeLeads(leads);

    fs.unlinkSync(filePath);
    res.status(200).json({ message: "Leads distributed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Parse CSV with Promise
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
};

// Parse XLSX / XLS
const parseXLSX = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
};

// Distribute Leads Among Agents
const distributeLeads = async (leads) => {
  const agents = await Agent.find();
  if (!agents.length) throw new Error("No agents found to assign leads");
  
  await AssignedList.deleteMany({});

  const totalLeads = leads.length;
  const totalAgents = agents.length;
  const baseCount = Math.floor(totalLeads / totalAgents);
  const remainder = totalLeads % totalAgents;

  let start = 0;
  for (let i = 0; i < totalAgents; i++) {
    const extra = i < remainder ? 1 : 0;
    const end = start + baseCount + extra;
    const agentLeads = leads.slice(start, end);
    start = end;

    // Save each lead as a separate document
    const docs = agentLeads.map(lead => ({
      agentId: agents[i]._id,
      firstName: lead.FirstName,
      phone: lead.Phone,
      notes: lead.Notes,
    }));
      await AssignedList.create({
      agentId: agents[i]._id,
      assignedLeads: docs,
    });
    await AssignedList.insertMany(docs);
  }
};

export const getDistributedLists = async (req, res) => {
  try {
    const lists = await AssignedList.find().populate("agentId", "name");

    // Group leads by agent
    const agentMap = {};

    lists.forEach(item => {
      const agentName = item.agentId?.name || "Unassigned";

      if (!agentMap[agentName]) {
        agentMap[agentName] = [];
      }

      item.assignedLeads.forEach(lead => {
        agentMap[agentName].push({
          phone: lead.phone,
          notes: lead.notes,
        });
      });
    });

    // Convert grouped data into clean array
    const formatted = Object.entries(agentMap).map(([agentName, leads]) => ({
      agentName,
      totalLeads: leads.length,
      leads,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error in getDistributedLists:", err);
    res.status(500).json({ message: "Failed to fetch distributed lists" });
  }
};
