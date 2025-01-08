import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MedicalSystemModule = buildModule("MedicalSystemModule", (m) => {
  const medicalSystem = m.contract("MedicalSystem");

  return { medicalSystem };
});

export default MedicalSystemModule;
