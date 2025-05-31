import { rtdb } from "./firebase";
import { ref, push, get } from "firebase/database";

type MessageValue = { sender?: string; text?: string; timestamp?: number };

export async function addMessage(conversationId: string, message: { sender: string; text: string }) {
  const messagesRef = ref(rtdb, `conversations/${conversationId}/messages`);
  const newMsgRef = push(messagesRef, {
    ...message,
    timestamp: Date.now(),
  });
  return newMsgRef.key;
}

export async function getMessages(conversationId: string) {
  const messagesRef = ref(rtdb, `conversations/${conversationId}/messages`);
  const snapshot = await get(messagesRef);
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => {
    const v = value as MessageValue;
    return {
      id,
      sender: v.sender || '',
      text: v.text || '',
      timestamp: v.timestamp || 0,
    };
  });
} 