// modules/chat/components/chat-view/chat-message-view.tsx
"use client";
import React, { useState } from "react";
import ChatWelcomeTabs from "./chat-welcome-tabs";
import ChatMessageForm from "./chat-message-form";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ChatMessageViewProps {
  user: User | null;
}

const ChatMessageView: React.FC<ChatMessageViewProps> = ({ user }) => {
  const [selectedMessage, setSelectedMessage] = useState("");

  const handleMessageSelect = (message: string) => {
    setSelectedMessage(message);
  };

  const handleMessageChange = () => {
    setSelectedMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] justify-between overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <ChatWelcomeTabs
          userName={user?.name || "Friend"}
          onMessageSelect={handleMessageSelect}
        />
      </div>

      <div className="shrink-0 bg-gradient-to-t from-background via-background/90 to-transparent pt-6">
        <ChatMessageForm
          initialMessage={selectedMessage}
          onMessageChange={handleMessageChange}
        />
      </div>
    </div>
  );
};

export default ChatMessageView;
