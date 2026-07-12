import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, ThinkingLevel, GenerateVideosOperation } from "@google/genai";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Node 18+ has global fetch, but fallback to importing or standard global fetch

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Initialize Gemini client on the server side
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  // API: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiInitialized: !!ai });
  });

  // API: Gemini Chatbot with Search Grounding & Thinking Level Config
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const { message, history, useSearch, enableThinking, modelOverride } = req.body;
      
      // Determine the model
      let selectedModel = "gemini-3.5-flash"; // Default
      if (modelOverride) {
        selectedModel = modelOverride;
      } else if (enableThinking) {
        selectedModel = "gemini-3.1-pro-preview";
      }

      // Format history into the correct SDK format
      // In @google/genai, ai.models.generateContent accepts contents array
      const contentsList: any[] = [];
      
      if (history && Array.isArray(history)) {
        history.forEach((h: any) => {
          contentsList.push({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content }],
          });
        });
      }

      // Add the current prompt
      contentsList.push({
        role: "user",
        parts: [{ text: message }],
      });

      // Prepare configuration
      const config: any = {
        systemInstruction: "You are Al Barakah Premium's luxury AI Islamic & Fragrance Advisor. Your goal is to guide users to pick premium alcohol-free attars, luxury oud oils, sunglasses, kids toys, and other Al Barakah brand items. Always speak gracefully, with luxury aesthetics, in the user's selected language (Bengali or English). Advise them with deep knowledge about oud, musk, amber, and fragrance notes.",
      };

      // Add search grounding or thinking parameters
      const tools: any[] = [];
      if (useSearch) {
        tools.push({ googleSearch: {} });
        config.tools = tools;
      }

      if (enableThinking) {
        config.thinkingConfig = {
          thinkingLevel: ThinkingLevel.HIGH,
        };
        // DO NOT set maxOutputTokens for HIGH thinking level
      } else {
        // Safe standard config
        config.temperature = 0.7;
      }

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: contentsList,
        config,
      });

      res.json({
        text: response.text,
        modelUsed: selectedModel,
        groundingMetadata: response.candidates?.[0]?.groundingMetadata || null,
      });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({ error: error.message || "Failed to process chat with Gemini." });
    }
  });

  // API: Analyze Images (Attar Vision)
  app.post("/api/gemini/analyze-image", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const { prompt, base64Image, mimeType } = req.body;
      if (!base64Image) {
        return res.status(400).json({ error: "No image data provided." });
      }

      // Clean the base64 prefix if present
      const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

      const imagePart = {
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: cleanBase64,
        },
      };

      const textPart = {
        text: prompt || "Analyze this fragrance-related or lifestyle image and recommend appropriate premium attars or sunglasses from Al Barakah Premium. Explain why it matches.",
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview", // Use premium pro model for image understanding
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: "You are the Vision Expert at Al Barakah Premium. Analyze photos uploaded by users (such as raw flowers, spices, style references, sunglasses, or bottles) and explain their scent profile or style mood, then link them back to luxury Islamic attire, attars, or accessories.",
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Analyze Image API Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze image with Gemini." });
    }
  });

  // API: Generate High-Quality Images (Scent Scent-Art)
  app.post("/api/gemini/generate-image", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const { prompt, size, aspectRatio } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      // For premium high-quality image, use 'gemini-3-pro-image-preview' as requested, or fallback to 'gemini-3-pro-image' / 'gemini-3.1-flash-image'
      const selectedModel = "gemini-3-pro-image-preview";

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio || "1:1",
            imageSize: size || "1K", // '1K', '2K', or '4K'
          },
        },
      });

      // Find inlineData in the parts
      let imageBase64 = "";
      const candidates = response.candidates;
      if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            imageBase64 = part.inlineData.data;
            break;
          }
        }
      }

      if (!imageBase64) {
        // Fallback or double check if it returned in another candidate/part
        throw new Error("No image was returned by the generator. Try adjusting your prompt.");
      }

      res.json({
        imageUrl: `data:image/png;base64,${imageBase64}`,
        size,
        aspectRatio,
      });
    } catch (error: any) {
      console.error("Image Generation API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate image." });
    }
  });

  // API: Veo Video Generation (Animate Images into Video)
  app.post("/api/gemini/generate-video", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const { prompt, base64Image, mimeType, aspectRatio } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const videoConfig: any = {
        numberOfVideos: 1,
        resolution: "720p",
        aspectRatio: aspectRatio || "16:9", // '16:9' or '9:16'
      };

      // Set up parameters for generateVideos
      const generationParams: any = {
        model: "veo-3.1-fast-generate-preview", // Specified model
        prompt: prompt,
        config: videoConfig,
      };

      if (base64Image) {
        const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
        generationParams.image = {
          imageBytes: cleanBase64,
          mimeType: mimeType || "image/png",
        };
      }

      const operation = await ai.models.generateVideos(generationParams);

      res.json({ operationName: operation.name });
    } catch (error: any) {
      console.error("Video Generation Start Error:", error);
      res.status(500).json({ error: error.message || "Failed to start video generation." });
    }
  });

  // API: Veo Video Polling Status
  app.post("/api/gemini/video-status", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: "operationName is required." });
      }

      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });

      res.json({
        done: updated.done,
        error: updated.error || null,
        metadata: updated.metadata || null,
      });
    } catch (error: any) {
      console.error("Video Status API Error:", error);
      res.status(500).json({ error: error.message || "Failed to retrieve video operation status." });
    }
  });

  // API: Veo Video Download & Stream
  app.post("/api/gemini/video-download", async (req, res) => {
    try {
      if (!ai || !apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: "operationName is required." });
      }

      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      
      if (!uri) {
        return res.status(404).json({ error: "Video URI not found on completed operation." });
      }

      // Fetch the video from google URI using our API key
      const videoRes = await fetch(uri, {
        headers: { "x-goog-api-key": apiKey },
      });

      if (!videoRes.ok) {
        throw new Error(`Failed to download video from Google cloud: ${videoRes.statusText}`);
      }

      res.setHeader("Content-Type", "video/mp4");
      // Pipe node-fetch body stream directly to express response
      videoRes.body.pipe(res);
    } catch (error: any) {
      console.error("Video Download API Error:", error);
      res.status(500).json({ error: error.message || "Failed to download and stream video." });
    }
  });

  // API: Text-to-Speech (Scent Sound / TTS)
  app.post("/api/gemini/speech-tts", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const { text, voiceName } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required for speech synthesis." });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Speak in a luxury, elegant and soothing tone: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName || "Kore" }, // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            },
          },
        },
      });

      let base64Audio = "";
      if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
        base64Audio = response.candidates[0].content.parts[0].inlineData.data;
      }

      if (!base64Audio) {
        throw new Error("No audio payload was returned by the TTS model.");
      }

      res.json({ base64Audio });
    } catch (error: any) {
      console.error("TTS API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate speech audio." });
    }
  });

  // Vite development middleware or production static asset server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Al Barakah Fullstack] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
