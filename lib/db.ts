import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URL

export const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if(connectionState === 1) {
      console.log("Already connnected");
      return;
    }

    if(connectionState === 2) {
      console.log("Connecting...");
      return;
    }

    try {
        mongoose.connect(MONGODB_URI!, {
          dbName: 'next_api',
          bufferCommands: true,
        });
        console.log("Connected");
    } catch (error) {
      console.log("Error: ", (error as Error));
      throw new Error("Error: ", (error as Error));
    }
}
