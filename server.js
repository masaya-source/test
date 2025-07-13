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
  const dashboardIdRaw = req.body.dashboardId; // 文字列の可能性あり
  const dashboardId = Number(dashboardIdRaw);  // 数値に変換

  if (!dashboardIdRaw) {
    return res.status(400).json({ error: "dashboardId is required" });
  }

  if (isNaN(dashboardId)) {
    return res.status(400).json({ error: "dashboardId must be a valid number" });
  }

  const params = req.body.params || {};

  const payload = {
    resource: { dashboard: dashboardId }, // 数値でセット
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
