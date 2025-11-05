import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

const config = {
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
		  scope: "openid email profile"
        },
      },
    }),
  ],
};

const result = NextAuth({
  ...config,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  callbacks: {
    /**
     * ✅ SIGN-IN CALLBACK
     * Runs after user authenticates with Google
     */
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        if (!profile?.email) return false;

        const baseUrl = process.env.BACKEND_BASE_URL;

        try {
          // ✅ Try logging in user from backend
		  console.log("this is here", profile)
          const response = await fetch(`${baseUrl}/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: profile.email }),
          });

          let createdUser;
		  console.log("respoinse ", response)
          if (response.ok) {
            createdUser = await response.json().then((res) => res.data);
			console.log("this is crated user", createdUser)
          } else {
            const createResponse = await fetch(`${baseUrl}/users/signup`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: profile.name,
                email: profile.email,
                image: profile.picture,
                googleId: profile.sub, // Use Google's unique ID
              }),
            });
			console.log("sjfklsadfkjasf", createResponse)
            if (!createResponse.ok) return false;

            createdUser = await createResponse.json().then(res => res.data);
          }
          if (createdUser && createdUser.id) {
            user.id = createdUser.id;
          } else {
            return false;
          }
        } catch (error) {
          console.error("SignIn error:", error);
          return false;
        }
      }
      return true;
    },

    /**
     * ✅ JWT CALLBACK
     * Adds custom claims (user.id, token, etc.) to JWT
     */
    async jwt({ token, user, account, profile }) {
      if (user && profile) {
        token.id = user.id;
        token.image = profile.picture;
        token.name = profile.name ?? `Guest-${profile.email?.split("@")[0]}`;

        // ✅ Sign a custom JWT token for your backend
        const signToken = jwt.sign(
          {
            id: user.id,
            image: profile.picture,
            name: profile.name ?? `Guest-${profile.email?.split("@")[0]}`,
          },
          process.env.TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        token.accessToken = signToken;
      }
      return token;
    },

    
    async session({ session, token }) {
      if (session.user) {
        session.accessToken = token.accessToken;
        session.user.id = token.id;
        session.user.image = token.image;
        session.user.name = token.name;
      }
      return session;
    },
  },
});

const handlers = result.handlers;
const auth = result.auth;
const signIn = result.signIn;
const signOut = result.signOut;

export { handlers, auth, signIn, signOut };
