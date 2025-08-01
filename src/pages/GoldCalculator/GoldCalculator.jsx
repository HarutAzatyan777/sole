import React, { useState } from "react";
import "./GoldCalculator.css";
import GoldPurityInfographic from "./GoldInfographic";

const goldPurities = [
  { label: "999 (24K)", value: 0.999 },
  { label: "958 (23K)", value: 0.958 },
  { label: "916 (22K)", value: 0.916 },
  { label: "900 (21.6K)", value: 0.900 },
  { label: "875 (21K)", value: 0.875 },
  { label: "750 (18K)", value: 0.750 },
  { label: "585 (14K)", value: 0.585 },
  { label: "500 (12K)", value: 0.500 },
  { label: "417 (10K)", value: 0.417 },
  { label: "375 (9K)", value: 0.375 },
];

const GoldCalculator = () => {
  const [weight, setWeight] = useState("");
  const [fromPurity, setFromPurity] = useState(0.999);
  const [toPurity, setToPurity] = useState(0.585);
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!weight || isNaN(weight) || weight <= 0) {
      setResult("Խնդրում ենք մուտքագրել ճիշտ քաշ");
      return;
    }

    const pureGold = weight * fromPurity;
    const equivalentWeight = pureGold / toPurity;
    setResult(`${equivalentWeight.toFixed(3)} գրամ`);
  };

  return (
    <div className="gold-calculator-container">
      <h2>Ոսկու Պռոբ Փոխակերպիչ</h2>
      <div className="gold-input-group">
        <label>Քաշ (գրամով)</label>
        <input
          type="number"
          min="0"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="օր.՝ 10"
        />
      </div>

      <div className="gold-select-group">
        <label>Սկզբնական Պռոբ</label>
        <select
          value={fromPurity}
          onChange={(e) => setFromPurity(Number(e.target.value))}
        >
          {goldPurities.map((p) => (
            <option key={p.label} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="gold-select-group">
        <label>Թիրախ Պռոբ</label>
        <select
          value={toPurity}
          onChange={(e) => setToPurity(Number(e.target.value))}
        >
          {goldPurities.map((p) => (
            <option key={p.label} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <button className="gold-calc-btn" onClick={handleCalculate}>
        Հաշվել
      </button>

      {result && <div className="gold-result">Արդյունք: {result}</div>}
      <GoldPurityInfographic />
    </div>
  );
};

export default GoldCalculator;
