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
  const role = req.body.role;
  let dashboardId = 10;

  if (role === "bubble") {
    dashboardId = 17;
  } else if (role === "admin") {
    dashboardId = 22;
  }

  const payload = {
    resource: { dashboard: dashboardId },
    params: req.body.params || {},
    exp: Math.round(Date.now() / 1000) + 600
  };

  const token = jwt.sign(payload, METABASE_SECRET_KEY);
  const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`;
  res.json({ iframeUrl });
});

app.get("/", (req, res) => {
  res.send("Metabase Embed Server is running");
});

app.listen(process.env.PORT || 3000);
