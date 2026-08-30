import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { random } from "./utils.js";
import {
  connectDB,
  ContentModel,
  LinkModel,
  UserModel,
} from "./db.js";
import { JWT_PASSWORD } from "./config.js";
import { userMiddleware } from "./middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

const signupSchema = z.object({
  username: z.string().min(3).max(30).trim(),
  password: z.string().min(6).max(100),
});

const signinSchema = z.object({
  username: z.string().min(3).max(30).trim(),
  password: z.string().min(6).max(100),
});

const contentSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  link: z.string().url(),
  type: z.string().min(1).max(50).trim(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
  });
});

app.post("/api/v1/signup", async (req: Request, res: Response) => {
  try {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid input",
        errors: result.error.flatten(),
      });
      return;
    }

    const { username, password } = result.data;

    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      res.status(409).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await UserModel.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User signed up",
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/api/v1/signin", async (req: Request, res: Response) => {
  try {
    const result = signinSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid input",
      });
      return;
    }

    const { username, password } = result.data;

    const existingUser = await UserModel.findOne({
      username,
    });

    if (!existingUser) {
      res.status(403).json({
        message: "Incorrect credentials",
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordMatch) {
      res.status(403).json({
        message: "Incorrect credentials",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: existingUser._id.toString(),
      },
      JWT_PASSWORD,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  try {
    const result = contentSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid content",
        errors: result.error.flatten(),
      });
      return;
    }

    const { title, link, type, content, tags } = result.data;

   const newContent = await ContentModel.create({
      title,
      link,
      type,
      content: content ?? "",
      userId: req.userId,
      tags: tags ?? [],
    });

    res.status(201).json({
      message: "Content added",
      content: newContent,
    });
  } catch (error) {
    console.error("Add content error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  try {
    const content = await ContentModel.find({
      userId: req.userId,
    }).populate("userId", "username");

    res.json({
      content,
    });
  } catch (error) {
    console.error("Get content error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.put("/api/v1/content/:id", userMiddleware, async (req, res) => {
  try {
    const result = contentSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid content",
        errors: result.error.flatten(),
      });
      return;
    }

    const { title, link, type, content, tags } = result.data;

    const updatedContent = await ContentModel.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        title,
        link,
        type,
        content: content ?? "",
        tags: tags ?? [],
      },
      {
        new: true,
      }
    );

    if (!updatedContent) {
      res.status(404).json({
        message: "Content not found",
      });
      return;
    }

    res.json({
      message: "Content updated",
      content: updatedContent,
    });
  } catch (error) {
    console.error("Update content error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  try {
    const contentId = req.body.contentId;

    if (!contentId) {
      res.status(400).json({
        message: "contentId is required",
      });
      return;
    }

    const deletedContent = await ContentModel.findOneAndDelete({
      _id: contentId,
      userId: req.userId,
    });

    if (!deletedContent) {
      res.status(404).json({
        message: "Content not found",
      });
      return;
    }

    res.json({
      message: "Deleted",
    });
  } catch (error) {
    console.error("Delete content error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  try {
    const share = req.body.share;

    if (typeof share !== "boolean") {
      res.status(400).json({
        message: "share must be a boolean",
      });
      return;
    }

    if (share) {
      const existingLink = await LinkModel.findOne({
        userId: req.userId,
      });

      if (existingLink) {
        res.json({
          hash: existingLink.hash,
        });
        return;
      }

      const hash = random(10);

      await LinkModel.create({
        userId: req.userId,
        hash,
      });

      res.json({
        hash,
      });

      return;
    }

    await LinkModel.deleteOne({
      userId: req.userId,
    });

    res.json({
      message: "Removed link",
    });
  } catch (error) {
    console.error("Share brain error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  try {
    const { shareLink } = req.params;

    const link = await LinkModel.findOne({
      hash: shareLink,
    });

    if (!link) {
      res.status(404).json({
        message: "Shared brain not found",
      });
      return;
    }

    const [content, user] = await Promise.all([
      ContentModel.find({
        userId: link.userId,
      }),
      UserModel.findById(link.userId).select("username"),
    ]);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.json({
      username: user.username,
      content,
    });
  } catch (error) {
    console.error("Get shared brain error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
};

startServer();