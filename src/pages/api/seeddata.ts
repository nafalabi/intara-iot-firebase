import { database } from "firebase-admin";
import RootData, { DeviceData, Gender, PatientData } from "src/service/data-definition";
// import { initializeFirebaseAdmin } from "src/service/firebase-admin";

const devices: DeviceData[] = [
  {
    deviceid: "device-1",
    updated_at: Date.now(),
    weightA: 200,
    weightB: 200,
  },
  {
    deviceid: "device-2",
    updated_at: Date.now(),
    weightA: 200,
    weightB: 200,
  },
  {
    deviceid: "device-3",
    updated_at: Date.now(),
    weightA: 200,
    weightB: 200,
  },
];

const patients: PatientData[] = [
  {
    patientid: "patient-1", // uuid
    patienname: "cimeong",
    patientype: "kucing",
    gender: Gender.male,
    ageinmonth: 20, // bulan
    weight: 5, // kg
    targetinfusion: 200,
    updated_at: Date.now(),
  },
  {
    patientid: "patient-2", // uuid
    patienname: "cikapas",
    patientype: "kucing",
    gender: Gender.female,
    ageinmonth: 20, // bulan
    weight: 5, // kg
    targetinfusion: 200,
    updated_at: Date.now(),
  },
  {
    patientid: "patient-3", // uuid
    patienname: "ciguguk",
    patientype: "anjing",
    gender: Gender.male,
    ageinmonth: 20, // bulan
    weight: 8, // kg
    targetinfusion: 200,
    updated_at: Date.now(),
  },
];

export default function handler(req, res) {
  const data: RootData = {
    devicestore: devices.reduce(
      (prev, cur) => ({
        ...prev,
        [cur.deviceid]: cur,
      }),
      {}
    ),
    patientstore: patients.reduce(
      (prev, cur) => ({
        ...prev,
        [cur.patientid]: cur,
      }),
      {}
    ),
    usagestore: {},
  };

  const db = database();
  const ref = db.ref("/");
  ref.set(data);
  res.status(200).json({ text: "Sukses" });
}
