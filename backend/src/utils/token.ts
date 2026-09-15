import jwt from "jsonwebtoken";

const generateToken = async (data: object) => {
  const token = await jwt.sign(data, process.env.JWT_SECRET as string, {
    expiresIn:
      parseInt(process.env.JWT_EXPIRY || "") || 30 * 1000 * 60 * 60 * 24,
  });
  return token;
};

const verifyToken = async (token: string) => {
  const data = await jwt.verify(token, process.env.JWT_SECRET as string);
  return data;
};

export { generateToken, verifyToken };
