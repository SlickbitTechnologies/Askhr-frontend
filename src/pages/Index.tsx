
import { useAuth } from '@/hooks/useAuth';
import LoginPage from '@/components/LoginPage';
import ChatInterface from '@/components/ChatInterface';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hr-light-blue to-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 hr-blue" />
          <p className="text-gray-600">Loading Ask HR...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onSignIn={signInWithGoogle} />;
  }

  return <ChatInterface user={user} onSignOut={signOutUser} />;
};

export default Index;
