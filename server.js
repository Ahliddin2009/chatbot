// server.js
const express = require("express");
const cors = require("cors");

// Node 18+ bo‘lsa fetch bor
// Agar ishlamasa:
// npm install node-fetch
// va pastdagini och:
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

// Middleware
app.use(cors({
    origin: "*"
}));
app.use(express.json());

// 🔑 API KEY
const API_KEY = process.env.NxykL4qicPxJqb4SCCbnKTbymFmUaKP6;

// 🧠 Chat endpoint
app.post("/chat", async (req, res) => {
    try {
        const messages = req.body.messages;

        // ❌ Tekshiruv
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                error: "messages noto‘g‘ri formatda"
            });
        }

        // 🔗 Mistral API ga so‘rov
        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "mistral-small",
                messages:[
                        {
                            role: "system",
                            content: "Sen professional dasturchi AI san. HTML, CSS, JS, Python bo‘yicha aniq va qisqa javob ber. Har doim o‘zbek tilida javob ber."                        },
                        ...messages
                    ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        // ❌ Agar API xato qaytarsa
        if (!response.ok) {
            console.log("Mistral error:", data);
            return res.status(500).json({
                error: "Mistral API xatolik berdi",
                detail: data
            });
        }

        // ✅ Javob olish
        const reply = data?.choices?.[0]?.message?.content;

        if (!reply) {
            return res.status(500).json({
                error: "Javob topilmadi"
            });
        }

        // 🎉 Frontendga yuborish
        res.json({ reply });

    } catch (error) {
        console.log("Server error:", error);

        res.status(500).json({
            error: "Server ichki xatolik"
        });
    }
});

// 🧪 Test endpoint (browserda tekshirish uchun)
app.get("/", (req, res) => {
    res.send("✅ AI server ishlayapti");
});

// 🚀 Serverni ishga tushirish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server ishlayapti: http://localhost:${PORT}`);
});
