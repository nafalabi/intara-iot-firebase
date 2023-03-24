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
  patientid: z.string().optional(),
  updated_at: z.number(),
  weightA: z.number(),
  weightB: z.number(),
});

export type DeviceData = typeof DeviceDataSchema._output;

// Usage data only sent from iot device
export type UsageData = {
  usageid: `${DeviceData["deviceid"]}_${UsageData["time"]}`;
  deviceid: string;
  patientid: PatientData["patientid"];
  weightA: number;
  weightB: number;
  time: number; // epoch
  dropCount: number;
};

export interface RootData {
  usagestore: {
    [key: NonNullable<UsageData["usageid"]>]: UsageData;
  };
  devicestore: {
    [key: NonNullable<DeviceData["deviceid"]>]: DeviceData;
  };
  patientstore: {
    [key: NonNullable<PatientData["patientid"]>]: PatientData;
  };
}

export default RootData;
