"use node";

import z from "zod";
import { v } from "convex/values";
import { publicAction } from "../lib/crpc";

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendEmail = publicAction
  .input(
    z.object({
      to: z.string(),
      subject: z.string(),
      text: z.optional(z.string()),
      html: z.optional(z.string()),
    })
  )
  .action(async ({ ctx, input }) => {
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: input.to,
      subject: input.subject,
      text: input.text ?? undefined,
      html: input.html ?? undefined,
    });
  });