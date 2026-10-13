import React from "react";
import GenericTaskPage from "../components/GenericTaskPage";

/**
 * TachesPage sert de vue dédiée à la gestion opérationnelle des tâches individuelles.
 * Note architecturale : exécute GenericTaskPage en mode "TACHE".
 */
export const TachesPage = (props) => {
  return <GenericTaskPage mode="TACHE" {...props} />;
};

export default React.memo(TachesPage);

