import { ethers } from "hardhat";
import { expect } from "chai";
import { MedicalSystem } from "../typechain-types";
import { Signer } from "ethers";

describe("MedicalSystem", function () {
  let medicalSystem: MedicalSystem;
  let doctor: Signer, patient: Signer;

  beforeEach(async function () {
    [doctor, patient] = await ethers.getSigners();

    const MedicalSystem = await ethers.getContractFactory("MedicalSystem");
    medicalSystem = await MedicalSystem.deploy();
    await medicalSystem.waitForDeployment();
  });

  it("should register a doctor", async function () {
    await medicalSystem.connect(doctor).registerDoctor("Dr. Smith");
    const registeredDoctor = await medicalSystem.doctors(doctor.getAddress());
    expect(registeredDoctor).to.equal("Dr. Smith");
  });

  it("should register a patient", async function () {
    await medicalSystem
      .connect(patient)
      .registerPatient("John Doe", 19900101, 0);
    const registeredPatient = await medicalSystem.patients(
      patient.getAddress()
    );
    expect(registeredPatient.name).to.equal("John Doe");
    expect(registeredPatient.gender).to.equal(0);
    expect(registeredPatient.birthDate).to.equal(19900101);
  });

  it("should allow a patient to authorize a doctor", async function () {
    await medicalSystem
      .connect(patient)
      .registerPatient("John Doe", 19900101, 0);
    await medicalSystem.connect(doctor).registerDoctor("Dr. Smith");

    await medicalSystem.connect(patient).authorizeDoctor(doctor.getAddress());

    const isAuthorized = await medicalSystem.isDoctorAuthorized(
      patient.getAddress(),
      doctor.getAddress()
    );
    expect(isAuthorized).to.be.true;
  });

  it("should allow an authorized doctor to create record for patient", async function () {
    await medicalSystem
      .connect(patient)
      .registerPatient("John Doe", 19900101, 0);
    await medicalSystem.connect(doctor).registerDoctor("Dr. Smith");
    await medicalSystem.connect(patient).authorizeDoctor(doctor.getAddress());
    await medicalSystem.createMedicalRecord(
      patient.getAddress(),
      "Lorem ipsum odor amet, consectetuer adipiscing elit."
    );
    const records = await medicalSystem
      .connect(doctor)
      .viewMedicalRecords(patient.getAddress());

    expect(records[0].description).to.equal(
      "Lorem ipsum odor amet, consectetuer adipiscing elit."
    );
    expect(records[0].createdBy).to.equal(await doctor.getAddress());
  });
});
