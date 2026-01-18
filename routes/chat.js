const express = require("express");

const router = express.Router();

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

router.post("/chat", async (req, res) => {
    try {
        const { history } = req.body;

        if (!history || !Array.isArray(history)) {
            return res.json({ reply: "⚠️ Invalid chat history." });
        }

        // ✅ Convert frontend history → Gemini format
        const contents = history.map(msg => {
            const parts = [];

            if (msg.text) {
                parts.push({ text: msg.text });
            }

            if (msg.image && msg.mimeType) {
                parts.push({
                    inlineData: {
                        mimeType: msg.mimeType,
                        data: msg.image
                    }
                });
            }

            return {
                role: msg.role === "model" ? "model" : "user",
                parts
            };
        });

        // 🚨 Gemini requires at least ONE user message
        if (!contents.some(c => c.role === "user")) {
            return res.json({
                reply: "👋 Hi! How can I help you?"
            });
        }

        const response = await fetch(
            `${GEMINI_URL}?key=${process.env.API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents })
            }
        );

        const data = await response.json();

        if (data?.error?.code === 429) {
            return res.json({
                reply: "⚠️ I'm a bit busy right now. Please wait a minute and try again."
            });
        }

        if (data?.error) {
            console.error("Gemini error:", data.error);
            return res.json({
                reply: "⚠️ Something went wrong. Please try again."
            });
        }

        if (!data?.candidates?.length) {
            console.error("Gemini response:", data);
            return res.json({
                reply: "⚠️ I couldn’t process that. Try rephrasing."
            });
        }

        const reply = data.candidates[0].content.parts[0].text;
        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            reply: "❌ Error while contacting AI."
        });
    }
});


module.exports = router;