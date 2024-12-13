
import { connect } from "@/lib/db";
import { Category } from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

// http://localhost:3000/api/categories?userId=${userId}
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        {
          status: 400,
        }
      );
    }

    const categories = await Category.find({ user: new Types.ObjectId(userId )});

    return new NextResponse(
      JSON.stringify(categories),
      { status: 200 },
    );

  } catch (error) {
    return new NextResponse(
      "Error in fetching categories" + (error as Error).message,
      { status: 500 }
    );
  }
}

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    const { title } = await request.json();

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        {
          status: 400,
        }
      );
    }

    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });

    await newCategory.save();

    return new NextResponse(
      JSON.stringify(newCategory),
      { status: 200 },
    );

  } catch (error) {
    return new NextResponse(
      "Error in create category" + (error as Error).message,
      { status: 500 }
    );
  }
}
