import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { emailOTP, magicLink } from "better-auth/plugins";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Usa el servicio de tu preferencia (Ejemplo: Gmail, Outlook, etc.)
  auth: {
    user: "contigovoyproject@gmail.com", // Tu dirección de correo
    pass: "oefgkqoevpbgyktq", // Tu contraseña de correo o app password
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),

  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        const magicLink = `${url}?token=${token}`;

        // Configuración del correo
        const mailOptions = {
          from: "contigovoyproject@gmail.com",
          to: email,
          subject: "Tu enlace mágico",
          text: `Hola, puedes acceder a tu cuenta utilizando el siguiente enlace: ${magicLink}`,
          html: `<p>Hola,</p><p>Puedes acceder a tu cuenta utilizando el siguiente enlace:</p><a href="${magicLink}">Accede aquí</a>`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Correo enviado a ${email}`);
        } catch (error) {
          console.error(`Error al enviar correo a ${email}:`, error);
          throw new Error("No se pudo enviar el correo electrónico.");
        }
      },
    }),

    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Construye el cuerpo del mensaje
        const mailOptions = {
          from: "contigovoyproject@gmail.com",
          to: email,
          subject: "Tu código de verificación",
          text: `Hola, tu código OTP es: ${otp}. Úsalo para ${type}.`,
          html: `<p>Hola,</p><p>Tu código OTP es: <strong>${otp}</strong>.</p><p>Úsalo para ${type}.</p>`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`OTP enviado a ${email}`);
        } catch (error) {
          console.error(`Error al enviar OTP a ${email}:`, error);
          throw new Error("No se pudo enviar el correo electrónico.");
        }
      },
      otpLength: 6,
      expiresIn: 600,
    }),
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
