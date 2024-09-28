import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '../../../lib/mongodb';
import { compare } from 'bcryptjs';

export default NextAuth({
  session: {
    strategy: 'jwt',  // Using JWT strategy
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db('taskd');
        const usersCollection = db.collection('Users');
        
        // Find user by email
        const user = await usersCollection.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Verify password
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Incorrect password');
        }

        // Return user object
        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,  // Make sure this is set
});
