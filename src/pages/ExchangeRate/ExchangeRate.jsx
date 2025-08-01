import React, { useEffect, useState } from "react";
import "./ExchangeRate.css";

const ExchangeRate = () => {
  const [data, setData] = useState(null);
  const [base, setBase] = useState("USD");

  // Այս փոխարկվող արժույթը, որից ենք փոխում (հիմնական)
  const [fromCurrency, setFromCurrency] = useState("AMD");
  // Այս փոխարկվող արժույթը, որին ենք փոխում
  const [toCurrency, setToCurrency] = useState("USD");

  // Գումարը, որը ուզում ենք փոխարկել
  const [amount, setAmount] = useState(1);

  // Արդյունքը՝ փոխարկված գումարը
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    fetch(`https://v6.exchangerate-api.com/v6/75b5f33668e01d5cefc564dc/latest/${base}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to fetch exchange rates", err));
  }, [base]);

  useEffect(() => {
    if (!data) return;

    // Փոխարկման գործակիցը՝ fromCurrency => toCurrency
    const rateFromBaseToFrom = data.conversion_rates[fromCurrency];
    const rateFromBaseToTo = data.conversion_rates[toCurrency];

    if (rateFromBaseToFrom && rateFromBaseToTo) {
      // USD-ով արտահայտված 1 fromCurrency = (rateFromBaseToTo / rateFromBaseToFrom) toCurrency
      const rate = rateFromBaseToTo / rateFromBaseToFrom;
      setConvertedAmount((amount * rate).toFixed(4));
    }
  }, [amount, fromCurrency, toCurrency, data]);

  if (!data) return <p>Loading...</p>;

  const {
    documentation,
    terms_of_use,
    time_last_update_utc,
    time_next_update_utc,
    base_code,
    conversion_rates,
  } = data;

  const currencyOptions = Object.keys(conversion_rates);

  return (
    <div className="exchange-container">
      <h1 className="exchange-header">💱 Exchange Rates</h1>

      <p className="exchange-info"><strong>Base currency:</strong> {base_code}</p>
      <p className="exchange-info"><strong>Last updated:</strong> {time_last_update_utc}</p>
      <p className="exchange-info"><strong>Next update:</strong> {time_next_update_utc}</p>

      <div className="base-selector">
        <label>Change Base Currency: </label>
        <select value={base} onChange={(e) => setBase(e.target.value)}>
          {currencyOptions.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </div>

      {/* --- Փոխարկիչ --- */}
      <div style={{ margin: "1rem 0", padding: "1rem", border: "1px solid #ccc", borderRadius: 6 }}>
        <h3>Currency Converter</h3>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="number"
            value={amount}
            min="0"
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: "0.5rem", flex: "1 1 100px" }}
          />

          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} style={{ padding: "0.5rem" }}>
            {currencyOptions.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>

          <span>to</span>

          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} style={{ padding: "0.5rem" }}>
            {currencyOptions.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>

        {convertedAmount !== null && (
          <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
            {amount} {fromCurrency} = {convertedAmount} {toCurrency}
          </p>
        )}
      </div>

      <h3>📋 All Currency Rates (based on {base_code}):</h3>
      <div className="table-wrapper">
        <table className="currency-table">
          <thead>
            <tr>
              <th>Currency</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(conversion_rates).map(([code, rate]) => (
              <tr key={code}>
                <td>{code}</td>
                <td>{rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="links">
        <a href={documentation} target="_blank" rel="noreferrer">📄 API Documentation</a>
        <a href={terms_of_use} target="_blank" rel="noreferrer">📃 Terms of Use</a>
      </div>
    </div>
  );
};

export default ExchangeRate;
