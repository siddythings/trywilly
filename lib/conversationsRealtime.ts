import { rtdb } from "./firebase";
import { ref, push, get, child } from "firebase/database";

export type Conversation = { id: string; title: string; createdAt: number };
type ConversationValue = { title?: unknown; createdAt?: unknown };

// Add a new conversation
export async function addConversation(conversation: { title: string; createdAt?: number }) {
  const userData = JSON.parse(localStorage.getItem("user") || "{}")
  const conversationsRef = ref(rtdb, `conversations/${userData.data.id}`);
  const value = {
    ...conversation,
    createdAt: conversation.createdAt || Date.now(),
  };
  console.log("Pushing conversation to RTDB:", value);
  const newConvRef = await push(conversationsRef, value);
  return newConvRef.key;
}

// Fetch all conversations
export async function getConversations(): Promise<Conversation[]> {
  const userData = JSON.parse(localStorage.getItem("user") || "{}")
  const conversationsRef = ref(rtdb, `conversations/${userData.data.id}`);
  const snapshot = await get(conversationsRef);
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => {
    const v = value as ConversationValue;
    return {
      id,
      title: typeof v.title === 'string' ? v.title : '',
      createdAt: typeof v.createdAt === 'number' ? v.createdAt : 0,
    };
  });
} 