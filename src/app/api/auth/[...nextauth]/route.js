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

  //   after login
  callbacks: {
    async signIn({ user, account, profile }) {
      // console.log(profile)
      if (account.provider === "google") {
        const { name, email } = user;
        const { sub, picture, email_verified, locale } = profile;
        // console.log("ha ji")
        try {
          await connectDb();

          const isUserExists = await User.findOne({ email });
          if (!isUserExists) {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name,
                email,
                googleId: sub,
                picture,
                emailVerified: email_verified,
                locale,
              }),
            });
            const result = await res.json();
            if (result.success) {
              // console.log(user)
              return true;
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      return user;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
