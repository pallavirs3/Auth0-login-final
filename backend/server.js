import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config.js";
import path from "path";
import { fileURLToPath } from "url";

const {
  PORT = 5000,
  FRONTEND_URL = "https://pallavi-auth0-backend-d4hrahhxaccbetb2.centralindia-01.azurewebsites.net/",
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUDIENCE,
  AUTH0_SCOPE = "openid profile email",
  AUTH0_REALM = "usersp",
} = process.env;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// ✅ Serve frontend static files from backend/public
app.use(express.static(path.join(__dirname, "public")));

// ✅ All routes not starting with /api will return index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ API: health check
app.get("/api/health", (_, res) => res.send("✅ Backend running"));

// ✅ API: login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email & password required" });

  try {
    const { data } = await axios.post(
      `https://${AUTH0_DOMAIN}/oauth/token`,
      {
        grant_type: "http://auth0.com/oauth/grant-type/password-realm",
        username: email,
        password,
        audience: AUTH0_AUDIENCE,
        scope: AUTH0_SCOPE,
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        realm: AUTH0_REALM,
      }
    );

    res.json({
      message: `🎉 Welcome, ${email}! You are successfully logged in.`,
      access_token: data.access_token,
      id_token: data.id_token,
      expires_in: data.expires_in,
    });
  } catch (err) {
    console.error("🔴 LOGIN ERR", err.response?.data || err.message);
    res.status(401).json({ error: "Wrong email or password." });
  }
});

// ✅ API: signup
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email & password required" });

  try {
    const { data: mgmtToken } = await axios.post(
      `https://${AUTH0_DOMAIN}/oauth/token`,
      {
        grant_type: "client_credentials",
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      }
    );

    await axios.post(
      `https://${AUTH0_DOMAIN}/api/v2/users`,
      {
        email,
        password,
        connection: AUTH0_REALM,
        email_verified: false,
      },
      {
        headers: { Authorization: `Bearer ${mgmtToken.access_token}` },
      }
    );

    return res.json({
      created: true,
      message: `✅ Hi ${email}, your account has been created! Please verify your email, then return to login.`,
    });
  } catch (err) {
    console.error("🔴 SIGNUP ERR", err.response?.data || err.message);
    const msg = err.response?.data?.message || "Signup failed";
    res.status(400).json({ error: msg });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Backend running → http://localhost:${PORT}`)
);
