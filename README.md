<div align="center">

# 📈 Option Pricing Dashboard  
## C++ Quant Engine • Node.js API • Web UI • Docker/Render

**Full-stack quantitative finance project**: a high-performance **C++ pricing engine** exposed via a **Node.js REST API** and an interactive **web dashboard**, deployable anywhere using **Docker**.

</div>

---

## 🧭 What you get

✅ Black–Scholes pricing **+ full Greeks**  
✅ Binomial CRR pricing (**N steps**)  
✅ Clean Web UI (parameters + results)  
✅ Node.js API that calls the C++ engine  
✅ Docker-ready (Render deployment)

---

## 🏗️ Architecture (clean & simple)

```text
┌──────────────────────┐
│   Web Dashboard (UI)  │
│  HTML / CSS / JS      │
└──────────┬───────────┘
           │  HTTP (JSON)
           ▼
┌──────────────────────┐
│   Node.js API Layer   │
│   Express server      │
└──────────┬───────────┘
           │  CLI execution
           ▼
┌──────────────────────┐
│   C++ Quant Engine    │
│  Black–Scholes / CRR  │
└──────────────────────┘


# 🗂️ Repository structure

option-pricing-dashboard/
├── cpp_engine/                # C++ pricing engine (core)
│   ├── main.cpp
│   ├── menu.cpp
│   ├── menu.hpp
│   ├── pricing_models.cpp
│   └── pricing_models.hpp
│
├── web_interface/             # Frontend (dashboard)
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── server.js                  # Node.js API gateway
├── package.json               # Node deps
├── Dockerfile                 # Deployment (Render/Docker)
└── README.md
