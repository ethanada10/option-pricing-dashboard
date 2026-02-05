# 📈 Option Pricing Dashboard

## C++ Quant Engine • Node.js API • Web UI • Docker/Render

A full-stack quantitative finance project combining a high-performance **C++ pricing engine**, a **Node.js REST API**, and an interactive **web dashboard**, deployable anywhere using **Docker**.

---

## ✅ `Features`

- **Black–Scholes** pricing (Call/Put) with full Greeks: Delta, Gamma, Vega, Theta, Rho  
- **Binomial CRR** pricing (Call/Put) with configurable steps  
- **Web dashboard** for real-time pricing and visualization  
- **Node.js API** that executes the C++ engine and returns **JSON**  
- **Docker-ready** for cloud deployment (Render)

---

## 🏗️ `Architecture`

```text
┌─────────────────────────┐
│     Web Dashboard        │
│   (HTML / CSS / JS)      │
└───────────┬─────────────┘
            │ HTTP (JSON)
            ▼
┌─────────────────────────┐
│      Node.js API         │
│        (Express)         │
└───────────┬─────────────┘
            │ CLI execution
            ▼
┌─────────────────────────┐
│     C++ Quant Engine     │
│  Black–Scholes / CRR     │
└─────────────────────────┘

```


# 📁 Repository structure

```text

option-pricing-dashboard/
├── cpp_engine/
│   ├── main.cpp
│   ├── menu.cpp
│   ├── menu.hpp
│   ├── pricing_models.cpp
│   └── pricing_models.hpp
├── web_interface/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server.js
├── package.json
├── Dockerfile
└── README.md

```


# 🧮 Models implemented

Model	Type	Output	Notes
Black–Scholes	Call / Put	Price + Greeks	Closed-form (European)
Binomial CRR	Call / Put	Price	Converges to BS as N increases



# ⚡ Run locally

1) Build the C++ engine
cd cpp_engine
g++ -O3 -std=c++17 main.cpp menu.cpp pricing_models.cpp -o pricer
2) Start the API + Web server
npm install
npm start
3) Open the dashboard
https://option-pricing-dashboard-1.onrender.com



# 🔌 API test (JSON)

curl -X POST http://localhost:3000/api/price \
  -H "Content-Type: application/json" \
  -d '{"model":"bs","type":"C","S":100,"K":110,"r":0.03,"sigma":0.2,"T":1}'


  
# 🐳 Docker



docker build -t option-pricer .
docker run -p 3001:3000 option-pricer




# ☁️ Cloud Deployment (Render)

Push repository to GitHub
Go to https://render.com
New → Web Service
Select this repository
Environment: Docker
Branch: main
Deploy
Render will provide a public HTTPS URL.



# 🧠 Engineering Highlights

High-performance numerical core in C++ (O3 optimized)
RESTful API via Node.js + Express
Stateless, containerized deployment via Docker
Frontend / backend separation
JSON-based inter-process communication
Production-ready cloud architecture



# 🔮 Future Extensions

Implied volatility solvers (Newton–Raphson, Bisection)
American option pricing (early exercise)
Stochastic volatility models (Heston, SABR)
Volatility surface construction
Portfolio-level risk metrics (VaR, Greeks aggregation)
GPU-accelerated Monte Carlo (CUDA / OpenCL)



# 👤 Author
Ethan Ada
GitHub: https://github.com/ethanada10
