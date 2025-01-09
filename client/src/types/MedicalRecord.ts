import { Attachment } from "./Attachment";

export type MedicalRecord = {
  recordId: number;
  timestamp: number;
  createdBy: string;
  description: string;
  attachments: Attachment[];
};

export type MedicalRecordWithIndex = MedicalRecord & { index: number };
