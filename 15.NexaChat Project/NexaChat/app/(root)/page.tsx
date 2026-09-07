import { Button } from "@/components/ui/button";
import { currentUser } from "@/modules/auth/actions";
import UserButton from "@/modules/auth/components/user-button";
import ChatMessageView from "@/modules/chat/components/chat-view/chat-message-view";
import Image from "next/image";

export default async function Home() {
  const user = await currentUser();
  return (
    <>
      <ChatMessageView user={user} />
    </>
  );
}
