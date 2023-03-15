import { z } from "zod";

export enum Gender {
  male = 1,
  female = 0,
}

export const PatientDataSchema = z.object({
  patientid: z.string(), // uuid
  patientname: z.string().min(1),
  patienttype: z.string(),
  gender: z.nativeEnum(Gender),
  ageinmonth: z.number(), // bulan
  weight: z.number(), // kg
  targetinfusion: z.number(),
  updated_at: z.number(),
});

export type PatientData = typeof PatientDataSchema._output;

export const DeviceDataSchema = z.object({
  deviceid: z.string(),
  updated_at: z.number(),
  weightA: z.number(),
  weightB: z.number(),
});

export type DeviceData = typeof DeviceDataSchema._output;

export interface Usage {
  usageid: string;
  deviceid: string;
  patientid: PatientData["patientid"];
  patienref: `${PatientData["patientname"]}-${PatientData["updated_at"]}`;
  infusionid: string;
  startDateTime: number;
  endDateTime: number;
  initialWeightA: number;
  initialWeightB: number;
  currentWeightA: number;
  currentWeightB: number;
  rateDrop: number;
}

export interface RootData {
  usagestore: {
    [key: NonNullable<Usage["usageid"]>]: Usage;
  };
  devicestore: {
    [key: NonNullable<DeviceData["deviceid"]>]: DeviceData;
  };
  patientstore: {
    [key: NonNullable<PatientData["patientid"]>]: PatientData;
  };
}

export default RootData;
