// PATCH: Replace the handleTranscribe function in ChatSimulatorSection
// Located in: app/(dashboard)/dashboard/evergreen/[slug]/page.tsx
// Find the existing handleTranscribe function and replace it entirely with this:

const handleTranscribe = async () => {
  if (!transcribeFile) return;
  setTranscribing(true);
  setTranscribeError("");
  setTranscribeProgress("Uploading video to AI...");

  try {
    const fd = new FormData();
    fd.append("video", transcribeFile);
    if (videoDuration > 0) fd.append("duration", String(videoDuration));

    setTranscribeProgress("Transcribing audio with Whisper AI... (this may take 1–3 minutes for large files)");

    const res = await fetch("/api/evergreen/transcribe", {
      method: "POST",
      body: fd,
    });

    // Always try to parse as JSON first
    let data: any;
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      // Non-JSON response — likely a server/Vercel error
      const text = await res.text();
      throw new Error(
        res.status === 413
          ? `File too large. Vercel limits uploads to 4.5MB on Hobby plans or 100MB on Pro. Your file is ${Math.round(transcribeFile.size / 1024 / 1024)}MB. Please export just the audio track as M4A/MP3 and upload that instead.`
          : `Server error (${res.status}): ${text.slice(0, 200)}`
      );
    }

    if (!data.success && !data.chats) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }

    // Show fallback notice if AI couldn't transcribe directly
    if (data.usedFallback && data.message) {
      setTranscribeError(""); // clear error
      // Show as info, not error
      setTranscribeProgress(data.message);
      setTimeout(() => setTranscribeProgress(""), 8000);
    } else {
      setTranscribeProgress("");
    }

    const chats: any[] = data.chats;
    const detectedDuration: number = data.duration;

    if (detectedDuration > 0 && detectedDuration !== videoDuration) {
      onVideoDuration(detectedDuration);
      saveLS(`wf-duration-${slug}`, detectedDuration);
    }

    onSimChatsChange(chats);
    saveLS(`wf-chats-${slug}`, chats);
    setTranscribeFile(null);

  } catch (err) {
    setTranscribeError(
      err instanceof Error
        ? err.message
        : "Something went wrong. Please try again."
    );
    setTranscribeProgress("");
  } finally {
    setTranscribing(false);
  }
};
