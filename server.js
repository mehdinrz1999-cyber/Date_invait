const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post("/api/answer", async (req, res) => {
  try {
    if (!BOT_TOKEN || !CHAT_ID) return res.status(500).json({error:"Telegram is not configured"});
    const a = req.body || {};
    const text =
`💌 جواب جدید برای قرار!

❤️ قرار: ${a["قرار"] || "-"}
📅 تاریخ: ${a["تاریخ"] || "-"}
🕐 ساعت: ${a["ساعت"] || "-"}
🍽️ غذا: ${a["غذا"] || "-"}
💭 یادداشت: ${a["یادداشت"] || "-"}`;

    const tg = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({chat_id:CHAT_ID,text})
    });
    if (!tg.ok) return res.status(502).json({error:"Telegram send failed"});
    res.json({ok:true});
  } catch (e) {
    res.status(500).json({error:"server error"});
  }
});

app.listen(PORT, ()=>console.log(`Running on http://localhost:${PORT}`));