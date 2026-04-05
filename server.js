const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());

// 🔑 API KEY (Render Environment dan olinadi)
const API_KEY = process.env.API_KEY;

// 🧠 Chat endpoint
app.post("/chat", async (req, res) => {
    try {
        const messages = req.body.messages;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                error: "messages noto‘g‘ri"
            });
        }

        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "mistral-small",
                messages: [
                    {
                        role: "system",
                        content: "Sen aqlli AI yordamchisan. Har doim o‘zbek tilida qisqa va aniq javob ber."
                    },
                    ...messages
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        console.log(data); // debug uchun

        if (!response.ok) {
            return res.status(500).json({ error: data });
        }

        const reply = data?.choices?.[0]?.message?.content;

        if (!reply) {
            return res.status(500).json({ error: "Javob topilmadi" });
        }

        res.json({ reply });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

// test route
app.get("/", (req, res) => {
    res.send("✅ AI server ishlayapti");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Server:", PORT);
});
