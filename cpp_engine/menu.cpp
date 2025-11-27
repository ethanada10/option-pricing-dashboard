#include "menu.hpp"
#include "pricing_models.hpp"
#include <iostream>
#include <limits>
#include <string>

static double ask_double(const std::string& label) {
    double x;
    while (true) {
        std::cout << label;
        if (std::cin >> x) return x;
        std::cout << "Entrée invalide, merci de saisir un nombre.\n";
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    }
}

static int ask_int(const std::string& label) {
    int x;
    while (true) {
        std::cout << label;
        if (std::cin >> x) return x;
        std::cout << "Entrée invalide, merci de saisir un entier.\n";
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    }
}

static OptionType ask_option_type() {
    while (true) {
        std::cout << "Type d'option (C = Call, P = Put) : ";
        char c;
        std::cin >> c;
        if (c == 'C' || c == 'c' || c == 'P' || c == 'p')
            return option_type_from_char(c);
        std::cout << "Merci de taper C ou P.\n";
    }
}

static void run_black_scholes_ui() {
    std::cout << "\n=== Black–Scholes (Européen) ===\n";
    OptionType type = ask_option_type();

    BSParams p;
    p.S     = ask_double("Spot S0                      : ");
    p.K     = ask_double("Strike K                     : ");
    p.r     = ask_double("Taux sans risque r (0.02=2%) : ");
    p.sigma = ask_double("Volatilité sigma (0.2=20%)   : ");
    p.T     = ask_double("Maturité T (années, ex: 0.5) : ");

    BSResult res = price_black_scholes(p, type);

    std::cout << "\n--- Résultat Black–Scholes "
              << option_type_to_string(type) << " ---\n";
    std::cout << "Prix   : " << res.price << "\n";
    std::cout << "Delta  : " << res.delta << "\n";
    std::cout << "Gamma  : " << res.gamma << "\n";
    std::cout << "Vega   : " << res.vega  << "\n";
    std::cout << "Theta  : " << res.theta << "\n";
    std::cout << "Rho    : " << res.rho   << "\n\n";
}

static void run_binomial_ui() {
    std::cout << "\n=== Binomial CRR (Européen) ===\n";
    OptionType type = ask_option_type();

    BinomialParams p;
    p.S     = ask_double("Spot S0                      : ");
    p.K     = ask_double("Strike K                     : ");
    p.r     = ask_double("Taux sans risque r (0.02=2%) : ");
    p.sigma = ask_double("Volatilité sigma (0.2=20%)   : ");
    p.T     = ask_double("Maturité T (années, ex: 0.5) : ");
    p.steps = ask_int   ("Nombre d'étapes N (ex: 100)  : ");

    BinomialResult res = price_binomial_crr(p, type);

    std::cout << "\n--- Résultat Binomial CRR "
              << option_type_to_string(type) << " ---\n";
    std::cout << "Prix   : " << res.price << "\n\n";
}

void run_pricer() {
    while (true) {
        std::cout << "===================================\n";
        std::cout << "        Projet Pricer C++          \n";
        std::cout << "===================================\n";
        std::cout << "1. Black–Scholes européen\n";
        std::cout << "2. Binomial CRR européen\n";
        std::cout << "0. Quitter\n";
        std::cout << "-----------------------------------\n";
        std::cout << "Votre choix : ";

        int choice;
        if (!(std::cin >> choice)) {
            std::cout << "Entrée invalide.\n";
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            continue;
        }

        if (choice == 0) {
            std::cout << "Au revoir !\n";
            break;
        } else if (choice == 1) {
            run_black_scholes_ui();
        } else if (choice == 2) {
            run_binomial_ui();
        } else {
            std::cout << "Choix inconnu.\n";
        }
    }
}
