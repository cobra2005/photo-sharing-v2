import { createContext } from "react";

export const AdvancedFeaturesContext = createContext({
  advancedFeaturesEnabled: false,
  setAdvancedFeaturesEnabled: () => { },
});
