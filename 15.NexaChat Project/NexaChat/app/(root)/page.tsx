import { currentUser } from "@/modules/auth/actions";
import ChatMessageView from "@/modules/chat/components/chat-view/chat-message-view";

export default async function Home() {
  const user = await currentUser();
  return (
    <>
      <ChatMessageView user={user} />
    </>
  );
}
