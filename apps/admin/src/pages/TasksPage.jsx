import React from "react";
import GenericTaskPage from "../components/GenericTaskPage";

/**
 * TasksPage sert de vue dédiée à la gestion des missions opérationnelles.
 * Note architecturale : exécute GenericTaskPage en mode "MISSION".
 */
export const TasksPage = (props) => {
  return <GenericTaskPage mode="MISSION" {...props} />;
};

export default React.memo(TasksPage);

