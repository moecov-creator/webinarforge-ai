// config/videos.ts
// ─────────────────────────────────────────────────────────────────────────────
// WebinarForge AI — Central Video Configuration
//
// UPDATE YOUR VIDEOS HERE. All funnel pages pull from this file.
// Supported formats:
//   YouTube embed:  "https://www.youtube.com/embed/VIDEO_ID"
//   Vimeo embed:    "https://player.vimeo.com/video/VIDEO_ID"
//   Direct MP4:     "https://your-domain.com/videos/filename.mp4"
//   Cloudinary:     "https://res.cloudinary.com/YOUR_CLOUD/video/upload/filename.mp4"
//
// To get a YouTube embed URL:
//   1. Open your YouTube video
//   2. Copy the video ID from the URL (e.g. youtube.com/watch?v=ABC123 → ID is ABC123)
//   3. Paste as: "https://www.youtube.com/embed/ABC123"
//
// To get a Vimeo embed URL:
//   1. Open your Vimeo video
//   2. Copy the numeric ID from the URL (e.g. vimeo.com/123456789 → ID is 123456789)
//   3. Paste as: "https://player.vimeo.com/video/123456789"
// ─────────────────────────────────────────────────────────────────────────────

export type VideoType = "youtube" | "vimeo" | "mp4"

export interface VideoConfig {
  url: string
  type: VideoType
  title?: string           // used for accessibility / SEO
  posterUrl?: string       // thumbnail shown before play (mp4 only)
  autoplay?: boolean       // default false
  muted?: boolean          // default false — set true only for background/silent videos
  loop?: boolean           // default false
}

function detectType(url: string): VideoType {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("vimeo.com")) return "vimeo"
  return "mp4"
}

function makeVideo(url: string, overrides?: Partial<VideoConfig>): VideoConfig {
  return {
    url,
    type: detectType(url),
    autoplay: false,
    muted: false,
    loop: false,
    ...overrides,
  }
}

// ─── FUNNEL VIDEOS — update these URLs ───────────────────────────────────────

export const FUNNEL_VIDEOS = {

  // Early Bird sales page — main VSL
  earlyBird: makeVideo(
    "https://www.youtube.com/embed/OwExKY-C_Dg",
    { title: "WebinarForge AI — Early Bird Offer" }
  ),

  // OTO1 Upsell page ($997)
  upsell: makeVideo(
    "https://www.youtube.com/embed/BfUwIQ876Tc",
    { title: "WebinarForge AI — Full System Upgrade" }
  ),

  // OTO2 Downsell page ($497)
  downsell: makeVideo(
    "https://www.youtube.com/embed/lKsMvEgrDn8",
    { title: "WebinarForge AI — Special Offer" }
  ),

  // Thank You / confirmation page
  thankyou: makeVideo(
    "https://www.youtube.com/embed/tvocap92cGw",
    { title: "Welcome to WebinarForge AI — Next Steps" }
  ),

  // Dashboard onboarding / welcome video
  onboarding: makeVideo(
    "https://www.youtube.com/embed/ONBOARDING_VIDEO_ID",
    { title: "Getting Started with WebinarForge AI" }
  ),

  // Homepage / marketing hero video (optional)
  hero: makeVideo(
    "https://www.youtube.com/embed/HERO_VIDEO_ID",
    { title: "WebinarForge AI — Turn Cold Traffic Into Clients" }
  ),

} satisfies Record<string, VideoConfig>

// ─── Helper: build iframe src with recommended params ────────────────────────

export function buildEmbedUrl(config: VideoConfig, options?: {
  autoplay?: boolean
  muted?: boolean
}): string {
  const auto = options?.autoplay ?? config.autoplay ?? false
  const mute = options?.muted ?? config.muted ?? false

  if (config.type === "youtube") {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      ...(auto  ? { autoplay: "1" } : {}),
      ...(mute  ? { mute: "1" }     : {}),
    })
    return `${config.url}?${params.toString()}`
  }

  if (config.type === "vimeo") {
    const params = new URLSearchParams({
      byline: "0",
      portrait: "0",
      title: "0",
      ...(auto  ? { autoplay: "1" } : {}),
      ...(mute  ? { muted: "1" }    : {}),
    })
    return `${config.url}?${params.toString()}`
  }

  return config.url
}
