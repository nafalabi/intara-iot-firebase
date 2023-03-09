export enum Gender {
    male = 1,
    female = 0,
}

export interface PatientData {
    patientid: string, // uuid
    patienname: string,
    patientype: string,
    gender: Gender,
    ageinmonth: number, // bulan
    weight: number, // kg
    targetinfusion: number,
    updated_at: number,
};

export interface DeviceData {
    deviceid: string,
    weightA: number,
    weightB: number,
    updated_at: number,
};

export interface Usage {
    usageid: string,
    deviceid: string,
    patientid: PatientData['patientid'],
    patienref: `${PatientData['patienname']}-${PatientData['updated_at']}`,
    infusionid: string,
    startDateTime: number,
    endDateTime: number,
    initialWeightA: number,
    initialWeightB: number,
    currentWeightA: number,
    currentWeightB: number,
    rateDrop: number,
};

export interface RootData {
    usagestore: {
        [key: Usage['usageid']] : Usage,
    },
    devicestore: {
        [key: DeviceData['deviceid']]: DeviceData,
    },
    patientstore: {
        [key: PatientData['patientid']]: PatientData,
    },
};

export default RootData;
