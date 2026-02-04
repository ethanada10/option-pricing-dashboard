📈 Option Pricing Dashboard & Quantitative Pricing Engine

A full-stack quantitative finance engineering project combining a high-performance C++ pricing engine, a Node.js API layer, and a web-based interactive dashboard, fully deployable in the cloud via Docker.
This repository is designed as both an academic showcase and a practical quantitative finance training platform, bridging numerical methods, software engineering, and real-time financial visualization.

🚀 Architecture Overview

Browser (UI)
   ↓ HTTP / JSON
Node.js API (Express)
   ↓ CLI execution
C++ Quant Engine
The C++ core performs all numerical computations, while the Node.js layer exposes a REST API and serves the web interface.
📁 Project Structure
option-pricing-dashboard/
│
├── cpp_engine/              # High-performance quantitative engine (C++)
│   ├── main.cpp
│   ├── menu.cpp
│   ├── menu.hpp
│   ├── pricing_models.cpp
│   └── pricing_models.hpp
│
├── web_interface/          # Browser-based UI
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── server.js              # Node.js API gateway
├── package.json          # Node.js dependencies
├── Dockerfile           # Cloud deployment (Render / Docker)
└── README.md

🧮 Pricing Models Implemented

Model	Type	Outputs	Notes

Black–Scholes	Call / Put	Price, Delta, Gamma, Vega, Theta, Rho	Closed-form, European options
Binomial CRR	Call / Put	Price	Tree-based, converges to BS
Monte Carlo	Call / Put	Price, Std. Error, Confidence Interval	Stochastic, extensible

🌐 Web Dashboard Features

Interactive Black–Scholes pricing with full Greeks
Binomial CRR valuation with step control
Monte Carlo simulation with confidence intervals
Strike scanning and dynamic price curves
Real-time API calls to the C++ backend
Clean and responsive financial UI

⚙️ Running Locally (Web + API + C++)

1. Requirements
Node.js 18+
C++17 compatible compiler (clang++ or g++)
Docker (optional, recommended)

2. Build the C++ Engine
cd cpp_engine
g++ -O3 -std=c++17 main.cpp menu.cpp pricing_models.cpp -o pricer
Test CLI mode:
./pricer
Test API mode:
./pricer bs C 100 110 0.03 0.2 1

3. Run the Node.js Server
From project root:
npm install

npm start
Open in browser:
http://localhost:3000

🐳 Docker Deployment 

Build and Run Locally
docker build -t option-pricer .
docker run -p 3001:3000 option-pricer
Access:
http://localhost:3001

☁️ Cloud Deployment (Render)

This project is fully cloud-ready and deployable as a Docker Web Service.
Steps
Push repository to GitHub
Go to https://render.com
New → Web Service
Select this repository
Environment: Docker
Branch: main
Deploy
Render will provide a public HTTPS URL.

🧠 Engineering Highlights

High-performance numerical core in C++ (O3 optimized)
RESTful API via Node.js + Express
Stateless, containerized deployment via Docker
Frontend/backend separation
JSON-based inter-process communication
Production-ready cloud architecture

🔮 Future Extensions

Implied volatility solvers (Newton-Raphson, Bisection)
American option pricing (early exercise)
Stochastic volatility models (Heston, SABR)
Volatility surface construction
Portfolio-level risk metrics (VaR, Greeks aggregation)
GPU-accelerated Monte Carlo (CUDA / OpenCL)

👤 Author
Ethan Ada
Quantitative Finance & Data Science
GitHub: https://github.com/ethanada10

🎯 Project Purpose

This project serves as a quantitative engineering portfolio piece, demonstrating:
Numerical finance
Software architecture
API design
Cloud deployment
Interactive financial visualization
It is suitable for:
Quantitative finance programs (MSc / M2 / Engineering)
Research prototyping
Trading / risk model experimentation
Technical interviews and GitHub portfolio
