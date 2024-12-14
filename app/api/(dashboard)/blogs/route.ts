import { connect } from "@/lib/db";
import { Blog } from "@/lib/models/blog";
import { Category } from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
  try {
    const { searchParams } =  new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeyWord = searchParams.get("keywords");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 },
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 },
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 400 },
      );
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 400 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId)
    }

    if (searchKeyWord) {
      filter.$or = [
        {
          title: { $regex: searchKeyWord, $options: "i" },
        },
        {
          description: { $regex: searchKeyWord, $options: "i" },
        },
      ];
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate),
      };
    }

    const pageSanitize = page ? parseInt(page) : 1;
    const limitSanitize = limit ? parseInt(limit) : 10;
    const skip = (pageSanitize - 1) * limitSanitize;

    const blogs = await Blog
      .find(filter)
      .sort({ createdAt: "asc"})
      .skip(skip)
      .limit(limitSanitize);

    return new NextResponse(
      JSON.stringify({ blogs }),
      { status: 200 },
    );

  } catch (error) {
    return new NextResponse(
      "Error in fetching blogs" + (error as Error).message,
      { status: 500 },
    );
  }
}

export const POST = async (request: Request) => {
  try {
    const { searchParams } =  new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const body = await request.json();
    const { title, description } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 },
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 },
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 400 },
      );
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 400 },
      );
    }

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    })

    await newBlog.save();

    return new NextResponse(
      JSON.stringify({ blog: newBlog }),
      { status: 200 },
    );

  } catch (error) {
    return new NextResponse(
      "Error in fetching blogs" + (error as Error).message,
      { status: 500 },
    );
  }
}

