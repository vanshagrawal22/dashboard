import connectDb from "@/database";
import User from "@/models/user";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  //   after login
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email, name } = user;

      try {
        await connectDb();

        const isUserExists = await User.findOne({ email });

        if (!isUserExists) {
          let newUserPayload = {
            name,
            email,
          };

          if (account.provider === "google") {
            const { sub, picture, email_verified, locale } = profile;
            newUserPayload = {
              ...newUserPayload,
              googleId: sub,
              picture,
              emailVerified: email_verified,
              locale,
            };
          }

          if (account.provider === "github") {
            const { id, avatar_url, login, location } = profile;
            newUserPayload = {
              ...newUserPayload,
              githubId: id,
              picture: avatar_url,
              githubUsername: login,
              location: location || null,
            };
          }

          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUserPayload),
          });

          const result = await res.json();
          if (result.success) {
            return true;
          }
        }

        return true; // User already exists
      } catch (error) {
        console.log("Error in signIn callback:", error);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
