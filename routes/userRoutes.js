import { Router } from "express";
import {
  UpdateUser,
  createUser,
  fetchUser,
  fetchUserByEmail,
  fetchUserById,
  loginUser,
  registerUser,
} from "../Controller/UserController.js";
import authenticateJWT from "../Middleware/authenticate.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/create", authenticateJWT, createUser);
router.put("/update/:id", authenticateJWT, UpdateUser);
router.get("/users", authenticateJWT, fetchUser);
router.get("/users/:id", authenticateJWT, fetchUserById);
router.post("/users/email", authenticateJWT, fetchUserByEmail);

export default router;
