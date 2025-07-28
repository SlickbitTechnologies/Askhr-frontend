
import { useState, useCallback, useEffect } from 'react';
import { User } from 'firebase/auth';
import { UserInfo } from '@/lib/utils';
export interface ChatMessage {
  id?: string;
  content: string;
  sender: 'user' | 'hr';
  userId: string;
  userName: string;
  timestamp?: string;
}

const API_URL = 'https://askhr.mangopond-93ace1db.southcentralus.azurecontainerapps.io';
// const API_URL ='http://localhost:8000'; // Backend URL

export const useChat = (user: UserInfo | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  console.log("messages",messages)
  const [loading, setLoading] = useState(false);
  const [pendingAIMessage, setPendingAIMessage] = useState<string | null>(null);
  const [relatedQuestions, setRelatedQuestions] = useState<string[]>([]);

  useEffect(() => {
    console.log("messages",messages)
    localStorage.setItem("messages",JSON.stringify(messages))
  }, [messages])
  useEffect(() => {
    const messages = localStorage.getItem("messages")
    if (messages) {
      setMessages(JSON.parse(messages))
    }
  }, [])
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !content.trim()) return;
    setLoading(true);
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      userId: user.userId,
      userName: user.displayName || user.email || 'User',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization":`Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          message: content.trim(),
          user_email: user.email || user.userId
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Store related questions
      setRelatedQuestions(Array.isArray(data.related_questions) ? data.related_questions.slice(0, 3) : []);
      let answer = data.answer || data.reply || data.message || JSON.stringify(data);
      answer = answer.replace(/\\n\\n/g, '\n\n');
      let citations = '';
      if (data.citations && Array.isArray(data.citations)) {
        citations = data.citations
          .map((c: any) => `**${c.file_name}**`)
          .join('\n');
      }
      let finalMessage = answer;
      if (citations) {
        finalMessage += `\n\nSources:\n${citations}`;
      }
      // Animate line by line using setTimeout
      const lines = finalMessage.split('\n');
      let current = '';
      setPendingAIMessage('');
      const animateLines = (i: number) => {
        if (i >= lines.length) {
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              content: finalMessage,
              sender: 'hr',
              userId: 'ai-assistant',
              userName: 'Ask HR',
              timestamp: new Date().toISOString()
            }
          ]);
          setPendingAIMessage(null);
          return;
        }
        current += (i > 0 ? '\n' : '') + lines[i];
        setPendingAIMessage(current);
        setTimeout(() => animateLines(i + 1), 500);
      };
      animateLines(0);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'hr',
        userId: 'ai-assistant',
        userName: 'Ask HR',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      setPendingAIMessage(null);
      setRelatedQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [user]);
  const translateMessage = useCallback(async (message: string,id:string,lang:string) => {
    try{
    const response = await fetch(`${API_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization":`Bearer ${user.accessToken}`
      },
      body: JSON.stringify({
        message: message,
        id: id,
        lang: lang
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("data",data,messages)
    const {translation,id:messageId} = data;
    // setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, content: translation } : msg));
    return translation;
  } catch (error) {
    console.error('Error translating message:', error);
    return message;
  }
  }, [user,messages]);

  return {
    messages,
    sendMessage,
    loading,
    pendingAIMessage,
    relatedQuestions,
    translateMessage
  };
};
