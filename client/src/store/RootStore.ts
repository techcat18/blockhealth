import { ContractStore } from "./ContractStore";
import SnackBarStore from "./SnackBarStore";

export class RootStore {
  snackBarStore = new SnackBarStore();
  contractStore = new ContractStore(this);
}
