const express = require("express");

const router = express.Router();

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

router.post("/chat", async (req, res) => {
    try {
        const { message, image, mimeType } = req.body;

        let parts = [];

        if (message) {
            parts.push({ text: message });
        }

        if (image) {
            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: image
                }
            });
        }

        const response = await fetch(
            `${GEMINI_URL}?key=${process.env.API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts }]
                })
            }
        );

        const data = await response.json();

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "⚠️Failed to analyze.";

        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            reply: "❌Error while contacting AI."
        });
    }
});

module.exports = router;
