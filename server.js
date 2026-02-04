import express from "express";
import { execFile } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sert le front
app.use(express.static(path.join(__dirname, "web_interface")));

// API pricing
app.post("/api/price", (req, res) => {
  const { model, type, S, K, r, sigma, T, steps } = req.body;

  const pricerPath = path.join(__dirname, "cpp_engine", "pricer");

  let args;
  if (model === "bs") {
    args = ["bs", type, String(S), String(K), String(r), String(sigma), String(T)];
  } else if (model === "binomial") {
    args = ["binomial", type, String(S), String(K), String(r), String(sigma), String(T), String(steps)];
  } else {
    return res.status(400).json({ error: "model must be 'bs' or 'binomial'" });
  }

  execFile(pricerPath, args, { timeout: 10000 }, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr?.toString() || err.message });

    const out = stdout.toString().trim();
    try {
      return res.json(JSON.parse(out));
    } catch {
      return res.status(500).json({ error: "C++ output is not valid JSON", raw: out });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
