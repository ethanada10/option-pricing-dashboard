# Option Pricing Dashboard and Quantitative Pricing Engine

This repository provides a complete quantitative finance project combining:

1. A C++ pricing engine for European options (Black–Scholes and Binomial CRR).
2. A web-based interface allowing real-time pricing, model comparison, Monte Carlo simulation and graphical visualization.

The goal of this project is to merge numerical pricing techniques with an interactive and accessible dashboard, suitable both for academic use and practical quantitative finance training.

---

## 1. Project Structure

option-pricing-dashboard/
│
├── cpp_engine/ # Numerical pricing engine in C++
│ ├── main.cpp
│ ├── menu.cpp
│ ├── menu.hpp
│ ├── pricing_models.cpp
│ └── pricing_models.hpp
│
└── web_interface/ # Full browser UI for pricing and charts
├── index.html
├── style.css
└── app.js





---

## 2. Pricing Models Implemented

| Model                | Type        | Outputs                                   | Characteristics |
|---------------------|-------------|-------------------------------------------|-----------------|
| Black–Scholes       | Call / Put  | Price, Delta, Gamma, Vega, Theta, Rho     | Closed-form, fast, European only |
| Binomial CRR        | Call / Put  | Price                                     | Converges to BS as N increases |
| Monte Carlo         | Call / Put  | Price, Standard Error, Confidence Interval| Stochastic and generalizable |

---

## 3. Running the Web Application

No installation is required.



cd web_interface
open index.html # macOS



The dashboard allows:
- Black–Scholes pricing with greeks
- Binomial CRR valuation
- Monte Carlo simulation with confidence intervals
- Strike scanning with interactive price curve graph
- User-friendly interface to adjust financial parameters

---

## 4. Running the C++ Pricing Engine

Requirements: C++17 compatible compiler (`clang++` recommended on macOS).


cd cpp_engine
clang++ main.cpp menu.cpp pricing_models.cpp -std=c++17 -o pricer
./pricer



The terminal interface provides an input system to compute option prices using selected parameters.

---

## 5. Future Upgrades

This repository is structured for evolution. Possible enhancements include:

- Implied volatility solver (Newton/Bisection)
- American option pricing (early exercise check)
- Heston / SABR stochastic volatility models
- Volatility smile + surface visualization
- API linking frontend to C++ backend

---

## 6. Author

Ethan Ada  
Quantitative Finance and Data Science  
GitHub: https://github.com/ethanada10

---

## 7. Project Purpose

This work serves as a quantitative engineering showcase, demonstrating numerical methods, simulation techniques and practical implementation.  
It can be used academically, professionally, or as a foundation for more advanced derivative pricing systems.


