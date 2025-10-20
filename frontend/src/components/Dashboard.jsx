import { useState } from "react";
import { FaUserPlus, FaFileUpload, FaTasks, FaHome, FaBars, FaSignOutAlt } from "react-icons/fa";
import Agents from "./Agents";
import FileUpload from "./FileUpload";
import DistributedLists from "./DistributedLists";

export default function Dashboard({ onLogout }) {
  const [selected, setSelected] = useState("welcome");
  const [collapsed, setCollapsed] = useState(false);

  const renderContent = () => {
    switch (selected) {
      case "addAgent":
        return <Agents />;
      case "upload":
        return <FileUpload />;
      case "distributed":
        return <DistributedLists />;
      default:
        return (
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold">Welcome, Admin!</h2>
            <p className="text-gray-500 mt-2">
              Select an option from the sidebar to get started.
            </p>
          </div>
        );
    }
  };

  const menuItems = [
    { key: "welcome", label: "Home", icon: <FaHome /> },
    { key: "addAgent", label: "Add Agent", icon: <FaUserPlus /> },
    { key: "upload", label: "Upload Leads", icon: <FaFileUpload /> },
    { key: "distributed", label: "Distributed Lists", icon: <FaTasks /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md p-4 flex flex-col justify-between transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div>
          {/* Collapse toggle */}
          <div
            className="flex justify-end mb-6 cursor-pointer text-gray-600 hover:text-gray-900"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FaBars size={20} />
          </div>

          {/* Menu items */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-left transition-colors duration-200 ${
                  selected === item.key
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelected(item.key)}
              >
                <span>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout button */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            onLogout();
          }}
          className="flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200 mt-6"
        >
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
}
