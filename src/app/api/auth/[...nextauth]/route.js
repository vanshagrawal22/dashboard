import connectDb from "@/database";
import User from "@/models/user";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


const authOptions = {
  providers: [
    GoogleProvider({
      clientId:
        process.env.ClientId,
      clientSecret: process.env.ClientPassword,
    }),
  ],

  //   after login
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email } = user;
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
              body: JSON.stringify({ name, email }),
            });
            const result = await res.json();
            if (result.success) {
              // console.log(user)
              return user;
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
