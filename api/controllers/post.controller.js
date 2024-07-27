import prisma from "../lib/prisma.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
  const { city, type, property, bedroom, minPrice, maxPrice } = req.query;
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: city || undefined,
        type: type || undefined,
        property: property || undefined,
        bedroom: bedroom ? parseInt(bedroom) : undefined,
        price: {
          gte: minPrice ? parseInt(minPrice) : undefined,
          lte: maxPrice ? parseInt(maxPrice) : undefined,
        },
      },
    });
    setTimeout(() => {
      res.status(200).json(posts);
    }, 1000);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get Posts!" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;

  // Validate ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ObjectID!" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get Post!" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;
  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add Post!" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;

  // Validate ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ObjectID!" });
  }

  try {
    // Update logic goes here
    res.status(200).json({ message: "Post updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update Post!" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  // Validate ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ObjectID!" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete Post!" });
  }
};
