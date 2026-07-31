const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/answer", async (req, res) => {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({
        error: "Telegram settings are missing"
      });
    }

    const a = req.body || {};

    const text =
`💌 جواب جدید برای قرار مهدی!

❤️ قرار: ${a["قرار"] || "-"}
📅 تاریخ: ${a["تاریخ"] || "-"}
🕐 ساعت: ${a["ساعت"] || "-"}
🍽️ غذا: ${a["غذا"] || "-"}
💭 یادداشت: ${a["یادداشت"] || "-"}`;

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text
        })
      }
    );

    if (!response.ok) {
      return res.status(500).json({
        error: "Telegram message failed"
      });
    }

    res.json({ ok: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
