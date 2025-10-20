import mongoose from "mongoose";

const assignedListSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
  assignedLeads: [
    {
      firstName: { type: String },
      phone: { type: String },
      notes: { type: String },
    },
  ],
});

const AssignedList = mongoose.model("AssignedList", assignedListSchema);
export default AssignedList;
