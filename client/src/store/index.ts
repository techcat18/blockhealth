import { createContext, useContext } from "react";
import { RootStore } from "./RootStore";

export default RootStore;

export const StoreContext = createContext<RootStore>({} as RootStore);

export const useStoreContext = (): RootStore => useContext(StoreContext);
