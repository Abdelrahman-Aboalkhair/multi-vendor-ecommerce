import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async create({ args, query }: any) {
        if (args.data.password && typeof args.data.password === "string") {
          const hashedPassword = await bcrypt.hash(args.data.password, 10);
          args.data.password = hashedPassword;
        }

        return query(args);
      },

      async update({ args, query }: any) {
        if (args.data.password && typeof args.data.password === "string") {
          const hashedPassword = await bcrypt.hash(args.data.password, 10);
          args.data.password = hashedPassword;
        }

        return query(args);
      },
    },
  },
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

export default prisma;
