import z from "zod";

export const messageSchema = z.string().nonempty("Message is required");
