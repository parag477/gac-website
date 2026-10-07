import { llmsFull, textResponse } from "@/lib/ai-discovery";
export const dynamic = "force-static";
export function GET() {
  return textResponse(llmsFull());
}
