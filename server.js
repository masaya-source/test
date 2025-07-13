const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const METABASE_SITE_URL = process.env.METABASE_SITE_URL;
const METABASE_SECRET_KEY = process.env.METABASE_SECRET_KEY;

app.post("/generate-metabase-url", (req, res) => {
  const dashboardId = req.body.dashboardId; // ← Bubbleから受け取る
  const params = req.body.params || {};      // ← 任意でフィルターも受け取れる

  if (!dashboardId) {
    return res.status(400).json({ error: "dashboardId is required" });
  }

  const payload = {
    resource: { dashboard: dashboardId },
    params,
    exp: Math.round(Date.now() / 1000) + 600, // 有効期限10分
  };

  const token = jwt.sign(payload, METABASE_SECRET_KEY);
  const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`;

  res.json({ iframeUrl });
});

app.get("/", (req, res) => {
  res.send("Metabase Embed Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
