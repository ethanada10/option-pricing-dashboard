#include "pricing_models.hpp"
#include <cmath>
#include <vector>
#include <algorithm>

// Petite constante pi (évitons M_PI non standard)
constexpr double PI = 3.14159265358979323846;

OptionType option_type_from_char(char c) {
    if (c == 'C' || c == 'c') return OptionType::Call;
    return OptionType::Put;
}

std::string option_type_to_string(OptionType t) {
    return (t == OptionType::Call) ? "Call" : "Put";
}

// =====================
// Fonctions math utiles
// =====================

static double norm_cdf(double x) {
    // Φ(x) = 0.5 * erfc(-x / sqrt(2))
    return 0.5 * std::erfc(-x / std::sqrt(2.0));
}

static double norm_pdf(double x) {
    return (1.0 / std::sqrt(2.0 * PI)) * std::exp(-0.5 * x * x);
}

// =====================
// Black–Scholes européen
// =====================

BSResult price_black_scholes(const BSParams& p, OptionType type) {
    double S = p.S;
    double K = p.K;
    double r = p.r;
    double sigma = p.sigma;
    double T = p.T;

    double sqrtT = std::sqrt(T);
    double d1 = (std::log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
    double d2 = d1 - sigma * sqrtT;

    double price;
    if (type == OptionType::Call) {
        price = S * norm_cdf(d1) - K * std::exp(-r * T) * norm_cdf(d2);
    } else {
        price = K * std::exp(-r * T) * norm_cdf(-d2) - S * norm_cdf(-d1);
    }

    double pdf_d1 = norm_pdf(d1);

    double delta = (type == OptionType::Call) ? norm_cdf(d1) : norm_cdf(d1) - 1.0;
    double gamma = pdf_d1 / (S * sigma * sqrtT);
    double vega  = S * pdf_d1 * sqrtT;

    double theta;
    double rho;

    if (type == OptionType::Call) {
        theta = -(S * pdf_d1 * sigma) / (2 * sqrtT)
                - r * K * std::exp(-r * T) * norm_cdf(d2);
        rho   = K * T * std::exp(-r * T) * norm_cdf(d2);
    } else {
        theta = -(S * pdf_d1 * sigma) / (2 * sqrtT)
                + r * K * std::exp(-r * T) * norm_cdf(-d2);
        rho   = -K * T * std::exp(-r * T) * norm_cdf(-d2);
    }

    return {price, delta, gamma, vega, theta, rho};
}

// =====================
// Binomial CRR européen
// =====================

BinomialResult price_binomial_crr(const BinomialParams& p, OptionType type) {
    int N = p.steps;
    double S0    = p.S;
    double K     = p.K;
    double r     = p.r;
    double sigma = p.sigma;
    double T     = p.T;

    double dt = T / N;
    double u  = std::exp(sigma * std::sqrt(dt));
    double d  = 1.0 / u;
    double disc = std::exp(-r * dt);
    double a = std::exp(r * dt);
    double q = (a - d) / (u - d); // probabilité risque-neutre

    // Valeurs terminales de l'option
    std::vector<double> values(N + 1);

    for (int i = 0; i <= N; ++i) {
        // i hausses, (N - i) baisses
        double S_t = S0 * std::pow(u, i) * std::pow(d, N - i);
        if (type == OptionType::Call) {
            values[i] = std::max(S_t - K, 0.0);
        } else {
            values[i] = std::max(K - S_t, 0.0);
        }
    }

    // Remontée dans l'arbre
    for (int step = N - 1; step >= 0; --step) {
        for (int i = 0; i <= step; ++i) {
            values[i] = disc * (q * values[i + 1] + (1.0 - q) * values[i]);
        }
    }

    BinomialResult res;
    res.price = values[0];
    return res;
}
