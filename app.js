// Global chart instance
let scanChart = null;

// ===============================
// Normal PDF, CDF, random N(0,1)
// ===============================

function normPdf(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

// Approximation d'erf (Abramowitz & Stegun 7.1.26)
function erf(x) {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1 / (1 + p * x);
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t) * Math.exp(-x * x));

  return sign * y;
}

function normCdf(x) {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

// N(0,1) via Box–Muller
function randNormal() {
  const u1 = Math.random();
  const u2 = Math.random();
  const r = Math.sqrt(-2 * Math.log(u1));
  const theta = 2 * Math.PI * u2;
  return r * Math.cos(theta);
}

// ===============================
// Black–Scholes (European Call/Put)
// ===============================

function priceBlackScholes(params, type) {
  const { S, K, r, sigma, T } = params;
  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  let price;
  if (type === "call") {
    price = S * normCdf(d1) - K * Math.exp(-r * T) * normCdf(d2);
  } else {
    price = K * Math.exp(-r * T) * normCdf(-d2) - S * normCdf(-d1);
  }

  const pdf_d1 = normPdf(d1);
  const delta = type === "call" ? normCdf(d1) : normCdf(d1) - 1;
  const gamma = pdf_d1 / (S * sigma * sqrtT);
  const vega = S * pdf_d1 * sqrtT;

  let theta, rho;
  if (type === "call") {
    theta =
      -(S * pdf_d1 * sigma) / (2 * sqrtT) - r * K * Math.exp(-r * T) * normCdf(d2);
    rho = K * T * Math.exp(-r * T) * normCdf(d2);
  } else {
    theta =
      -(S * pdf_d1 * sigma) / (2 * sqrtT) +
      r * K * Math.exp(-r * T) * normCdf(-d2);
    rho = -K * T * Math.exp(-r * T) * normCdf(-d2);
  }

  return { price, delta, gamma, vega, theta, rho };
}

// ===============================
// Binomial CRR (European)
// ===============================

function priceBinomialCRR(params, type) {
  const { S, K, r, sigma, T, steps } = params;
  const N = steps;
  const dt = T / N;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const disc = Math.exp(-r * dt);
  const a = Math.exp(r * dt);
  const q = (a - d) / (u - d);

  const values = new Array(N + 1);
  for (let i = 0; i <= N; i++) {
    const S_t = S * Math.pow(u, i) * Math.pow(d, N - i);
    if (type === "call") {
      values[i] = Math.max(S_t - K, 0);
    } else {
      values[i] = Math.max(K - S_t, 0);
    }
  }

  for (let step = N - 1; step >= 0; step--) {
    for (let i = 0; i <= step; i++) {
      values[i] = disc * (q * values[i + 1] + (1 - q) * values[i]);
    }
  }

  return { price: values[0] };
}

// ===============================
// Monte Carlo (European Call/Put)
// ===============================

function priceMonteCarlo(params, type, nPaths) {
  const { S, K, r, sigma, T } = params;
  const sqrtT = Math.sqrt(T);
  const disc = Math.exp(-r * T);

  let sumPayoff = 0;
  let sumPayoff2 = 0;

  for (let i = 0; i < nPaths; i++) {
    const Z = randNormal();
    const ST =
      S * Math.exp((r - 0.5 * sigma * sigma) * T + sigma * sqrtT * Z);

    let payoff;
    if (type === "call") {
      payoff = Math.max(ST - K, 0);
    } else {
      payoff = Math.max(K - ST, 0);
    }

    sumPayoff += payoff;
    sumPayoff2 += payoff * payoff;
  }

  const meanPayoff = sumPayoff / nPaths;
  const varPayoff = sumPayoff2 / nPaths - meanPayoff * meanPayoff;
  const stdPayoff = Math.sqrt(Math.max(varPayoff, 0));

  const price = disc * meanPayoff;
  const stderr = disc * stdPayoff / Math.sqrt(nPaths);

  return { price, stderr };
}

// ===============================
// UI helpers
// ===============================

function formatNumber(x) {
  if (!isFinite(x)) return "NaN";
  if (Math.abs(x) >= 1) return x.toFixed(4);
  if (Math.abs(x) >= 0.01) return x.toFixed(6);
  return x.toExponential(3);
}

function createResultRow(label, value) {
  const row = document.createElement("div");
  row.className = "results-row";

  const spanLabel = document.createElement("span");
  spanLabel.className = "label";
  spanLabel.textContent = label;

  const spanValue = document.createElement("span");
  spanValue.className = "value";
  spanValue.textContent = value;

  row.appendChild(spanLabel);
  row.appendChild(spanValue);
  return row;
}

function createResultsBlock(titleText) {
  const block = document.createElement("div");
  block.className = "results-block";

  if (titleText) {
    const title = document.createElement("p");
    title.className = "results-title";
    title.textContent = titleText;
    block.appendChild(title);
  }

  return block;
}

// ===============================
// Scan data & table (Black–Scholes)
// ===============================

function computeScanPoints(paramsBase, type, Kmin, Kmax, nSteps) {
  const Ks = [];
  const prices = [];
  const step = (Kmax - Kmin) / (nSteps - 1);

  for (let i = 0; i < nSteps; i++) {
    const K = Kmin + step * i;
    const params = { ...paramsBase, K };
    const res = priceBlackScholes(params, type);
    Ks.push(K);
    prices.push(res.price);
  }

  return { Ks, prices };
}

function buildScanTableFromData(Ks, prices) {
  const table = document.createElement("table");
  table.className = "scan-table";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  ["K", "Price (BS)"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (let i = 0; i < Ks.length; i++) {
    const tr = document.createElement("tr");
    const tdK = document.createElement("td");
    const tdP = document.createElement("td");
    tdK.textContent = formatNumber(Ks[i]);
    tdP.textContent = formatNumber(prices[i]);
    tr.appendChild(tdK);
    tr.appendChild(tdP);
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  return table;
}

function renderScanChart(canvas, Ks, prices) {
  const ctx = canvas.getContext("2d");
  if (scanChart) {
    scanChart.destroy();
  }

  scanChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Ks.map((k) => k.toFixed(2)),
      datasets: [
        {
          label: "Black–Scholes price",
          data: prices,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        x: {
          title: { display: true, text: "Strike K" }
        },
        y: {
          title: { display: true, text: "Option price (Black–Scholes)" }
        }
      }
    }
  });
}

// ===============================
// Main
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pricing-form");
  const resultsDiv = document.getElementById("results");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const S = Number(document.getElementById("S").value);
    const K = Number(document.getElementById("K").value);
    const r = Number(document.getElementById("r").value);
    const sigma = Number(document.getElementById("sigma").value);
    const T = Number(document.getElementById("T").value);
    const steps = Number(document.getElementById("steps").value);
    const mcPaths = Number(document.getElementById("mcPaths").value);

    const type =
      (document.querySelector('input[name="type"]:checked') || {}).value;
    const model =
      (document.querySelector('input[name="model"]:checked') || {}).value;
    const compareModels = document.getElementById("compareModels").checked;
    const enableScan = document.getElementById("enableScan").checked;

    const scanKMin = Number(document.getElementById("scanKMin").value);
    const scanKMax = Number(document.getElementById("scanKMax").value);
    const scanKSteps = Number(document.getElementById("scanKSteps").value);

    if (!["call", "put"].includes(type) || !["bs", "binomial", "mc"].includes(model)) {
      resultsDiv.innerHTML =
        '<p class="muted">Error: invalid option type or model.</p>';
      return;
    }

    if (S <= 0 || K <= 0 || sigma <= 0 || T <= 0) {
      resultsDiv.innerHTML =
        '<p class="muted">Please use strictly positive values for S, K, σ and T.</p>';
      return;
    }

    if (steps < 1) {
      resultsDiv.innerHTML =
        '<p class="muted">Binomial steps N must be ≥ 1.</p>';
      return;
    }

    if (model === "mc" && mcPaths < 1000) {
      resultsDiv.innerHTML =
        '<p class="muted">For Monte Carlo, please use at least 1000 simulations.</p>';
      return;
    }

    if (enableScan) {
      if (!(scanKSteps >= 2) || !(scanKMax > scanKMin)) {
        resultsDiv.innerHTML =
          '<p class="muted">For the scan: Kmax must be > Kmin and at least 2 points are required.</p>';
        return;
      }
    }

    try {
      const container = document.createElement("div");
      container.className = "results";

      const paramsBase = { S, K, r, sigma, T };
      const paramsBin = { S, K, r, sigma, T, steps };

      // Main pricing block
      if (compareModels) {
        const block = createResultsBlock("Model comparison");

        const resBS = priceBlackScholes(paramsBase, type);
        const resBin = priceBinomialCRR(paramsBin, type);

        const diffAbs = resBin.price - resBS.price;
        const diffRel = (diffAbs / resBS.price) * 100;

        block.appendChild(
          createResultRow("Black–Scholes price", formatNumber(resBS.price))
        );
        block.appendChild(
          createResultRow("Binomial CRR price", formatNumber(resBin.price))
        );
        block.appendChild(
          createResultRow("Absolute difference", formatNumber(diffAbs))
        );
        block.appendChild(
          createResultRow(
            "Relative difference (%)",
            formatNumber(diffRel)
          )
        );
        container.appendChild(block);

        const greeksBlock = createResultsBlock("Greeks (Black–Scholes)");
        greeksBlock.appendChild(
          createResultRow("Delta", formatNumber(resBS.delta))
        );
        greeksBlock.appendChild(
          createResultRow("Gamma", formatNumber(resBS.gamma))
        );
        greeksBlock.appendChild(
          createResultRow("Vega", formatNumber(resBS.vega))
        );
        greeksBlock.appendChild(
          createResultRow("Theta", formatNumber(resBS.theta))
        );
        greeksBlock.appendChild(
          createResultRow("Rho", formatNumber(resBS.rho))
        );
        container.appendChild(greeksBlock);
      } else {
        const modelLabel =
          model === "bs"
            ? "Black–Scholes"
            : model === "binomial"
            ? "Binomial CRR"
            : "Monte Carlo";

        const titleText =
          (type === "call" ? "Call" : "Put") +
          " option · " +
          modelLabel;

        const block = createResultsBlock(titleText);

        if (model === "bs") {
          const res = priceBlackScholes(paramsBase, type);
          block.appendChild(
            createResultRow("Price", formatNumber(res.price))
          );
          block.appendChild(
            createResultRow("Delta", formatNumber(res.delta))
          );
          block.appendChild(
            createResultRow("Gamma", formatNumber(res.gamma))
          );
          block.appendChild(
            createResultRow("Vega", formatNumber(res.vega))
          );
          block.appendChild(
            createResultRow("Theta", formatNumber(res.theta))
          );
          block.appendChild(
            createResultRow("Rho", formatNumber(res.rho))
          );
        } else if (model === "binomial") {
          const res = priceBinomialCRR(paramsBin, type);
          block.appendChild(
            createResultRow("Price", formatNumber(res.price))
          );
        } else if (model === "mc") {
          const res = priceMonteCarlo(paramsBase, type, mcPaths);
          const ciLow = res.price - 1.96 * res.stderr;
          const ciHigh = res.price + 1.96 * res.stderr;

          block.appendChild(
            createResultRow("Monte Carlo price", formatNumber(res.price))
          );
          block.appendChild(
            createResultRow("Standard error", formatNumber(res.stderr))
          );
          block.appendChild(
            createResultRow(
              "95% confidence interval",
              `[${formatNumber(ciLow)} ; ${formatNumber(ciHigh)}]`
            )
          );
          block.appendChild(
            createResultRow("Simulations", mcPaths.toString())
          );
        }

        container.appendChild(block);
      }

      // Scan block
      if (enableScan) {
        const scanBlock = createResultsBlock(
          "Price vs Strike (Black–Scholes)"
        );
        const { Ks, prices } = computeScanPoints(
          { S, r, sigma, T },
          type,
          scanKMin,
          scanKMax,
          scanKSteps
        );
        const table = buildScanTableFromData(Ks, prices);
        scanBlock.appendChild(table);

        const chartWrapper = document.createElement("div");
        chartWrapper.className = "scan-chart-wrapper";
        const canvas = document.createElement("canvas");
        canvas.id = "scanChartCanvas";
        chartWrapper.appendChild(canvas);
        scanBlock.appendChild(chartWrapper);

        container.appendChild(scanBlock);

        // Render chart after it is in the DOM
        renderScanChart(canvas, Ks, prices);
      }

      resultsDiv.innerHTML = "";
      resultsDiv.appendChild(container);
    } catch (err) {
      console.error(err);
      resultsDiv.innerHTML =
        '<p class="muted">An error occurred during pricing.</p>';
    }
  });
});
