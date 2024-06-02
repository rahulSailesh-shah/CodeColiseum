import jwt from "jsonwebtoken";
import prisma from "@repo/db/client";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "94329485b369f8d57d68efbf0d7d0672ef34613804f880528ccc940fc2a0aa88";

export const extractUserId = async (token: string) => {
  console.log(JWT_SECRET);
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

  const user = await prisma.user.findFirst({
    where: {
      id: decoded.userId,
    },
  });

  return user;
};
