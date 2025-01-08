import Web3, { Contract, ERR_RPC_UNAVAILABLE_RESOURCE, RpcError } from "web3";
import { flow, makeAutoObservable } from "mobx";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../../web3/constants";
import { UserRole } from "../types/UserRole";

type State = "idle" | "pending" | "done" | "error";

export class ContractStore {
  state: State = "idle";
  account: string = "";
  error: string = "";
  userRole: UserRole = "unregistered";
  contract: Contract<typeof CONTRACT_ABI> | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  readonly loadBlockchainData = flow(function* (this: ContractStore) {
    if (!window.ethereum) {
      this.state = "done";
      return;
    }

    this.state = "pending";
    try {
      const web3 = new Web3(window.ethereum);
      yield window.ethereum.request({
        method: "eth_requestAccounts",
        params: [],
      });
      const accounts = yield web3.eth.getAccounts();

      this.account = accounts[0];
      this.contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      yield this.fetchUserRole();
      this.state = "done";
    } catch (error) {
      if ((error as RpcError).code == ERR_RPC_UNAVAILABLE_RESOURCE) {
        this.error = "Please connect your crypto wallet to the site";
        this.state = "error";
        return;
      }

      this.error = (error as Error).message;
      this.state = "error";
    }
  });

  private readonly fetchUserRole = flow(function* (this: ContractStore) {
    try {
      const role = yield this.contract!.methods.getUserRole().call({
        from: this.account,
      });
      this.userRole = role.toLowerCase() as UserRole;
    } catch (error) {
      this.error = (error as Error).message;
      this.state = "error";
    }
  });
}
