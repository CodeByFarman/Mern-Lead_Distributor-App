import { createContext, useState, useContext } from "react";

const LeadsContext = createContext();

export const LeadsProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const refreshLists = () => setRefreshTrigger(prev => !prev);

  return (
    <LeadsContext.Provider value={{ refreshTrigger, refreshLists }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => useContext(LeadsContext);
