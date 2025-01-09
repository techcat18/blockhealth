import { Attachment } from "./Attachment";

export type MedicalRecord = {
  recordId: number;
  timestamp: string;
  createdBy: string;
  description: string;
  attachments: Attachment[];
};

export type MedicalRecordWithIndex = MedicalRecord & { index: number };
