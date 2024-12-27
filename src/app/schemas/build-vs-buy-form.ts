import { z } from "zod";

export type StateComplexity = "low" | "medium" | "high";
export type RequirementsClarity = "clear" | "evolving" | "unclear";
export type CategoryMaturity = "emerging" | "established" | "mature";



// Zod schema for runtime validation
export const buildVsBuyFormSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  stateComplexity: z.enum(["low", "medium", "high"]),
  stateDescription: z.string().min(1, "State description is required"),
  requirementsClarity: z.enum(["clear", "evolving", "unclear"]),
  mvpDescription: z.string().min(1, "MVP description is required"),
  evolutionPath: z.string().min(1, "Evolution path is required"),
  categoryMaturity: z.enum(["emerging", "established", "mature"]),
  existingSolutions: z.string().min(1, "Existing solutions analysis is required"),
  teamCapabilities: z.string().min(1, "Team capabilities description is required"),
  questionResponses: z.record(z.string()).optional(),
}); 
export type BuildVsBuyFormData = z.infer<typeof buildVsBuyFormSchema>;

