import Web3, { Contract, ERR_RPC_UNAVAILABLE_RESOURCE, RpcError } from "web3";
import { flow, makeAutoObservable } from "mobx";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../../web3/constants";
import { UserRole } from "../types/UserRole";
import { Doctor } from "../types/Doctor";
import { Patient } from "../types/Patient";
import { format, parse } from "date-fns";
import { MedicalRecord, MedicalRecordWithIndex } from "../types/MedicalRecord";
import { RootStore } from "./RootStore";
import { Attachment } from "../types/Attachment";
import { Gender } from "../types/Gender";

type State = "idle" | "pending" | "done" | "error";

export class ContractStore {
  rootStore: RootStore;

  state: State = "idle";
  error: string = "";
  account: string = "";
  userRole: UserRole = "unregistered";
  contract: Contract<typeof CONTRACT_ABI> | null = null;

  registrationError = "";
  isRegistrationRequested = false;

  isFetching = false;
  dashboardError = "";
  isSendingRequest = false;

  patients: Patient[] = [];
  patientsFilter = "";
  medicalRecords: MedicalRecord[] = [];

  attachmentsError = "";
  isFetchingAttachments = false;
  selectedRecord: MedicalRecordWithIndex | null = null;

  get filteredPatients() {
    if (!this.patientsFilter) {
      return this.patients;
    }

    return this.patients.filter(
      (p) =>
        p.name.includes(this.patientsFilter) ||
        this.patientsFilter.includes(p.name)
    );
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  getSelectedPatient(address: string) {
    return this.patients.find((p) => p.addr == address);
  }

  setPatientsFilter = (value: string) => {
    this.patientsFilter = value;
  };

  setSelectedRecord(record: MedicalRecord, index: number) {
    this.selectedRecord = { ...record, index };
  }

  clearSelectedRecord() {
    this.selectedRecord = null;
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
        parse(patient.birthDate, "dd.MM.yyyy", new Date()).getTime() / 1000,
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

  fetchOwnMedicalRecords = flow(function* (this: ContractStore) {
    this.isFetching = true;
    try {
      const medicalRecords = yield this.contract!.methods.viewMedicalRecords(
        this.account
      ).call({
        from: this.account,
      });
      this.medicalRecords = medicalRecords;
    } catch (err) {
      this.dashboardError = (err as Error).message;
    } finally {
      this.isFetching = false;
    }
  });

  fetchPatientMedicalRecords = flow(function* (
    this: ContractStore,
    patientAddr: string
  ) {
    this.isFetching = true;
    try {
      const medicalRecords = yield this.contract!.methods.viewMedicalRecords(
        patientAddr
      ).call({
        from: this.account,
      });
      this.medicalRecords = medicalRecords;
    } catch (err) {
      this.dashboardError = (err as Error).message;
    } finally {
      this.isFetching = false;
    }
  });

  authorizeDoctor = flow(function* (this: ContractStore, doctorAddr: string) {
    this.isSendingRequest = true;
    try {
      yield this.contract!.methods.authorizeDoctor(doctorAddr).send({
        from: this.account,
      });
      this.rootStore.snackBarStore.showSnackBar("Doctor authorized", "success");
    } catch (err) {
      if ((err as Error).message.indexOf("Internal JSON-RPC") != -1) {
        this.rootStore.snackBarStore.showSnackBar(
          "Doctor already authorized",
          "error"
        );
      } else {
        this.rootStore.snackBarStore.showSnackBar("Invalid address", "error");
      }
    } finally {
      this.isSendingRequest = false;
    }
  });

  fetchPatients = flow(function* (this: ContractStore) {
    this.isFetching = true;
    try {
      const patients = yield this.contract!.methods.getPatients().call({
        from: this.account,
      });
      this.patients = (patients as Record<keyof Patient, unknown>[]).map(
        (p) => ({
          name: p.name as string,
          addr: p.addr as string,
          gender: p.gender as Gender,
          birthDate: format(
            new Date(Number(p.birthDate as bigint) * 1000),
            "dd.mm.yyyy"
          ),
        })
      );
    } catch (err) {
      this.dashboardError = (err as Error).message;
    } finally {
      this.isFetching = false;
    }
  });

  createMedicalRecord = flow(function* (
    this: ContractStore,
    patientAddr: string,
    description: string
  ) {
    this.isSendingRequest = true;
    try {
      yield this.contract!.methods.createMedicalRecord(
        patientAddr,
        description
      ).send({
        from: this.account,
      });
      this.rootStore.snackBarStore.showSnackBar(
        "Medical record created",
        "success"
      );
    } catch (error) {
      console.log(error);
      this.rootStore.snackBarStore.showSnackBar(
        (error as Error).message,
        "error"
      );
    } finally {
      this.isSendingRequest = false;
    }
  });

  updateMedicalRecord = flow(function* (
    this: ContractStore,
    patientAddr: string,
    description: string
  ) {
    this.isSendingRequest = true;
    try {
      yield this.contract!.methods.updateMedicalRecord(
        patientAddr,
        this.selectedRecord!.index,
        description
      ).send({
        from: this.account,
      });
      this.selectedRecord = null;
      this.rootStore.snackBarStore.showSnackBar(
        "Medical record created",
        "success"
      );
    } catch (error) {
      console.log(error);
      this.rootStore.snackBarStore.showSnackBar(
        (error as Error).message,
        "error"
      );
    } finally {
      this.isSendingRequest = false;
    }
  });

  addAttachmentToRecord = flow(function* (
    this: ContractStore,
    index: number,
    attachment: Attachment
  ) {
    this.isSendingRequest = true;
    try {
      yield this.contract!.methods.attachFileToRecord(
        index,
        attachment.fileUrl,
        attachment.fileHash
      ).send({
        from: this.account,
      });
      this.rootStore.snackBarStore.showSnackBar("Attachment added", "success");
    } catch (error) {
      console.log(error);
      this.rootStore.snackBarStore.showSnackBar(
        "Failed to add attachment to the medical record",
        "error"
      );
    } finally {
      this.isSendingRequest = false;
    }
  });

  fetchRecordAttachments = flow(function* (
    this: ContractStore,
    index: number,
    patientAddr = this.account
  ) {
    this.isFetchingAttachments = true;
    try {
      const attachments = yield this.contract!.methods.viewAttachedFiles(
        patientAddr,
        index
      ).call({
        from: this.account,
      });
      this.medicalRecords[index].attachments = attachments;
    } catch (err) {
      this.attachmentsError = (err as Error).message;
    } finally {
      this.isFetchingAttachments = false;
    }
  });
}
