import { useAuthContext } from "../components/auth/AuthProvider";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const { session, user, loading, isAuthenticated } = useAuthContext();

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  return {
    session,
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };
}