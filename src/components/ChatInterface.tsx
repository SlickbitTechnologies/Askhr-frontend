
import { useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '@/hooks/useChat';
import { UserInfo } from '@/lib/utils'; 

interface ChatInterfaceProps {
  user: UserInfo;
  onSignOut: () => void;
}

const ChatInterface = ({ user, onSignOut }: ChatInterfaceProps) => {
  const { messages, sendMessage, loading, pendingAIMessage, relatedQuestions,translateMessage } = useChat(user);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ChatHeader user={user} onSignOut={onSignOut} />
      {/* Main chat area */}
      <main className="pt-16 pb-24">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center px-4">
              <div className="w-16 h-16 bg-hr-light-blue rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">👋</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome to Ask HR!
              </h2>
              <p className="text-gray-600 max-w-md">
                I'm here to help you with HR-related questions. Ask me about policies, 
                benefits, procedures, or anything else you need to know.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  currentUser={user}
                  translateMessage={translateMessage}
                />
              ))}
              {pendingAIMessage && (
                <div className="flex gap-3 p-4">
                  <div className="h-8 w-8 flex-shrink-0" />
                  <div className="flex flex-col space-y-1 max-w-[80%] items-start">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">Ask HR</span>
                    </div>
                    <div className="rounded-2xl px-4 py-2 shadow-sm bg-gray-100 text-gray-900 rounded-bl-md">
                      <span style={{ whiteSpace: 'pre-line' }}>{pendingAIMessage}</span>
                    </div>
                  </div>
                </div>
              )}
              {loading && (
                <div className="flex gap-3 p-4">
                  <div className="h-8 w-8 flex-shrink-0" />
                  <div className="flex flex-col space-y-1 max-w-[80%] items-start">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">Ask HR</span>
                    </div>
                    <div className="rounded-2xl px-4 py-2 shadow-sm bg-gray-100 text-gray-900 rounded-bl-md">
                      <span className="inline-flex space-x-1">
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          {/* Show related questions only after AI response is fully displayed */}
          {relatedQuestions.length > 0 && !loading && !pendingAIMessage && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-semibold mb-2">Related Questions:</div>
              <ul className="list-disc list-inside space-y-1">
                {relatedQuestions.map((q, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <button
                      className="text-blue-600 hover:underline focus:outline-none"
                      onClick={() => sendMessage(q)}
                      disabled={loading}
                      type="button"
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
      <ChatInput onSendMessage={sendMessage} loading={loading} />
    </div>
  );
};

export default ChatInterface;
