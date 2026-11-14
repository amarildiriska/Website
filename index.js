const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
admin.initializeApp();

const APP_KEY = defineSecret("DROPBOX_APP_KEY");
const APP_SECRET = defineSecret("DROPBOX_APP_SECRET");
const REFRESH = defineSecret("DROPBOX_REFRESH_TOKEN");

const ROOT = "/Accounting Documents"; // Dropbox destination folder
const MAX = 25 * 1024 * 1024;
const OK_EXT = ["pdf", "jpg", "jpeg", "png", "heic", "xlsx", "xls", "csv", "docx"];
const CATEGORIES = ["W-2", "1099", "Photo ID", "Prior-year return", "Business records", "Bank or payroll statements", "Other"];
const ORIGINS = ["https://riskasfinance.com", "https://www.riskasfinance.com"]; // add localhost for testing

// Dropbox disallows these in names; strip them and cap length.
const clean = s => String(s).replace(/[\\/:*?"<>|\x00-\x1f]/g, "").replace(/\s+/g, " ").trim().slice(0, 80);

async function dropboxToken() {
  const r = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH.value(),
      client_id: APP_KEY.value(),
      client_secret: APP_SECRET.value(),
    }),
  });
  if (!r.ok) throw new Error("dropbox token " + r.status);
  return (await r.json()).access_token;
}

exports.uploadDocument = onRequest(
  { secrets: [APP_KEY, APP_SECRET, REFRESH], cors: ORIGINS, memory: "512MiB", maxInstances: 5 },
  async (req, res) => {
    if (req.method !== "POST") return res.status(405).send("POST only");
    try {
      // 1. Must be a signed-in client
      const m = /^Bearer (.+)$/.exec(req.get("Authorization") || "");
      if (!m) return res.status(401).send("Sign in required");
      const user = await admin.auth().verifyIdToken(m[1]);

      // 2. Validate input
      const name = clean(decodeURIComponent(req.get("X-File-Name") || ""));
      const ext = name.split(".").pop().toLowerCase();
      const year = req.get("X-Tax-Year") || "";
      const cat = decodeURIComponent(req.get("X-Category") || "");
      const body = req.rawBody;
      const thisYear = new Date().getFullYear();
      if (!name || !OK_EXT.includes(ext)) return res.status(400).send("File type not allowed");
      if (!/^\d{4}$/.test(year) || +year > thisYear || +year < thisYear - 6) return res.status(400).send("Bad tax year");
      if (!CATEGORIES.includes(cat)) return res.status(400).send("Bad category");
      if (!body || !body.length || body.length > MAX) return res.status(400).send("Bad file size");

      // 3. Folder = client's name (set as displayName when you create the account), else email
      const who = clean(user.name || user.email || user.uid);
      const path = `${ROOT}/${who}/${year}/${cat}/${name}`;

      // 4. Send to Dropbox (autorename keeps duplicates instead of overwriting)
      const token = await dropboxToken();
      const r = await fetch("https://content.dropboxapi.com/2/files/upload", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/octet-stream",
          "Dropbox-API-Arg": JSON.stringify({ path, mode: "add", autorename: true, mute: false }),
        },
        body,
      });
      if (!r.ok) { console.error("dropbox upload", r.status, await r.text()); return res.status(502).send("Upload failed"); }
      console.log("uploaded", user.uid, path);
      res.status(200).json({ ok: true });
    } catch (e) {
      console.error(e);
      res.status(401).send("Not authorized");
    }
  }
);
