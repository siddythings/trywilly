"use client"
import { MinimalTiptapEditor } from "@/components/minimal-tiptap"
import Content from "@/components/minimal-tiptap/data/content.json"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useSideChat } from "@/components/side-chat"

export default function NewAgentPage() {
  // const editorRef = useRef<any>(null)
  const { sendMessage } = useSideChat()
  const [editorText, setEditorText] = useState("")

  const handleTest = () => {
    if (editorText.trim()) {
      sendMessage(editorText)
    }
  }

  return (
    <div className="container mx-auto px-8 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Editable agent name heading */}
        <input
          type="text"
          defaultValue="New agent"
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
            <select defaultValue="day" className="mx-1 bg-transparent border-none font-semibold text-foreground focus:outline-none focus:ring-0 cursor-pointer">
              <option value="hour">hour</option>
              <option value="day">day</option>
              <option value="week">week</option>
            </select>
            at
            <select className="mx-1 bg-transparent border-none font-semibold text-foreground focus:outline-none focus:ring-0 cursor-pointer">
              <option value="8:00am">8:00am</option>
              <option value="9:00am" selected>9:00am</option>
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
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md px-3 py-0.5 text-sm font-semibold">Schedule</button>
            <button className="border border-green-600 text-green-600 hover:bg-green-50 rounded-md px-3 py-0.5 text-sm font-semibold">Save</button>
          </div>
        </div>
        {/* Heading with icon */}
        {/* <div className="flex items-center gap-3 mb-2">
          <IconAppsFilled className="w-8 h-8 text-foreground" />
          
        </div> */}
        <MinimalTiptapEditor
          // ref={editorRef}
          value={Content}
          throttleDelay={3000}
          className={cn("h-96 w-full rounded-xl")}
          editorContentClassName="overflow-auto h-full"
          output="text"
          onChange={(value) => {
            setEditorText(typeof value === "string" ? value : "")
          }}
          placeholder="This is your placeholder..."
          editable={true}
          editorClassName="focus:outline-none px-5 py-4 h-full" />
      </div>
    </div>
  )
}
