// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';
import clientPromise from "@/lib/mongodb"; // Import your MongoDB connection

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Connect to the database
          const client = await clientPromise; // Await the client promise
          const db = client.db(); // Access the database

          // Look up the user by email
          const user = await db.collection("Users").findOne({ email: credentials.email });

          if (!user) {
            // If no user is found, throw an error
            throw new Error("No user found with the provided email");
          }

          // Check if the password matches
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);

          if (!isValidPassword) {
            throw new Error("Invalid credentials");
          }

          // If credentials are valid, return the user object
          return { email: user.email, name: user.name }; // Add other fields if needed
        } catch (error) {
          console.error("Error in authorize function:", error);
          throw new Error("Authorization failed");
        }
      }
    })
  ],
  pages: {
    signIn: '/signIn' // Use your custom sign-in page
  },
  // Optional: Add a secret for added security (use this if you have a secret)
  secret: process.env.NEXTAUTH_SECRET,
});
