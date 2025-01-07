//SPDX-Licence-Identifier:MIT
pragma solidity ^0.8.0;

contract MedicalSystem {
    uint public recordId;
    struct Doctor {
        string name;
        Patient[] patients;
    }

    struct Patient {
        string name;
        Gender gender;
        uint256 birthDate;
        MedicalRecord[] records;
        address[] authorizedDoctors;
    }

    enum Gender {
        MALE,
        FEMALE,
        OTHER
    }

    struct MedicalRecord {
        uint recordId;
        uint timestamp;
        address createdBy;
        string description;
    }

    struct Attachment {
        string fileUrl;
        string fileHash;
        uint256 timestamp;
    }

    mapping(address => Doctor) public doctors;
    mapping(address => Patient) public patients;
    mapping(uint => Attachment[]) private attachments;

    event DoctorRegistered(address indexed doctorAddress, string name);
    event PatientRegistered(
        address indexed patientAddress,
        string name,
        Gender gender,
        uint256 birthDate
    );
    event DoctorAuthorized(address indexed patient, address indexed doctor);
    event MedicalRecordCreated(
        uint indexed recordId,
        address patient,
        address doctor,
        string description
    );
    event MedicalRecordUpdated(
        uint indexed recordId,
        address patient,
        address doctor,
        string newDescription
    );
    event AttachmentAdded(
        uint indexed recordId,
        address patient,
        string fileUrl,
        string fileHash,
        uint256 timestamp
    );

    function isDoctorAuthorized(
        address _patient,
        address _doctor
    ) public view returns (bool) {
        address[] memory authorizedDoctors = patients[_patient]
            .authorizedDoctors;
        for (uint256 i = 0; i < authorizedDoctors.length; i++) {
            if (authorizedDoctors[i] == _doctor) {
                return true;
            }
        }
        return false;
    }

    function isRegisteredDoctor(address _user) public view returns (bool) {
        return bytes(doctors[_user].name).length > 0;
    }

    function isRegisteredPatient(address _user) public view returns (bool) {
        return bytes(patients[_user].name).length > 0;
    }

    modifier onlyAuthorizedDoctor(address _patient) {
        require(
            isDoctorAuthorized(_patient, msg.sender),
            "Doctor is not authorized for this patient"
        );
        _;
    }

    modifier onlyRegisteredPatient(address _patient) {
        require(isRegisteredPatient(_patient), "Patient not registered");
        _;
    }

    modifier onlyRegisteredDoctor(address _doctor) {
        require(isRegisteredDoctor(_doctor), "Doctor not registered");
        _;
    }

    function getUserRole(address _user) public view returns (string memory) {
        if (isRegisteredDoctor(_user)) {
            return "Doctor";
        } else if (isRegisteredPatient(_user)) {
            return "Patient";
        } else {
            return "Unregistered";
        }
    }

    function registerDoctor(string memory _name) external {
        require(
            bytes(doctors[msg.sender].name).length == 0,
            "Doctor already registered"
        );

        Doctor storage doctor = doctors[msg.sender];
        doctor.name = _name;

        emit DoctorRegistered(msg.sender, _name);
    }

    function registerPatient(
        string memory _name,
        uint256 _birthDate,
        Gender _gender
    ) external {
        require(
            bytes(patients[msg.sender].name).length == 0,
            "Patient already registered"
        );

        Patient storage patient = patients[msg.sender];
        patient.name = _name;
        patient.gender = _gender;
        patient.birthDate = _birthDate;

        emit PatientRegistered(msg.sender, _name, _gender, _birthDate);
    }

    function authorizeDoctor(
        address _doctor
    ) external onlyRegisteredPatient(msg.sender) onlyRegisteredDoctor(_doctor) {
        require(
            !isDoctorAuthorized(msg.sender, _doctor),
            "Doctor is already authorized for this patient"
        );

        patients[msg.sender].authorizedDoctors.push(_doctor);
        doctors[_doctor].patients.push(patients[msg.sender]);

        emit DoctorAuthorized(msg.sender, _doctor);
    }

    function createMedicalRecord(
        address _patient,
        string memory _description
    ) external onlyAuthorizedDoctor(_patient) {
        recordId++;
        MedicalRecord memory newRecord = MedicalRecord({
            recordId: recordId,
            description: _description,
            createdBy: msg.sender,
            timestamp: block.timestamp
        });

        patients[_patient].records.push(newRecord);

        emit MedicalRecordCreated(recordId, _patient, msg.sender, _description);
    }

    function updateMedicalRecord(
        address _patient,
        uint256 _recordIndex,
        string memory _newDescription
    ) external onlyAuthorizedDoctor(_patient) {
        require(
            _recordIndex < patients[_patient].records.length,
            "Record does not exists"
        );

        patients[_patient].records[_recordIndex].description = _newDescription;
        patients[_patient].records[_recordIndex].timestamp = block.timestamp;

        emit MedicalRecordUpdated(
            patients[_patient].records[_recordIndex].recordId,
            _patient,
            msg.sender,
            _newDescription
        );
    }

    function viewMedicalRecords(
        address _patient
    ) external view returns (MedicalRecord[] memory) {
        require(
            isDoctorAuthorized(_patient, msg.sender) || msg.sender == _patient,
            "Access denied"
        );

        return patients[_patient].records;
    }

    function getPatients()
        external
        view
        onlyRegisteredDoctor(msg.sender)
        returns (Patient[] memory)
    {
        return doctors[msg.sender].patients;
    }

    function attachFileToRecord(
        uint256 _recordIndex,
        string memory _fileUrl,
        string memory _fileHash
    ) external onlyRegisteredPatient(msg.sender) {
        require(
            _recordIndex < patients[msg.sender].records.length,
            "Record does not exist"
        );

        uint _recordId = patients[msg.sender].records[_recordIndex].recordId;
        attachments[_recordId].push(
            Attachment({
                fileUrl: _fileUrl,
                fileHash: _fileHash,
                timestamp: block.timestamp
            })
        );

        emit AttachmentAdded(
            _recordId,
            msg.sender,
            _fileUrl,
            _fileHash,
            block.timestamp
        );
    }

    function viewAttachedFiles(
        address _patient,
        uint256 _recordIndex
    ) external view returns (Attachment[] memory) {
        require(
            isDoctorAuthorized(_patient, msg.sender) || msg.sender == _patient,
            "Access denied"
        );
        require(
            _recordIndex < patients[_patient].records.length,
            "Record does not exist"
        );

        uint _recordId = patients[_patient].records[_recordIndex].recordId;
        return attachments[_recordId];
    }
}
