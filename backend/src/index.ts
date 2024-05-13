import { Hono } from "hono";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = new Hono();

app.get("/", async (c) => {
    const users = await prisma.user.findMany();
    return c.json(users);
});

export default app;
