import { redirect } from "next/navigation";
import { auth } from "../auth";
import { useSession } from "next-auth/react";

export const requireUser = async () => {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  return session.user;
};

export const useRequireUser = (required = true) => {
  const session = useSession({
    required: required,
    onUnauthenticated() {
      return redirect("/");
    },
  });

  if (session.status === "loading") {
    return {
      isAuthenticated: false,
      isLoading: true,
      user: null,
    };
  }

  return {
    isAuthenticated: session.status === "authenticated",
    isLoading: false,
    user: session.data?.user || null,
  };
};
