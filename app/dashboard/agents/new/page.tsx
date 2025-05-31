import { IconAppsFilled } from "@tabler/icons-react"

export default function NewAgentPage() {
  return (
    <div className="container mx-auto px-8 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Heading with icon */}
        <div className="flex items-center gap-3 mb-2">
          <IconAppsFilled className="w-8 h-8 text-foreground" />
          <h1 className="text-4xl font-extrabold tracking-tight">Agents</h1>
        </div>
      </div>
    </div>
  )
}
