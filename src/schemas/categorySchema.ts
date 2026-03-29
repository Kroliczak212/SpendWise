import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Min. 2 znaki").max(50, "Max. 50 znaków"),
  icon: z.string().min(1, "Wybierz ikonę"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Nieprawidłowy kolor"),
  type: z.enum(["income", "expense"]),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
