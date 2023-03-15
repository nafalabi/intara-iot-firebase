import { database } from 'firebase-admin';
import { v4 } from 'uuid';
import type { NextApiHandler } from 'next'

const create = (data) => {

};

const edit = (id, data) => {

};

const handler: NextApiHandler = (req, res) => {

  // const db = database();
  // const ref = db.ref(`/patientstore/${_id}`);
  res.status(200).json({ text: "Sukses" });
};

export default handler;
