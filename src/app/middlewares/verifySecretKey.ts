import type { NextApiRequest, NextApiResponse } from 'next';
import { SECRET_KEY } from 'utils/config';

const verifySecretKey = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  const { key } = req.query;
  if (key === SECRET_KEY) return next();
  return res.status(400).send({
    code: 403,
    message: 'Access Forbidden.',
    error: true
  });
};

export default verifySecretKey;
