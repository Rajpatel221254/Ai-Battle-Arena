import express from "express";
import { register, login } from "../controller/auth.controller.js";
import {
  validate,
  registerSchema,
  loginSchema,
} from "../middlewares/validate.middleware.js";

const authRouter = express.Router();

// POST /api/auth/register
authRouter.post("/register", validate(registerSchema), register);

// POST /api/auth/login
authRouter.post("/login", validate(loginSchema), login);

export default authRouter;