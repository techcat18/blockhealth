import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MedicalSystemModule = buildModule("MedicalSystemModule", (m) => {
  const lock = m.contract("MedicalSystem");

  return { lock };
});

export default MedicalSystemModule;
