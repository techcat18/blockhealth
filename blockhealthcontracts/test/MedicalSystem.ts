import { ethers } from "hardhat";
import { expect } from "chai";
import { MedicalSystem } from "../typechain-types";
import { Signer } from "ethers";

describe("MedicalSystem", function () {
  let medicalSystem: MedicalSystem;
  let owner: Signer;
  let doctor: Signer;
  let patient: Signer;

  beforeEach(async function () {
    [owner, doctor, patient] = await ethers.getSigners();

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

  describe("Access management", function () {
    this.beforeEach(async function () {
      await medicalSystem
        .connect(owner)
        .registerPatient("John Doe", 19900101, 0);
      await medicalSystem
        .connect(patient)
        .registerPatient("John Black", 19900101, 0);
      await medicalSystem.connect(doctor).registerDoctor("Dr. Smith");
    });

    it("should allow patient to view its own medical records", async function () {
      const records = await medicalSystem
        .connect(owner)
        .viewMedicalRecords(owner.getAddress());

      expect(records).to.deep.equal([]);
    });

    it("shouldn't allow other patients to view patient medical records", async function () {
      expect(
        medicalSystem.connect(patient).viewMedicalRecords(owner.getAddress())
      ).to.be.revertedWith("Access denied");
    });

    it("shouldn't allow unauthorized doctors to view patient medical records", async function () {
      expect(
        medicalSystem.connect(doctor).viewMedicalRecords(owner.getAddress())
      ).to.be.revertedWith("Access denied");
    });

    it("shouldn't allow other patients to create medical records", async function () {
      expect(
        medicalSystem
          .connect(patient)
          .createMedicalRecord(owner.getAddress(), "Lorem ipsum odor")
      ).to.be.revertedWith("Doctor is not authorized for this patient");
    });

    it("shouldn't allow unauthorized doctors to create medical records", async function () {
      expect(
        medicalSystem
          .connect(doctor)
          .createMedicalRecord(owner.getAddress(), "Lorem ipsum odor")
      ).to.be.revertedWith("Doctor is not authorized for this patient");
    });

    describe("Doctor authorization", function () {
      this.beforeEach(async function () {
        await medicalSystem.connect(owner).authorizeDoctor(doctor.getAddress());
      });

      it("should allow a patient to authorize a doctor", async function () {
        const isAuthorized = await medicalSystem.isDoctorAuthorized(
          owner.getAddress(),
          doctor.getAddress()
        );
        expect(isAuthorized).to.be.true;
      });

      it("should allow an authorized doctor to access patient medical records", async function () {
        const records = await medicalSystem
          .connect(doctor)
          .viewMedicalRecords(owner.getAddress());

        expect(records).to.deep.equal([]);
      });
    });
  });

  describe("Medical records management", function () {
    this.beforeEach(async function () {
      await medicalSystem
        .connect(owner)
        .registerPatient("John Doe", 19900101, 0);
      await medicalSystem
        .connect(patient)
        .registerPatient("John Black", 19900101, 0);
      await medicalSystem.connect(doctor).registerDoctor("Dr. Smith");
      await medicalSystem.connect(owner).authorizeDoctor(doctor.getAddress());
      await medicalSystem
        .connect(doctor)
        .createMedicalRecord(
          owner.getAddress(),
          "Lorem ipsum odor amet, consectetuer adipiscing elit."
        );
    });

    it("should allow an authorized doctor to create medical record", async function () {
      const records = await medicalSystem
        .connect(doctor)
        .viewMedicalRecords(owner.getAddress());

      expect(records.length).be.above(0);
      expect(records[0].description).be.equal(
        "Lorem ipsum odor amet, consectetuer adipiscing elit."
      );
      expect(records[0].createdBy).be.equal(await doctor.getAddress());
    });

    it("should allow an authorized doctor to update medical record", async function () {
      await medicalSystem
        .connect(doctor)
        .updateMedicalRecord(owner.getAddress(), 0, "Lorem ipsum odor.");

      const records = await medicalSystem
        .connect(doctor)
        .viewMedicalRecords(owner.getAddress());

      expect(records[0].description).be.equal("Lorem ipsum odor.");
    });
    describe("Medical records attachments access", function () {
      it("shouldn't allow other patients to view patient medical record attachments", async function () {
        expect(
          medicalSystem
            .connect(patient)
            .viewAttachedFiles(owner.getAddress(), 0)
        ).be.revertedWith("Access denied");
      });

      it("shouldn't allow unauthorized doctor to view patient medical record attachments", async function () {
        expect(
          medicalSystem
            .connect(doctor)
            .viewAttachedFiles(patient.getAddress(), 0)
        ).be.revertedWith("Access denied");
      });

      it("should allow user to view his medical record attachments", async function () {
        const attachments = await medicalSystem
          .connect(owner)
          .viewAttachedFiles(owner.getAddress(), 0);

        expect(attachments).to.deep.equal([]);
      });

      it("should allow authorized doctor to view patient medical record attachments", async function () {
        const attachments = await medicalSystem
          .connect(doctor)
          .viewAttachedFiles(owner.getAddress(), 0);

        expect(attachments).to.deep.equal([]);
      });
    });

    describe("Medical records attachments management", function () {
      it("should allow patient to add attachments to his medical records", async function () {
        await medicalSystem
          .connect(owner)
          .attachFileToRecord(
            0,
            "https://drive.google.com/file/d/1Xu7Ius9xGlrxm-Fy_6l6dW_WExW0_tD-/view?usp=sharing",
            "356A192B7913B04C54574D18C28D46E6395428AB"
          );
        const attachments = await medicalSystem
          .connect(doctor)
          .viewAttachedFiles(owner.getAddress(), 0);

        expect(attachments.length).be.above(0);
        expect(attachments[0].fileHash).be.equal(
          "356A192B7913B04C54574D18C28D46E6395428AB"
        );
      });
    });
  });

  describe("Doctor patients", function () {
    this.beforeEach(async function () {
      await medicalSystem
        .connect(owner)
        .registerPatient("John Doe", 19900101, 0);
      await medicalSystem
        .connect(patient)
        .registerPatient("John Black", 19900101, 0);
      await medicalSystem.connect(doctor).registerDoctor("Dr. Smith");
    });

    it("should display empty list if doctor has no patients", async function () {
      const patients = await medicalSystem.connect(doctor).getPatients();

      expect(patients).to.deep.equal([]);
    });

    it("should display list of patient who authorized the doctor", async function () {
      await medicalSystem.connect(owner).authorizeDoctor(doctor.getAddress());
      const patients = await medicalSystem.connect(doctor).getPatients();

      expect(patients[0].name).to.be.equal("John Doe");
      expect(patients[0].authorizedDoctors.includes(await doctor.getAddress()))
        .to.be.true;
    });
  });
});
