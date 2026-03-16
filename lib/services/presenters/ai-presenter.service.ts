// lib/services/presenters/ai-presenter.service.ts
import OpenAI from "openai";
import { prisma } from "@/lib/db/prisma";
import type {
  IAIPresenterService,
  CreatePresenterInput,
  NarrationContext,
} from "@/lib/services/interfaces";
import type { AIPresenter } from "@prisma/client";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class AIPresenterService implements IAIPresenterService {
  async create(workspaceId: string, input: CreatePresenterInput): Promise<AIPresenter> {
    return prisma.aIPresenter.create({
      data: {
        workspaceId,
        name: input.name,
        speakingStyle: input.speakingStyle,
        tone: input.tone,
        brandVoice: input.brandVoice,
        nicheSpecialty: input.nicheSpecialty as any,
        avatarUrl: input.avatarUrl,
      },
    });
  }

  async generateNarration(presenterId: string, context: NarrationContext): Promise<string> {
    const presenter = await prisma.aIPresenter.findUnique({ where: { id: presenterId } });
    if (!presenter) throw new Error("Presenter not found");

    const systemPrompt = `You are writing narration for ${presenter.name}, a webinar presenter.
Speaking style: ${presenter.speakingStyle ?? "conversational"}
Tone: ${presenter.tone ?? "professional"}
Brand voice: ${presenter.brandVoice ?? "Clear, direct, and results-focused."}
Write as if ${presenter.name} is speaking live. 150–250 words. No stage directions.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate narration for the "${context.sectionType}" section of "${context.webinarTitle ?? "this webinar"}".

Section content to narrate:
${context.content}

${context.offerName ? `Offer being presented: ${context.offerName}` : ""}`,
        },
      ],
    });

    return completion.choices[0]?.message?.content ?? "";
  }

  async list(workspaceId: string): Promise<AIPresenter[]> {
    return prisma.aIPresenter.findMany({
      where: { workspaceId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });
  }
}

export const aiPresenterService = new AIPresenterService();
