import OpenAI from "openai";
import { z } from "zod";
import { insertNodeDraft } from "@/data/queries/nodesDraft";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const NodeDraftSchema = z.object({
  title: z.string().min(2),
  definition: z.string().min(5),
  question: z.string().min(2),
  details: z
    .array(
      z.object({
        heading: z.string(),
        content: z.string(),
      }),
    )
    .min(1),
  subcategory_name: z.string().min(1),
});

function buildDetail(sections: { heading: string; content: string }[]) {
  return sections
    .map((sec) => `${sec.heading}\n<<<>>>\n${sec.content}`)
    .join("\n<<<>>>\n");
}

function safeJsonParse(s: string) {
  // 兼容模型偶尔带 ```json ... ```
  const cleaned = s
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  return JSON.parse(cleaned);
}

export async function POST(req: Request) {
  try {
    //读取用户问题
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return Response.json({ error: "question is required" }, { status: 400 });
    }

    //调用 DeepSeek API 生成回答
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `
          你是知识卡片生成器。
          必须只输出严格 JSON，不要输出解释。

          格式如下：
          {
            "title": "知识标题",
            "definition": "简洁定义（1-2句话）",
            "question": "引导问题 尽量10字以内",
            "details": [
              {
                "heading": "小标题",
                "content": "详细内容"
              }
            ],
            "subcategory_name": "最匹配的子分类名称"
          }

          禁止 markdown。
          `.trim(),
        },
        { role: "user", content: question },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";
    const parsed = NodeDraftSchema.parse(safeJsonParse(raw));
    const detail = buildDetail(parsed.details);

    //插入 nodesDraft表，状态为 pending，等待管理员审核
    try {
      await insertNodeDraft({
        user_question: question,
        subcategery_name: parsed.subcategory_name,
        title: parsed.title,
        definition: parsed.definition,
        question: parsed.question,
        ai_answer: detail,
      });
    } catch (dbError) {
      console.error("Node Draft insert failed:", dbError);
    }

    //返回 JSON 给前端
    return Response.json({
      title: parsed.title,
      definition: parsed.definition,
      detail,
    });
  } catch (e: any) {
    return Response.json(
      { error: e?.message ?? "AI generation failed:" + e.message },
      { status: 500 },
    );
  }
}
