
import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
}

const ChatInput = ({ onSendMessage, loading }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything about HR policies, benefits, procedures..."
          className="flex-1 rounded-full px-4 py-3 text-sm border-gray-300 focus:border-hr-blue focus:ring-hr-blue"
          disabled={loading}
        />
        <Button 
          type="submit" 
          size="sm"
          className="h-12 w-12 rounded-full bg-hr-blue hover:bg-hr-blue/90 p-0"
          disabled={!message.trim() || loading}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
      
      {loading && (
        <div className="text-center mt-2">
          <span className="text-xs text-muted-foreground">Ask HR is typing...</span>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
