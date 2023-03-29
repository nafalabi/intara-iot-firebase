import { NextApiHandler } from "next";
import { verifyAuthToken } from "src/service/firebase-admin";

const withAuthGuard =
  (next: NextApiHandler): NextApiHandler =>
  async (req, res) => {
    const auth = req.headers["Authorization"] || req.headers['authorization'];

    if (!auth || Array.isArray(auth)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const matched = auth.match(/(Bearer\s)(.*)/);
    if (!matched) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = matched[2];

    try {
      await verifyAuthToken(token);
    } catch (error) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    return next(req, res);
  };

export default withAuthGuard;
