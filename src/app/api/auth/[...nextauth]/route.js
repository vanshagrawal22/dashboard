
import connectDb from "@/database";
import User from "@/models/user";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider !== "google") {
        return user;
      }

      const { name, email } = user;
      const { sub: googleId, picture, email_verified: emailVerified, locale } = profile;

      try {
        await connectDb();
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              googleId,
              picture,
              emailVerified,
              locale,
            }),
          });
          const result = await response.json();
          if (result.success) {
            return true;
          }
        }
      } catch (error) {
        // Consider logging with a proper logger in production
        console.error("Error during signIn callback:", error);
      }
      return user;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
