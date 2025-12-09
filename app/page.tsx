"use client";

import { useState, useRef } from "react";
import type { ChangeEvent } from "react";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

const MAX_FILE_SIZE_MB = 10;

const HomePage = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [descriptionText, setDescriptionText] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioObjectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isBusy = status === "uploading" || status === "processing";

  const resetState = () => {
    setAudioUrl(null);
    setDescriptionText(null);
    setErrorMessage(null);
    setStatus("idle");
  }

  const revokePreviousAudioUrl = () => {
    if (audioObjectUrlRef.current) {
      URL.revokeObjectURL(audioObjectUrlRef.current);
      audioObjectUrlRef.current = null;
    }
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0] ?? null;

    revokePreviousAudioUrl();
    setAudioUrl(null);
    setDescriptionText(null);
    setErrorMessage(null);

    if (!file) {
      setStatus("idle");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setErrorMessage("Please select an image file (PNG, JPG, etc.).");
      input.value = "";
      return;
    }

    const fileSizeMb = file.size / (1024 * 1024);
    if (fileSizeMb > MAX_FILE_SIZE_MB) {
      setStatus("error");
      setErrorMessage(
        `File is too large. Please use an image under ${MAX_FILE_SIZE_MB} MB.`
      );
      input.value = "";
      return;
    }

    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/describe-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("processing");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      revokePreviousAudioUrl();
      audioObjectUrlRef.current = url;
      setAudioUrl(url);

      const descriptionHeader = response.headers.get("X-Description-Text");
      const decoded =
        descriptionHeader && decodeURIComponent(descriptionHeader);
      if (decoded) setDescriptionText(decoded);

      setStatus("done");
    } catch (error) {
      console.error(error);
      revokePreviousAudioUrl();
      setStatus("error");
      setErrorMessage(
        "Something went wrong while generating the audio description."
      );
    } finally {
      input.value = "";
    }
  }

  const handleTriggerFilePicker = () => {
    fileInputRef.current?.click();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/60">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Image to Audio Description
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Upload an image and get an audio description tailored for blind and
            low-vision users.
          </p>
        </header>

        <section aria-labelledby="upload-section-title">
          <h2 id="upload-section-title" className="sr-only">
            Upload image
          </h2>

          <label
            htmlFor="image-upload"
            className="mb-2 block text-sm font-medium text-slate-100"
          >
            Choose an image file
          </label>

          <p className="mb-3 text-xs text-slate-400">
            Supported: PNG, JPG, GIF. The image will be sent to an AI model to
            generate a short verbal description, then converted to audio.
          </p>

          <div className="relative flex items-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-900 px-4 py-4">
            <input
              id="image-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              aria-describedby="upload-help-text"
              aria-busy={isBusy}
            />
            <div className="flex flex-1 items-center justify-between gap-3">
              <p
                id="upload-help-text"
                className="text-sm text-slate-300"
              >
                Press the button to select an image from your device.
              </p>
              <button
                type="button"
                onClick={handleTriggerFilePicker}
                className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                disabled={isBusy}
              >
                {isBusy ? "Processing…" : "Choose file"}
              </button>
            </div>
          </div>
        </section>

        <div
          className="mt-3 text-xs text-slate-400"
          aria-live="polite"
          aria-atomic="true"
        >
          {status === "idle" && "No file selected yet."}
          {status === "uploading" && "Uploading image…"}
          {status === "processing" && "Generating description and audio…"}
          {status === "done" && "Audio description ready."}
          {status === "error" && errorMessage}
        </div>

        {descriptionText && (
          <section className="mt-6 rounded-xl bg-slate-900/80 p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-100">
              Generated description (text)
            </h2>
            <p className="text-sm text-slate-200">{descriptionText}</p>
          </section>
        )}

        {audioUrl && (
          <section className="mt-6 rounded-xl bg-slate-900/80 p-4">
            <h2 className="mb-3 text-sm font-semibold text-slate-100">
              Audio description
            </h2>
            <audio
              controls
              src={audioUrl}
              className="w-full"
              aria-label="Audio description of the uploaded image"
            />
            <a
              href={audioUrl}
              download="image-description.mp3"
              className="mt-3 inline-flex text-sm font-medium text-sky-400 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Download audio file
            </a>
          </section>
        )}

        <button onClick={resetState}>Reset</button>
      </div>
    </main>
  );
}

export default HomePage;