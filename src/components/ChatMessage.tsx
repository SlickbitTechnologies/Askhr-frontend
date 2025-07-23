
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatMessage as ChatMessageType, } from '@/hooks/useChat';
import { User } from 'firebase/auth';
import { UserInfo } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

interface ChatMessageProps {
  message: ChatMessageType;
  currentUser: UserInfo;
  translateMessage: (message: string,id:string,lang:string) => Promise<string>;
}

const ChatMessage = ({ message, currentUser,translateMessage }: ChatMessageProps) => {
  const isUser = message.sender === 'user';
  const timestamp = message.timestamp ? new Date(message.timestamp) : null;
  // const { translateMessage } = useChat(currentUser);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [translated, setTranslated] = useState(message.content);
  const [selectedLang, setSelectedLang] = useState('en');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [translated]);
  
  const handleLike = async () => {
    setLiked(true);
    setDisliked(false);
  };
  const handleDislike = () => {
    setDisliked(true);
    setLiked(false);
  };

  const handleTranslate = async () => {
    setTranslated('Translating...');
    const data = await translateMessage(message.content,message.id,selectedLang);
    console.log("data",data)
    setTranslated(data)
    // const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  
    // if (!rapidApiKey) {
    //   setTranslated('Translation failed: API key not set.');
    //   return;
    // }
  
    // try {
    //   const url = `https://unlimited-google-translate1.p.rapidapi.com/api/translate?target=${selectedLang}&text=${encodeURIComponent(message.content)}&source=en`;
    //   const options = {
    //     method: 'GET',
    //     headers: {
    //       'x-rapidapi-key': rapidApiKey,
    //       'x-rapidapi-host': 'unlimited-google-translate1.p.rapidapi.com',
    //     },
    //   };
  
    //   const response = await fetch(url, options);
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    //   }
  
    //   const data = await response.json();
    //   console.log('Translation API response:', data);
  
    //   if (data.translated_text) {
    //     setTranslated(data.translated_text);
    //   } else {
    //     setTranslated('Translation failed: No translated text returned.');
    //   }
    // } catch (error) {
    //   console.error('Translation error:', error);
    //   setTranslated('Translation failed.');
    // }
  };
  
  
  // Helper to render message as points or paragraph
  function renderMessageContent(content: string) {
    // Split by lines
    const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
    // Check for bullet or numbered list
    const isBullet = lines.length > 1 && lines.every(line => /^[-*]\s+/.test(line));
    const isNumbered = lines.length > 1 && lines.every(line => /^\d+\./.test(line));
    if (isBullet) {
      return (
        <ul className="list-disc pl-5 space-y-1">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^[-*]\s+/, '')}</li>
          ))}
        </ul>
      );
    }
    if (isNumbered) {
      return (
        <ol className="list-decimal pl-5 space-y-1">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^\d+\.\s*/, '')}</li>
          ))}
        </ol>
      );
    }
    // Otherwise, show as paragraph(s)
    return content.split(/\n{2,}/).map((para, i) => (
      <p className="mb-2 last:mb-0" key={i}>{para}</p>
    ));
  }
  
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
          <div className="text-sm leading-relaxed">
            {renderMessageContent(message.content)}
          </div>
        </div>
        {/* Like/Dislike buttons for assistant messages, below the message bubble */}
        {!isUser && (
          <>
            <div className="flex flex-row gap-4 mt-2">
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-2xl transition-colors duration-150 focus:outline-none ${
                  liked
                    ? 'bg-green-700 border-green-900 shadow-lg text-white opacity-100'
                    : 'bg-green-500 border-green-700 text-white hover:bg-green-600 opacity-40'
                }`}
                onClick={handleLike}
                type="button"
                disabled={liked || disliked}
                aria-label="Like"
              >
                👍
              </button>
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-2xl transition-colors duration-150 focus:outline-none ${
                  disliked
                    ? 'bg-red-700 border-red-900 shadow-lg text-white opacity-100'
                    : 'bg-red-500 border-red-700 text-white hover:bg-red-600 opacity-40'
                }`}
                onClick={handleDislike}
                type="button"
                disabled={disliked || liked}
                aria-label="Dislike"
              >
                👎
              </button>
            </div>
            {/* Chat transcription/translation box */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 w-full">
              <div className="flex items-center gap-2 mb-2">
                <label htmlFor="lang-select" className="text-xs font-medium text-gray-700">Translate to:</label>
                <select
                  id="lang-select"
                  value={selectedLang}
                  onChange={e => setSelectedLang(e.target.value)}
                  className="border rounded px-2 py-1 text-xs"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="hi">Hindi</option>
                  <option value="zh">Chinese</option>
                  <option value="ar">Arabic</option>
                  <option value="ja">Japanese</option>
                  <option value="it">Italian</option>
                </select>
                <button
                  className="ml-2 px-3 py-1 rounded bg-hr-blue text-white text-xs font-medium hover:bg-hr-blue/90"
                  onClick={handleTranslate}
                  type="button"
                >
                  Translate
                </button>
              </div>
              <textarea
                className="w-full rounded border px-2 py-1 text-xs bg-white resize-none"
                value={translated}
                readOnly
                placeholder="Translation will appear here..."
                ref={textareaRef}
                rows={1}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
