import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Brain, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  MessageCircle
} from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Zenora() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Zenora, your AI wellness companion. How are you feeling today? I'm here to listen and support you on your mental health journey.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported
  } = useVoice();

  // Update input when speech recognition produces transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Auto-scroll to bottom when new message is added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response - in real app, this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getZenoraResponse(userMessage.content),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Auto-speak the response if TTS is available
      if ('speechSynthesis' in window) {
        speak(aiResponse.content);
      }
    } catch (error) {
      toast.error('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getZenoraResponse = (userInput: string): string => {
    // Simple response logic - in real app, this would be AI-powered
    const input = userInput.toLowerCase();
    
    if (input.includes('sad') || input.includes('depressed') || input.includes('down')) {
      return "I hear that you're feeling sad right now. It's completely okay to feel this way - emotions are a natural part of the human experience. Would you like to talk about what's contributing to these feelings, or would you prefer some gentle coping strategies that might help you feel a bit better?";
    }
    
    if (input.includes('anxious') || input.includes('worried') || input.includes('stress')) {
      return "Anxiety and worry can feel overwhelming. Remember that you're not alone in this, and what you're feeling is valid. Let's take a moment together - try taking a slow, deep breath. Would you like me to guide you through a brief breathing exercise, or would you prefer to talk about what's causing these anxious feelings?";
    }
    
    if (input.includes('happy') || input.includes('good') || input.includes('great')) {
      return "I'm so glad to hear you're feeling positive today! It's wonderful when we can acknowledge and celebrate the good moments. What's contributing to your happiness today? Recognizing these positive moments can help us build resilience for more challenging times.";
    }
    
    if (input.includes('help') || input.includes('support')) {
      return "I'm here to support you. Whether you need someone to listen, want to explore coping strategies, or just need a moment to process your thoughts, I'm here for you. What kind of support would feel most helpful right now?";
    }
    
    return "Thank you for sharing that with me. I'm here to listen and support you. Your feelings and experiences matter. Would you like to tell me more about what's on your mind, or is there a particular area of your wellbeing you'd like to focus on today?";
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTTSToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'assistant') {
        speak(lastMessage.content);
      }
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('zenora.title')}</h1>
            <p className="text-muted-foreground">Your AI wellness companion</p>
          </div>
        </div>
      </motion.div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col glass border-border/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span>Chat with Zenora</span>
            </span>
            <div className="flex space-x-2">
              {isSupported && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceToggle}
                  className={`${isListening ? 'bg-primary text-white' : ''}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleTTSToggle}
                className={`${isSpeaking ? 'bg-primary text-white' : ''}`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea 
            className="flex-1 p-6" 
            ref={scrollAreaRef}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback 
                      className={`${
                        message.role === 'user' 
                          ? 'bg-secondary text-white' 
                          : 'bg-primary text-white'
                      }`}
                    >
                      {message.role === 'user' ? 'U' : 'Z'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-white ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start space-x-3"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-white">Z</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 border-t border-border/20">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('zenora.placeholder')}
                className="flex-1 focus-ring"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-primary hover:opacity-90 text-white shadow-glow"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {isListening && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-primary mt-2 flex items-center space-x-2"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>{t('zenora.listening')}</span>
              </motion.p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}