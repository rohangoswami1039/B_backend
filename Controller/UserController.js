import prisma from "../DB/db.config.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (findUser) {
      return res.json({ status: 400, message: "Email Already Taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      status: 200,
      data: user,
      token,
      message: "User Created Successfully",
    });
  } catch (err) {
    res.json({ status: 400, message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.json({ status: 400, message: "Invalid Email or Password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({ status: 400, message: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ status: 200, data: user, token, message: "Login Successful" });
  } catch (err) {
    res.json({ status: 400, message: err.message });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ status: 200, data: users });
  } catch (err) {
    res.json({ status: 400, message: err.message });
  }
};

export const fetchUserById = async (req, res) => {
  const userId = req.params.id;
  const user = await prisma.user.findFirst({
    where: {
      id: Number(userId),
    },
  });

  res.json({ status: 200, data: user });
};

export const fetchUserByEmail = async (req, res) => {
  const { email, name } = req.body;
  if (email) {
    try {
      const findUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (findUser) {
        return res.json({ status: 200, data: findUser });
      } else {
        return res.json({ status: 400, message: "User Not Found" });
      }
    } catch (err) {
      res.json({ status: 400, message: err.message });
    }
  } else {
    console.log(name);
    try {
      const finduser = await prisma.user.findMany({
        where: {
          name: name,
        },
      });

      if (!finduser || finduser.length === 0) {
        return res.json({ status: 400, message: "User Not Found" });
      }

      res.json({ status: 200, data: finduser });
    } catch (err) {
      res.json({ status: 400, message: err.message });
    }
  }
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (findUser) {
    return res.json({ status: 400, message: "Email Already Taken" });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
  res.json({ status: 200, data: user, message: "User Created Successfully" });
};

export const UpdateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (findUser) {
      return res.json({ status: 400, message: "Email Already Taken" });
    }

    await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        name,
        email,
        password,
      },
    });
    res.json({ status: 200, message: "User Updated Successfully" });
  } catch (err) {
    res.json({ status: 400, message: err.message });
  }
};
