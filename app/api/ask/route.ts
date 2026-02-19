import OpenAI from "openai";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const NodeDraftSchema = z.object({
  question: z.string().min(2),
  definition: z.string().min(5),
  keywords: z.array(z.string()).default([]),
  cloud: z.string().optional(), // 先可选，后面你再映射到cloud表
});

function safeJsonParse(s: string) {
  // 兼容模型偶尔带 ```json ... ```
  const cleaned = s
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  return JSON.parse(cleaned);
}

//test
export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return Response.json({ error: "question required" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "你是一个知识助手。" },
        { role: "user", content: question },
      ],
    });

    const answer = completion.choices[0].message.content;

    return Response.json({ answer });
  } catch (err: any) {
    console.error(err);
    return Response.json(
      { error: err.message || "server error" },
      { status: 500 },
    );
  }
}

// export async function POST(req: Request) {
//   try {
//     //读取用户问题
//     const { question } = await req.json();

//     if (!question || typeof question !== "string") {
//       return Response.json({ error: "question is required" }, { status: 400 });
//     }

//     //调用 DeepSeek API 生成回答
//     const completion = await client.chat.completions.create({
//       model: "deepseek-chat",
//       temperature: 0.3,
//       messages: [
//         {
//           role: "system",
//           content: `
// 你是知识卡片生成器。必须只输出一段 JSON，不要输出任何解释文字。
// JSON 格式如下：
// {
//   "question": "对用户问题的标准化表述（更像知识点标题）",
//   "definition": "用简洁、准确的中文解释（2-5句话）",
//   "keywords": ["关键词1","关键词2"],
//   "cloud": "可选：所属云/领域名称（如 AWS/AI/数据库）"
// }
//           `.trim(),
//         },
//         { role: "user", content: question },
//       ],
//     });

//     const raw = completion.choices?.[0]?.message?.content ?? "";
//     const parsed = NodeDraftSchema.parse(safeJsonParse(raw));

//     const aiAnswerText =
//       `Q: ${parsed.question}\n` +
//       `A: ${parsed.definition}\n` +
//       (parsed.keywords?.length
//         ? `Keywords: ${parsed.keywords.join(", ")}`
//         : "");

//     //插入 draft_nodes 表，状态为 pending，等待管理员审核
//     const { data: draft, error } = await supabaseAdmin
//       .from("draft_nodes")
//       .insert({
//         user_question: question,
//         ai_json: parsed,
//         ai_answer_text: aiAnswerText,
//         status: "pending",
//       })
//       .select("id, status, created_at")
//       .single();

//     if (error) throw error;

//     //返回 JSON 给前端
//     return Response.json({
//       draftId: draft.id,
//       status: draft.status,
//       ai: parsed,
//     });
//   } catch (e: any) {
//     return Response.json(
//       { error: e?.message ?? "unknown error" },
//       { status: 500 },
//     );
//   }
// }
