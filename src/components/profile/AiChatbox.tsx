import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Message = {
  sender: 'ai' | 'user';
  text: string;
};

const AiChatbox = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Xin chào Nguyễn Văn An! Tôi có thể giúp gì cho bạn về báo cáo này?' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      const aiResponse: Message = { sender: 'ai', text: 'Cảm ơn câu hỏi của bạn. Dựa trên dữ liệu, tôi nhận thấy...' };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col h-full">
      <h3 className="font-semibold text-gray-800 text-xl mb-4">Trao đổi với AI</h3>
      <div className="flex-grow bg-gray-100 rounded-lg p-4 overflow-y-auto h-96 no-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-4 py-2 max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex">
        <Input
          type="text"
          placeholder="Đặt câu hỏi về báo cáo..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" className="rounded-l-none">Gửi</Button>
      </form>
    </div>
  );
};

export default AiChatbox;