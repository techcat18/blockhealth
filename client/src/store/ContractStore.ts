import Web3, { Contract, ERR_RPC_UNAVAILABLE_RESOURCE, RpcError } from "web3";
import { flow, makeAutoObservable } from "mobx";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../../web3/constants";
import { UserRole } from "../types/UserRole";
import { Doctor } from "../types/Doctor";
import { Patient } from "../types/Patient";
import { parse } from "date-fns";

type State = "idle" | "pending" | "done" | "error";

export class ContractStore {
  state: State = "idle";
  error: string = "";
  account: string = "";
  userRole: UserRole = "unregistered";
  contract: Contract<typeof CONTRACT_ABI> | null = null;

  registrationError = "";
  isRegistrationRequested = false;

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
    const role = yield this.contract!.methods.getUserRole(this.account).call({
      from: this.account,
    });
    this.userRole = role.toLowerCase() as UserRole;
  });

  registerDoctor = flow(function* (this: ContractStore, doctor: Doctor) {
    this.isRegistrationRequested = true;
    try {
      yield this.contract!.methods.registerDoctor(doctor.name).send({
        from: this.account,
      });
      this.userRole = "doctor";
    } catch (error) {
      this.registrationError = (error as Error).message;
    } finally {
      this.isRegistrationRequested = false;
    }
  });

  registerPatient = flow(function* (this: ContractStore, patient: Patient) {
    this.isRegistrationRequested = true;
    try {
      yield this.contract!.methods.registerPatient(
        patient.name,
        parse(patient.birthdate, "dd.MM.yyyy", new Date()).getTime() / 1000,
        patient.gender
      ).send({
        from: this.account,
      });
      this.userRole = "patient";
    } catch (error) {
      this.registrationError = (error as Error).message;
    } finally {
      this.isRegistrationRequested = false;
    }
  });
}
