#pragma once

#include <string>

enum class OptionType { Call, Put };

struct BSParams {
    double S;     // Spot
    double K;     // Strike
    double r;     // Taux sans risque
    double sigma; // Volatilité
    double T;     // Maturité (années)
};

struct BSResult {
    double price;
    double delta;
    double gamma;
    double vega;
    double theta;
    double rho;
};

struct BinomialParams {
    double S;
    double K;
    double r;
    double sigma;
    double T;
    int    steps; // Nombre d'étapes du tree
};

struct BinomialResult {
    double price;
};

OptionType option_type_from_char(char c);
std::string option_type_to_string(OptionType t);

BSResult       price_black_scholes(const BSParams& p, OptionType type);
BinomialResult price_binomial_crr(const BinomialParams& p, OptionType type);
