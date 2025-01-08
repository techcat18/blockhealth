import { createContext, useContext } from "react";
import { ContractStore } from "./ContractStore";

export default ContractStore;

export const StoreContext = createContext<ContractStore>({} as ContractStore);

export const useStoreContext = (): ContractStore => useContext(StoreContext);
