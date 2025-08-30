import { z } from "zod";

export const teamConfigSchema = z.object({
  ctName: z.string().min(1, "CT team name is required"),
  tName: z.string().min(1, "T team name is required"),
  ctLogoUrl: z.string().optional(),
  tLogoUrl: z.string().optional(),
  isCondensed: z.boolean().optional(),
});

export type TeamConfigFormData = z.infer<typeof teamConfigSchema>;