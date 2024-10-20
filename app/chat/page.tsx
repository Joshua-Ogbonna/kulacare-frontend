"use client";

import React, { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Send,
  Apple,
  ActivitySquare,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import MealResponseFormatter from "@/components/formatter/MealResponseFormatter";
import { useRouter } from "next/navigation";
import Header from "@/components/header/header";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface Chat {
  content: string;
  isFromUser: boolean;
  timestamp: string;
  _id: string;
}

const renderMessage = (message: Message) => {
  if (message.sender === "ai") {
    return <MealResponseFormatter content={message.content} />;
  }
  return <p className="text-white">{message.content}</p>;
};

const NutritionChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI Nutritionist. I can help you with personalized meal plans, nutrition advice, and health tracking. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    await sendMessageToBackend(newMessage.content);
  };

  const sendMessageToBackend = async (message: string) => {
    const phoneNumber = localStorage.getItem("phoneNumber");

    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Phone number not found. Please sign in again.",
        variant: "destructive",
      });
      router.push("/signin");
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/message`,
        {
          message,
          phoneNumber,
        }
      );

      // Handle the AI response
      const aiResponse = data?.data;

      if (aiResponse && aiResponse.role === "assistant") {
        // const newAiMessage: Message = {
        //   id: Date.now().toString(),
        //   content: aiResponse?.content,
        //   sender: "ai",
        //   timestamp: new Date(),
        // };

        await fetchChats();
      }

      if (data && data.message) {
        await fetchChats();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "An unexpected error occurred",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChats = async () => {
    const phoneNumber = localStorage.getItem("phoneNumber");

    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Phone number not found. Please sign in again.",
        variant: "destructive",
      });
      router.push("/signin");
      return;
    }

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${phoneNumber}`
      );
      if (data?.chats && data.chats.length > 0 && data.chats[0].messages) {
        const fetchedMessages: Message[] = data.chats[0].messages.map(
          (chat: Chat) => ({
            id: chat._id,
            content: chat.content,
            sender: chat.isFromUser ? "user" : "ai",
            timestamp: new Date(chat.timestamp),
          })
        );
        setMessages(fetchedMessages);
      } else {
        setMessages([]);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch chats",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-col h-screen bg-zinc-900">
        {/* Header */}
        <div className="flex flex-col items-center justify-center p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-6 h-6 text-pink-400" />
            <h1 className="text-2xl font-bold text-white">
              Your Personal AI Nutritionist
            </h1>
          </div>
          <p className="text-zinc-400 text-center">
            Get personalized nutrition advice and meal plans tailored to your
            health goals
          </p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
              <MessageCircle className="w-16 h-16 mb-4" />
              <p className="text-xl font-semibold">No messages yet</p>
              <p className="mt-2 text-center">
                Start a conversation with your AI Nutritionist by typing a
                message below.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8">
                    {message.sender === "ai" ? (
                      <Apple className="w-5 h-5 text-green-500" />
                    ) : (
                      <ActivitySquare className="w-5 h-5 text-blue-500" />
                    )}
                  </Avatar>
                  <Card
                    className={`${message.sender === "user" ? "bg-blue-600" : "bg-zinc-800"}`}
                  >
                    <CardContent className="p-3">
                      {renderMessage(message)}
                      <span className="text-xs text-zinc-400 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-800">
          <div className="flex gap-2">
            <Input
              placeholder="Type your nutrition question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="bg-zinc-800 border-zinc-700 text-white"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              className="bg-pink-500 hover:bg-pink-600"
              disabled={isLoading}
            >
              <Send className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NutritionChat;
