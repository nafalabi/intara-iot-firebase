import { database } from "firebase-admin";
import { v4 } from "uuid";
import type { NextApiHandler } from "next";
import { initializeFirebaseAdmin } from "src/service/firebase-admin";
import { PatientData, PatientDataSchema } from "src/service/data-definition";
import withAuthGuard from "src/guards/api-auth-guard";

const NewPatienDataSchema = PatientDataSchema.omit({
  patientid: true,
  updated_at: true,
});

const handler: NextApiHandler = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  initializeFirebaseAdmin();

  const result = NewPatienDataSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ success: false, message: "bad request", result });

  const { data } = result;
  const db = database();
  const _id = v4();
  const ref = db.ref(`/patientstore/${_id}`);

  const newData = {
    ...data,
    patientid: _id,
    updated_at: Date.now(),
  } as PatientData;

  ref.set(newData);

  return res.status(201).json({ success: true, data: newData });
};

export default withAuthGuard(handler);
