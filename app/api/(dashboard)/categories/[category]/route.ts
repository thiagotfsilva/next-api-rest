import { Category } from "@/lib/models/category";
import User from "@/lib/models/user";
import { connect } from "@/lib/db";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

// http://localhost:3000/api/categories/675c95966bcb446d6cc8e4bf?userId=675c36bd6bcb446d6cc8e4a7
export const PATCH = async (
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: { params: any }
) => {
  try {
    const categoryId = context.params.category;
    const body = await request.json();
    const { title } = body;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

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

    const category = await Category.findOne({
      _id: categoryId,
      user: userId
    });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 400 },
      );
    }

    const updateCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true },
    );

    return new NextResponse(
      JSON.stringify({ message: "Update category" , category: updateCategory }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(
      "Error in updating category" + (error as Error).message,
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
    const categoryId = context.params.category;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

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

    const category = await Category.findOne({
      _id: categoryId,
      user: userId
    });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 400 },
      );
    }

    const deleteCategory = await Category.findByIdAndDelete(categoryId)
    if (!deleteCategory) {
      return new NextResponse(
        JSON.stringify({ message: "fail to delete category" }),
        { status: 400 },
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Deleted category" }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(
      "Error in deleting category" + (error as Error).message,
      { status: 500 }
    );
  }
}
