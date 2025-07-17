
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { UserInfo } from '@/lib/utils';
export const useAuth = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user:any) => {
      const userData = {
        accessToken:user.accessToken,
        email:user.email,
        displayName:user.displayName,
        photoURL:user.photoURL,
        userId:user.uid
      }
      setUser(userData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "Welcome to Ask HR!",
        description: "You've successfully signed in.",
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: "Sign-in Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null); // Ensure user is set to null after sign out
      toast({
        title: "Signed Out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign-out Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signOutUser,
  };
};
