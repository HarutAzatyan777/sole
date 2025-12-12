import React, { useState } from "react";
import "./JewelryPriceCalculator.css";

export default function JewelryPriceCalculator() {
  const [goldGram, setGoldGram] = useState("");
  const [goldPurity, setGoldPurity] = useState("585");
  const [goldPricePerGram, setGoldPricePerGram] = useState("");
  const [laborCost, setLaborCost] = useState("");

  const [diamondCarat, setDiamondCarat] = useState("");
  const [diamondPricePerCarat, setDiamondPricePerCarat] = useState("");
  const [diamondCut, setDiamondCut] = useState("EX");

  const [totalValue, setTotalValue] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currency, setCurrency] = useState("USD"); // USD or AMD

  const num = (v) => (v === "" || isNaN(v) ? 0 : Number(v));

  const diamondCutMultiplier = {
    EX: 1.0,
    VG: 0.9,
    G: 0.8,
    F: 0.7,
  };

  // Quick gold purity options
  const goldPurities = ["375", "585", "750", "916"];

  const calculateValue = () => {
    if (!goldGram || !goldPurity || !goldPricePerGram || !laborCost) {
      alert("Խնդրում ենք լրացնել ոսկու և աշխատանքի դաշտերը:");
      return;
    }

    setProgress(0);
    setTotalValue(null);

    let step = 0;
    const interval = setInterval(() => {
      step += 10;
      setProgress(step);
      if (step >= 100) {
        clearInterval(interval);

        // GOLD VALUE
        const purityDecimal = num(goldPurity) / 1000;
        const goldValue = num(goldGram) * purityDecimal * num(goldPricePerGram);

        // DIAMOND VALUE
        let diamondValue = 0;
        if (diamondCarat && diamondPricePerCarat) {
          const multiplier = diamondCutMultiplier[diamondCut];
          diamondValue = num(diamondCarat) * num(diamondPricePerCarat) * multiplier;
        }

        // TOTAL VALUE
        let total = goldValue + num(laborCost) + diamondValue;

        // Convert to AMD if needed (example rate: 1 USD = 400 AMD)
        if (currency === "AMD") {
          total *= 400;
        }

        setTotalValue(total.toFixed(2));
      }
    }, 50);
  };

  return (
    <div className="calculator-container">
      <h2>Գանձված Զարդի Գնի Հաշվիչ</h2>

      {/* GOLD */}
      <h3>Ոսկի</h3>
      <div className="jw-input">
        <label>Gram (գր)</label>
        <input
          type="number"
          value={goldGram}
          onChange={(e) => setGoldGram(e.target.value)}
        />
      </div>

      <div className="jw-input">
        <label>Purity (Օրինակ՝ 585)</label>
        <div style={{ display: "flex", gap: "10px", marginBottom: "5px" }}>
          {goldPurities.map((p) => (
            <button
              key={p}
              type="button"
              className={goldPurity === p ? "selected-purity" : ""}
              onClick={() => setGoldPurity(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <input
          type="number"
          value={goldPurity}
          onChange={(e) => setGoldPurity(e.target.value)}
        />
      </div>

      <div className="jw-input">
        <label>Price per gram ($)</label>
        <input
          type="number"
          value={goldPricePerGram}
          onChange={(e) => setGoldPricePerGram(e.target.value)}
        />
      </div>

      {/* LABOR */}
      <h3>Աշխատանքի Գին</h3>
      <div className="jw-input">
        <label>$</label>
        <input
          type="number"
          value={laborCost}
          onChange={(e) => setLaborCost(e.target.value)}
        />
      </div>

      {/* DIAMOND */}
      <h3>Ադամանդ</h3>
      <div className="jw-input">
        <label>Carat (կառատ)</label>
        <input
          type="number"
          value={diamondCarat}
          onChange={(e) => setDiamondCarat(e.target.value)}
        />
      </div>

      <div className="jw-input">
        <label>Price per carat ($)</label>
        <input
          type="number"
          value={diamondPricePerCarat}
          onChange={(e) => setDiamondPricePerCarat(e.target.value)}
        />
      </div>

      <div className="jw-input">
        <label>Diamond Cut</label>
        <select value={diamondCut} onChange={(e) => setDiamondCut(e.target.value)}>
          <option value="EX">EX (Excellent)</option>
          <option value="VG">VG (Very Good)</option>
          <option value="G">G (Good)</option>
          <option value="F">F (Fair)</option>
        </select>
      </div>

      {/* Currency Selector */}
      <div className="jw-input">
        <label>Currency</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="AMD">AMD</option>
        </select>
      </div>

      {/* Calculate Button */}
      <button className="jewbutton" onClick={calculateValue}>
        Հաշվել Ընդհանուր Գինը
      </button>

      {/* Progress Bar */}
      {progress > 0 && progress < 100 && (
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Result */}
      {totalValue && (
        <div className="result">
          <h3>Ընդհանուր Գին: {totalValue} {currency}</h3>
          {diamondCarat && (
            <>
              <p>Ադամանդ՝ {diamondCarat} ct ({diamondCut})</p>
              <p>Cut multiplier: {diamondCutMultiplier[diamondCut]}×</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
