export const CONTRACT_ADDRESS = "0xac1Cf68fbDDb8FC18e9c47d120009FB65c2C14d8";

export const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "recordId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "fileUrl",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "fileHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "AttachmentAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "doctor",
        type: "address",
      },
    ],
    name: "DoctorAuthorized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "doctorAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "DoctorRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "recordId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "doctor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "MedicalRecordCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "recordId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "doctor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "newDescription",
        type: "string",
      },
    ],
    name: "MedicalRecordUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "patientAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "enum MedicalSystem.Gender",
        name: "gender",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "birthDate",
        type: "uint256",
      },
    ],
    name: "PatientRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_recordIndex",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_fileUrl",
        type: "string",
      },
      {
        internalType: "string",
        name: "_fileHash",
        type: "string",
      },
    ],
    name: "attachFileToRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_doctor",
        type: "address",
      },
    ],
    name: "authorizeDoctor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_patient",
        type: "address",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
    ],
    name: "createMedicalRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "doctors",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPatients",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "enum MedicalSystem.Gender",
            name: "gender",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "birthDate",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "recordId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "createdBy",
                type: "address",
              },
              {
                internalType: "string",
                name: "description",
                type: "string",
              },
            ],
            internalType: "struct MedicalSystem.MedicalRecord[]",
            name: "records",
            type: "tuple[]",
          },
          {
            internalType: "address[]",
            name: "authorizedDoctors",
            type: "address[]",
          },
        ],
        internalType: "struct MedicalSystem.Patient[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserRole",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_patient",
        type: "address",
      },
      {
        internalType: "address",
        name: "_doctor",
        type: "address",
      },
    ],
    name: "isDoctorAuthorized",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "isRegisteredDoctor",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "isRegisteredPatient",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "patients",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "enum MedicalSystem.Gender",
        name: "gender",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "birthDate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "recordId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "registerDoctor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_birthDate",
        type: "uint256",
      },
      {
        internalType: "enum MedicalSystem.Gender",
        name: "_gender",
        type: "uint8",
      },
    ],
    name: "registerPatient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_patient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_recordIndex",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_newDescription",
        type: "string",
      },
    ],
    name: "updateMedicalRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_patient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_recordIndex",
        type: "uint256",
      },
    ],
    name: "viewAttachedFiles",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "fileUrl",
            type: "string",
          },
          {
            internalType: "string",
            name: "fileHash",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct MedicalSystem.Attachment[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_patient",
        type: "address",
      },
    ],
    name: "viewMedicalRecords",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "recordId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "createdBy",
            type: "address",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
        ],
        internalType: "struct MedicalSystem.MedicalRecord[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
