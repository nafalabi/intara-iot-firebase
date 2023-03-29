import { database } from "firebase-admin";
import { v4 } from "uuid";
import type { NextApiHandler } from "next";
import { initializeFirebaseAdmin } from "src/service/firebase-admin";
import { DeviceData, DeviceDataSchema } from "src/service/data-definition";
import withAuthGuard from "src/guards/api-auth-guard";

const NewDeviceDataSchema = DeviceDataSchema.omit({
  updated_at: true,
});

const handler: NextApiHandler = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  initializeFirebaseAdmin();

  const result = NewDeviceDataSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ success: false, message: "bad request", result });

  const { data } = result;
  const db = database();
  const _id = data.deviceid;
  const ref = db.ref(`/devicestore/${_id}`);

  const newData = {
    ...data,
    updated_at: Date.now(),
  } as DeviceData;

  ref.set(newData);

  return res.status(201).json({ success: true, data: newData });
};

export default withAuthGuard(handler);
