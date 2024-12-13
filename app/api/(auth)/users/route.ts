import { connect } from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server"

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse(
      "Error in fetching users" + (error as Error).message,
      { status: 500 }
    );
  }
}

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ user: newUser, message: "User is created" }),
      { status: 201 },
    )
  } catch (error) {
    return new NextResponse(
      "Error in creating user" + (error as Error).message,
      { status: 500 }
    );
  }
}

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;

    await connect();

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "ID or New usarname not found" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid User id" }),
        { status: 400 }
      );
    }

    const updateUser = await User.findByIdAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true },
    );

    if(!updateUser) {
      return new NextResponse(
        JSON.stringify({ umessage: "User not found in the database" }),
        { status: 400 },
      );
    }

    return new NextResponse(
      JSON.stringify({ user: updateUser, message: "User is update" }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(
      "Error in update user" + (error as Error).message,
      { status: 500 }
    );
  }
}

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "User Id is required" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid User id" }),
        { status: 400 }
      );
    }

    await connect();
    const deleteUser = await User.deleteOne({ _id: new Types.ObjectId(userId) });

    if(!deleteUser) {
      return new NextResponse(
        JSON.stringify({ umessage: "User not found in the database" }),
        { status: 400 },
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User is delete" }),
      { status: 200 },
    );

  } catch (error) {
    return new NextResponse(
      "Error in delete user" + (error as Error).message,
      { status: 500 }
    );
  }
}
