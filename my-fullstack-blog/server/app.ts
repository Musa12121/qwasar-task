import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/client";
import multer from "multer";
import path from "path";
import cookieParser from "cookie-parser";

const app = express();
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

const prisma = new PrismaClient();

//Multer
const storage = multer.diskStorage({
  destination: "uploads/",

  filename: (request, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${Date.now()}${extension}`);
  },
});

const fileTypeFilter = (request, file, callback) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    callback(null, true);
  } else {
    callback(new Error("Wrong file type"));
  }
};

const upload = multer({
  storage,
  fileFilter: fileTypeFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
//

const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const token = request.cookies.token;
  if (!token) {
    return response.status(401).json({
      message: "Authorization token is required",
    });
  }
  try {
    const isTokenCorrect = jwt.verify(token, process.env.JWT_SECRET!);
    response.locals.userId = isTokenCorrect.userId;
    response.locals.role = isTokenCorrect.role;
    next();
  } catch {
    return response.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

const adminMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (response.locals.role !== "admin") {
    return response.status(403).json({
      message: "Admin access required",
    });
  }
  next();
};

app.post("/api/auth/register", async (request, response) => {
  const { email, username, password } = request.body;
  if (email && username && password) {
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists && Object.keys(userExists).length > 0) {
      return response.status(409).json({
        message: "Email is already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
        createdAt: new Date(),
      },
    });
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "3h",
      },
    );

    response.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3 * 60 * 60 * 1000,
    });

    return response.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
    });
  }
  return response.status(400).json({
    message: "Email, username, and password are required",
  });
});

app.post("/api/auth/login", async (request, response) => {
  const { email, password } = request.body;
  if (email && password) {
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userExists) {
      return response.status(401).json({
        message: "Invalid email or password",
      });
    }
    const isEqual = await bcrypt.compare(password, userExists.passwordHash);
    if (isEqual) {
      const token = jwt.sign(
        { userId: userExists.id, role: userExists.role },
        process.env.JWT_SECRET!,
        { expiresIn: "3h" },
      );

      response.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 3 * 60 * 60 * 1000,
      });

      return response.status(200).json({
        token,
        user: {
          id: userExists.id,
          email: userExists.email,
          username: userExists.username,
          createdAt: userExists.createdAt,
          role: userExists.role,
        },
      });
    }
    return response.status(401).json({
      message: "Invalid email or password",
    });
  }
  return response.status(400).json({
    message: "Email and password are required",
  });
});

app.get("/api/auth/me", authMiddleware, async (request, response) => {
  const userId = response.locals.userId;
  const targetUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!targetUser) {
    return response.status(404).json({ message: "User not found" });
  }
  return response.json({
    id: targetUser.id,
    email: targetUser.email,
    username: targetUser.username,
    role: targetUser.role,
    createdAt: targetUser.createdAt,
  });
});

//CRUD

app.get("/api/posts", async (request, response) => {
  const result = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      user: true,
    },
  });
  return response.json(result);
});

app.get("/api/posts/:id", async (request, response) => {
  const parsedId = parseInt(request.params.id);
  const target = await prisma.post.findUnique({ where: { id: parsedId } });
  if (!target) {
    return response
      .status(404)
      .json({ message: "Couldn't find post with this id" });
  }
  const author = await prisma.user.findUnique({
    where: { id: target.authorId },
  });

  if (!author) {
    return response
      .status(404)
      .json({ message: "Couldn't find the author of this post" });
  }

  return response.json({
    ...target,
    author: {
      id: author.id,
      email: author.email,
      username: author.username,
      createdAt: author.createdAt,
    },
  });
});

app.post(
  "/api/posts",
  authMiddleware,
  upload.single("image"),
  async (request, response) => {
    const { title, content } = request.body;
    let imageUrl = null;
    if (request.file) {
      imageUrl = `/uploads/${request.file.filename}`;
    }
    if (!title || !title.trim()) {
      return response.status(400).json({
        message: "Title is required",
      });
    }

    if (!content || content.trim().length < 20) {
      return response.status(400).json({
        message: "Content must be at least 20 characters",
      });
    }

    const result = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        published: true,
        authorId: response.locals.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return response.status(201).json(result);
  },
);

app.put(
  "/api/posts/:id",
  authMiddleware,
  upload.single("image"),
  async (request, response) => {
    const parsedId = parseInt(request.params.id);
    const { title, content } = request.body;
    const target = await prisma.post.findUnique({ where: { id: parsedId } });
    if (!target) {
      return response
        .status(404)
        .json({ message: "Couldn't find post with this id" });
    }
    let imageUrl = target.imageUrl;

    if (request.file) {
      imageUrl = `/uploads/${request.file.filename}`;
    }
    if (
      target.authorId !== response.locals.userId &&
      response.locals.role !== "admin"
    ) {
      return response.status(403).json({
        message: "You are not allowed to edit this post",
      });
    }

    if (!title || !title.trim()) {
      return response.status(400).json({
        message: "Title is required",
      });
    }

    if (!content || content.trim().length < 20) {
      return response.status(400).json({
        message: "Content must be at least 20 characters",
      });
    }

    const updatedVersion = await prisma.post.update({
      where: { id: parsedId },
      data: {
        title,
        content,
        imageUrl,
        published: target.published,
        updatedAt: new Date(),
      },
    });

    return response.json(updatedVersion);
  },
);

app.delete("/api/posts/:id", authMiddleware, async (request, response) => {
  const parsedId = parseInt(request.params.id);
  const target = await prisma.post.findUnique({ where: { id: parsedId } });

  if (!target) {
    return response
      .status(404)
      .json({ message: "Couldn't find post with this id" });
  }

  if (
    target.authorId !== response.locals.userId &&
    response.locals.role !== "admin"
  ) {
    return response.status(403).json({
      message: "You are not allowed to edit this post",
    });
  }

  await prisma.post.delete({ where: { id: parsedId } });

  return response.sendStatus(204);
});

//Routes accessible only to admins

app.get(
  "/api/admin/users",
  authMiddleware,
  adminMiddleware,
  async (request, response) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return response.json(users);
  },
);

app.patch(
  "/api/admin/posts/:id/published",
  authMiddleware,
  adminMiddleware,
  async (request, response) => {
    const parsedId = parseInt(request.params.id);

    const target = await prisma.post.findUnique({
      where: { id: parsedId },
    });

    if (!target) {
      return response.status(404).json({
        message: "Couldn't find post with this id",
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id: parsedId },
      data: {
        published: !target.published,
        updatedAt: new Date(),
      },
    });

    return response.json(updatedPost);
  },
);

app.get(
  "/api/admin/posts",
  authMiddleware,
  adminMiddleware,
  async (request, response) => {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return response.json(posts);
  },
);

app.listen(5500, () => console.log("server started"));
