"use client"
import { MinimalTiptapEditor } from "@/components/minimal-tiptap"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useSideChat } from "@/components/side-chat"
import type { Content, JSONContent } from "@tiptap/react"
export default function NewAgentPage() {
  // const editorRef = useRef<any>(null)
  const { sendMessage } = useSideChat()
  const [editorText2, setEditorText2] = useState<Content>({})
  const [agentName, setAgentName] = useState("New agent")
  const [schedule, setSchedule] = useState("day")
  const [time, setTime] = useState("8:00am")
  const [id, setId] = useState("")
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("_id")
    if (id) {
      setId(id)
    }
  }, [])
  const handleTest = () => {
    if (editorText2){
      sendMessage(tiptapDocToString(editorText2))
    }
  }
  useEffect(() => {
    if (!id) return;
    const fetchAgent = async () => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      const agent_id = new URLSearchParams(window.location.search).get("_id")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get-ai-agents/${agent_id}`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${userData.data.access_token}`
        },
      });
      const data = await res.json();
      setAgentName(data.data.name);
      setSchedule(data.data.schedule);
      setTime(data.data.time);
      setEditorText2(data.data.content);
      setLoading(false);
    };
    fetchAgent();
  }, [id]);
  
  const handleSave = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai-agents/save`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${userData.data.access_token}`
        },
        body: JSON.stringify({
          id: id,
          name: agentName,
          schedule,
          time,
          content: editorText2,
        }),
      })
      if (!res.ok) throw new Error("Failed to save agent")
      // alert("Agent saved successfully!")
    } catch (err) {
      alert("Error saving agent: " + String(err))
    }
  }

  const handleSchedule = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai-agents/schedule`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${userData.data.access_token}`
        },
        body: JSON.stringify({
          id: id,
          is_scheduled: true,
        }),
      })
      if (!res.ok) throw new Error("Failed to save agent")
      // alert("Agent saved successfully!")
    } catch (err) {
      alert("Error saving agent: " + String(err))
    }
  }

  return (
    <div className="container mx-auto px-8 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Editable agent name heading */}
        <input
          type="text"
          value={agentName}
          onChange={e => setAgentName(e.target.value)}
          className="block w-full text-4xl font-extrabold tracking-tight mb-2 bg-transparent border-none focus:ring-0 focus:outline-none p-0"
          style={{ outline: "none" }}
        />
        {/* Schedule bar */}
        <div className="flex items-center justify-between border-b border-muted py-2 mb-6">
          <div className="flex items-center gap-2 text-muted-foreground text-lg">
            <span className="mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </span>
            Run every
            <select value={schedule} onChange={e => setSchedule(e.target.value)} className="mx-1 bg-transparent border-none font-semibold text-foreground focus:outline-none focus:ring-0 cursor-pointer">
              <option value="hour">hour</option>
              <option value="day">day</option>
              <option value="week">week</option>
            </select>
            at
            <select value={time} onChange={e => setTime(e.target.value)} className="mx-1 bg-transparent border-none font-semibold text-foreground focus:outline-none focus:ring-0 cursor-pointer">
              <option value="8:00am">8:00am</option>
              <option value="9:00am">9:00am</option>
              <option value="10:00am">10:00am</option>
              <option value="11:00am">11:00am</option>
              <option value="12:00pm">12:00pm</option>
              <option value="1:00pm">1:00pm</option>
              <option value="2:00pm">2:00pm</option>
              <option value="3:00pm">3:00pm</option>
              <option value="4:00pm">4:00pm</option>
              <option value="5:00pm">5:00pm</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button className="border rounded-md px-2 py-0.5 text-sm font-medium flex items-center gap-1" onClick={handleTest}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polygon points="8,5 19,12 8,19" fill="currentColor" /></svg>
              Test
            </button>
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md px-3 py-0.5 text-sm font-semibold" onClick={handleSchedule}>Schedule</button>
            <button className="border border-green-600 text-green-600 hover:bg-green-50 rounded-md px-3 py-0.5 text-sm font-semibold" onClick={handleSave}>Save</button>
          </div>
        </div>
        {/* Heading with icon */}
        {/* <div className="flex items-center gap-3 mb-2">
          <IconAppsFilled className="w-8 h-8 text-foreground" />
          
        </div> */}
        {!loading && editorText2 && typeof editorText2 === 'object' && !Array.isArray(editorText2) && 'type' in editorText2 && editorText2.type === "doc" ? (
          <MinimalTiptapEditor
            key={id}
            value={editorText2}
            throttleDelay={3000}
            className={cn("h-96 w-full rounded-xl")}
            editorContentClassName="overflow-auto h-full"
            output="json"
            onChange={(value) => {
              setEditorText2(value)
            }}
            placeholder="This is your placeholder..."
            editable={true}
            editorClassName="focus:outline-none px-5 py-4 h-full"
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  )
}

function tiptapDocToString(doc: Content): string {
  if (!doc) return "";
  let result = "";

  function extractText(node: JSONContent) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return;
    if (typeof node.type === 'string' && node.type === "text" && typeof node.text === 'string') {
      result += node.text;
    }
    if (Array.isArray(node.content)) {
      node.content.forEach((child) => {
        if (child && typeof child === 'object' && !Array.isArray(child)) extractText(child as JSONContent);
      });
      if (node.type === "paragraph") result += "\n";
    }
  }

  if (doc && typeof doc === 'object' && !Array.isArray(doc)) {
    extractText(doc as JSONContent);
  }
  return result.trim();
}
