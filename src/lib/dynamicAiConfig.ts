import { prisma } from "@/lib/prisma";

export interface DynamicAiConfig {
  activeModel: string;
  apiKey: string;
  brandVoice: string;
  customPromptPrefix: string;
  autoSeoOnSave: boolean;
  autoCopywriterOnSave: boolean;
  autoSizeChartOnSave: boolean;
  autoReelCaptionOnSave: boolean;
  enableStylistOnStorefront: boolean;
  veoModel: string;
  veoResolution: "720p" | "1080p" | "4k";
  veoDefaultAspectRatio: "9:16" | "16:9" | "1:1";
  lastUpdated: string;
}

export const DEFAULT_AI_CONFIG: DynamicAiConfig = {
  activeModel: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY || "",
  brandVoice: "Royal Pakistani Haute Couture & Heritage Craftsmanship",
  customPromptPrefix: "Emphasize authentic Pakistani needlecraft, pure fabrics (Swiss lawn, pure chiffon, raw silk), and luxurious nationwide Cash on Delivery.",
  autoSeoOnSave: true,
  autoCopywriterOnSave: true,
  autoSizeChartOnSave: true,
  autoReelCaptionOnSave: true,
  enableStylistOnStorefront: true,
  veoModel: "google-veo-3",
  veoResolution: "1080p",
  veoDefaultAspectRatio: "9:16",
  lastUpdated: new Date().toISOString(),
};

/**
 * Get dynamic AI configuration from database
 */
export async function getDynamicAiConfig(): Promise<DynamicAiConfig> {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: "ai_engine_config" },
    });
    if (!record) return DEFAULT_AI_CONFIG;
    return { ...DEFAULT_AI_CONFIG, ...JSON.parse(record.value) };
  } catch {
    return DEFAULT_AI_CONFIG;
  }
}

/**
 * Update dynamic AI configuration in database
 */
export async function saveDynamicAiConfig(
  newConfig: Partial<DynamicAiConfig>
): Promise<DynamicAiConfig> {
  const current = await getDynamicAiConfig();
  const updated: DynamicAiConfig = {
    ...current,
    ...newConfig,
    lastUpdated: new Date().toISOString(),
  };

  await prisma.setting.upsert({
    where: { key: "ai_engine_config" },
    create: {
      key: "ai_engine_config",
      value: JSON.stringify(updated),
      description: "Dynamic AI Engine, Google Veo 3, and Automation Rules",
    },
    update: {
      value: JSON.stringify(updated),
    },
  });

  return updated;
}
