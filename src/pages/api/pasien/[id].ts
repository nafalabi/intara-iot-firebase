import { database } from "firebase-admin";
import type { NextApiHandler } from "next";
import { initializeFirebaseAdmin } from "src/service/firebase-admin";
import { PatientDataSchema } from "src/service/data-definition";
import withAuthGuard from "src/guards/api-auth-guard";

const NewPatienDataSchema = PatientDataSchema.omit({
  patientid: true,
  updated_at: true,
});

const handleEdit: NextApiHandler = async (req, res) => {
  const { id } = req.query;

  const result = NewPatienDataSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ success: false, message: "bad request", result });

  const { data } = result;

  const db = database();
  const ref = db.ref(`/patientstore/${id}`);
  const oldData = (await ref.get()).val();

  const newData = {
    ...oldData,
    ...data,
    updated_at: Date.now(),
  };

  await ref.set(newData);

  res.status(200).json({ success: "true", message: `success updating ${id}`, data: newData });
};

const handleDelete: NextApiHandler = async (req, res) => {
  const { id } = req.query;

  const db = database();
  const ref = db.ref(`/patientstore/${id}`);

  await ref.remove();

  res.status(200).json({ success: true, message: `success deleting ${id}` });
};

const handler: NextApiHandler = (req, res) => {
  initializeFirebaseAdmin();

  if (req.method === "PATCH" || req.method === "PUT") {
    return handleEdit(req, res);
  }

  if (req.method === "DELETE") {
    return handleDelete(req, res);
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
};

export default withAuthGuard(handler);
