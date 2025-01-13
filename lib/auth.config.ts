import { NextAuthConfig, User } from "next-auth";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export default {
  session: {
    strategy: "jwt",
  },
  providers: [GitHub],
} satisfies NextAuthConfig;
