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

  const calculateValue = () => {
    if (!goldGram || !goldPurity || !goldPricePerGram || !laborCost) {
      alert("Խնդրում ենք լրացնել ոսկու և աշխատանքի դաշտերը:");
      return;
    }

    const goldPurityDecimal = parseFloat(goldPurity) / 1000;
    const goldValue = goldGram * goldPurityDecimal * goldPricePerGram;

    let diamondValue = 0;
    if (diamondCarat && diamondPricePerCarat) {
      diamondValue = diamondCarat * diamondPricePerCarat;
    }

    const total = goldValue + parseFloat(laborCost) + diamondValue;
    setTotalValue(total.toFixed(2));
  };

  return (
    <div className="calculator-container">
      <h2>Գանձված Զարդի Գնի Հաշվիչ</h2>

      <h3>Ոսկի</h3>
      <div className="input-group">
        <label>Gram (գր)</label>
        <input
          type="number"
          value={goldGram}
          onChange={(e) => setGoldGram(parseFloat(e.target.value))}
          placeholder="Օրինակ՝ 10"
        />
      </div>
      <div className="input-group">
        <label>Purity (Օրինակ՝ 585)</label>
        <input
          type="number"
          value={goldPurity}
          onChange={(e) => setGoldPurity(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Price per gram ($)</label>
        <input
          type="number"
          value={goldPricePerGram}
          onChange={(e) => setGoldPricePerGram(parseFloat(e.target.value))}
        />
      </div>

      <h3>Աշխատանքի Գին (Labor Cost)</h3>
      <div className="input-group">
        <label>$</label>
        <input
          type="number"
          value={laborCost}
          onChange={(e) => setLaborCost(parseFloat(e.target.value))}
        />
      </div>

      <h3>Ադամանդ (Optional)</h3>
      <div className="input-group">
        <label>Carat (կառատ)</label>
        <input
          type="number"
          value={diamondCarat}
          onChange={(e) => setDiamondCarat(parseFloat(e.target.value))}
        />
      </div>
      <div className="input-group">
        <label>Price per carat ($)</label>
        <input
          type="number"
          value={diamondPricePerCarat}
          onChange={(e) => setDiamondPricePerCarat(parseFloat(e.target.value))}
        />
      </div>
      <div className="input-group">
        <label>Diamond Cut</label>
        <select value={diamondCut} onChange={(e) => setDiamondCut(e.target.value)}>
          <option value="EX">EX</option>
          <option value="VG">VG</option>
          <option value="G">G</option>
          <option value="F">F</option>
        </select>
      </div>

      <button className="jewbutton" onClick={calculateValue}>Հաշվել Ընդհանուր Գինը</button>

      {totalValue && (
        <div className="result">
          <h3>Ընդհանուր Գին: ${totalValue}</h3>
          {diamondCarat && <p>Ադամանդի Դրանք: {diamondCarat} carat ({diamondCut})</p>}
        </div>
      )}
    </div>
  );
}
