import type { Request, Response, NextFunction } from "express";
import { z, type ZodType } from "zod";

/**
 * Generic validation middleware factory.
 * Pass a Zod schema and it validates req.body against it.
 */
export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
        return;
      }

      // Replace body with parsed (cleaned) data
      req.body = result.data;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Validation error",
      });
    }
  };
};

// ── Validation Schemas ──────────────────────────────────────────────

export const registerSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .trim(),
  email: z
    .email("Please provide a valid email")
    .pipe(z.string({ error: "Email is required" }).toLowerCase().trim()),
  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const loginSchema = z.object({
  email: z
    .email("Please provide a valid email")
    .pipe(z.string({ error: "Email is required" }).toLowerCase().trim()),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

export const battleSchema = z.object({
  problem: z
    .string({ error: "Problem statement is required" })
    .min(5, "Problem must be at least 5 characters")
    .max(5000, "Problem must be at most 5000 characters")
    .trim(),
  modelA: z
    .string({ error: "Model A is required" })
    .min(1, "Model A is required")
    .trim(),
  modelB: z
    .string({ error: "Model B is required" })
    .min(1, "Model B is required")
    .trim(),
});
