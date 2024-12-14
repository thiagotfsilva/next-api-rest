import { Category } from "@/lib/models/category";
import User from "@/lib/models/user";
import { connect } from "@/lib/db";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { Blog } from "@/lib/models/blog";

export const GET = async (
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: { params: any }
) => {
  try {
    const blogId = context.params.blog;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

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

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
        { status: 400 },
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404 },
      );
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 },
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found" }),
        { status: 404 },
      );
    }

    await blog.save();

    return new NextResponse(
      JSON.stringify({ blog }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(
      "Error in fetch categories" + (error as Error).message,
      { status: 500 }
    );
  }

}

export const PATCH = async (
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: { params: any }
) => {
  try {
    const blogId = context.params.blog;
    const body = await request.json();
    const { title, description } = body;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 },
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
        { status: 400 },
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404 },
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found" }),
        { status: 404 },
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    )
    if (!updatedBlog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog update failed" }),
        { status: 400 },
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Update blog" , updatedBlog }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(
      "Error in updating blog" + (error as Error).message,
      { status: 500 }
    );
  }
}

export const DELETE = async (
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: { params: any },
) => {
  try {
    const blogId = context.params.blog;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 },
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
        { status: 400 },
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404 },
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found" }),
        { status: 404 },
      );
    }

    const deleteBlog = await Blog.findByIdAndDelete(blogId)
    if (!deleteBlog) {
      return new NextResponse(
        JSON.stringify({ message: "fail to delete blog" }),
        { status: 400 },
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Deleted Blog" }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(
      "Error in deleting category" + (error as Error).message,
      { status: 500 }
    );
  }
}
