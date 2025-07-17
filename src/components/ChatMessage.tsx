
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatMessage as ChatMessageType } from '@/hooks/useChat';
import { User } from 'firebase/auth';
import { UserInfo } from '@/lib/utils';
interface ChatMessageProps {
  message: ChatMessageType;
  currentUser: UserInfo;
}

const ChatMessage = ({ message, currentUser }: ChatMessageProps) => {
  const isUser = message.sender === 'user';
  const timestamp = message.timestamp ? new Date(message.timestamp) : null;
  
  return (
    <div className={`flex gap-3 p-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        {isUser ? (
          <>
            <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || 'User'} />
            <AvatarFallback className="bg-hr-light-blue hr-blue text-xs">
              {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-hr-green text-white text-xs">
            HR
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className={`flex flex-col space-y-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">
            {isUser ? (currentUser.displayName || 'You') : 'Ask HR'}
          </span>
          {timestamp && (
            <span>{format(timestamp, 'MMM d, h:mm a')}</span>
          )}
        </div>
        
        <div className={`
          rounded-2xl px-4 py-2 shadow-sm
          ${isUser 
            ? 'bg-hr-blue text-white rounded-br-md' 
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
          }
        `}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
