import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Bitte gib deinen Namen ein."),
  email: z.email("Bitte gib eine gültige E-Mail-Adresse ein."),
  password: z.string().min(8, "Das Passwort muss mindestens 8 Zeichen haben."),
});

export const loginSchema = z.object({
  email: z.email("Bitte gib eine gültige E-Mail-Adresse ein."),
  password: z.string().min(1, "Bitte gib dein Passwort ein."),
});
