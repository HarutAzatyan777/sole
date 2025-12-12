import React, { useEffect, useRef, useState } from "react";
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
  const [isCalculating, setIsCalculating] = useState(false);
  const [breakdown, setBreakdown] = useState(null);
  const intervalRef = useRef(null);

  const num = (v) => (v === "" || isNaN(v) ? 0 : Number(v));

  const diamondCutMultiplier = {
    EX: 1.0,
    VG: 0.9,
    G: 0.8,
    F: 0.7,
  };

  // Quick gold purity options
  const goldPurities = ["375", "585", "750", "916"];

  const clearProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const calculateValue = () => {
    if (!goldGram || !goldPurity || !goldPricePerGram || !laborCost) {
      alert("Խնդրում ենք լրացնել ոսկու և աշխատանքի դաշտերը:");
      return;
    }

    clearProgressInterval();
    setProgress(0);
    setTotalValue(null);
    setBreakdown(null);
    setIsCalculating(true);

    let step = 0;
    intervalRef.current = setInterval(() => {
      step += 10;
      setProgress(step);
      if (step >= 100) {
        clearProgressInterval();

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
        const rateUsed = currency === "AMD" ? 400 : 1;
        const totalBase = goldValue + num(laborCost) + diamondValue;
        const totalConverted = totalBase * rateUsed;

        setTotalValue(totalConverted.toFixed(2));
        setBreakdown({
          gold: (goldValue * rateUsed).toFixed(2),
          labor: (num(laborCost) * rateUsed).toFixed(2),
          diamond: (diamondValue * rateUsed).toFixed(2),
          currency,
          rateUsed,
          hasDiamond: Boolean(diamondCarat && diamondPricePerCarat),
        });
        setIsCalculating(false);
      }
    }, 50);
  };

  useEffect(() => {
    return () => {
      clearProgressInterval();
    };
  }, []);

  return (
    <div className="calculator-container">
      <h2>Զարդի գնի հաշվիչ</h2>

      {/* GOLD */}
      <h3>Ոսկի (անհրաժեշտ)</h3>
      <div className="jw-input">
        <label>Քաշը գրամներով (գր)</label>
        <input
          type="number"
          value={goldGram}
          onChange={(e) => setGoldGram(e.target.value)}
          placeholder="օր. 10"
        />
        <small className="field-hint">Մուտքագրեք զարդի ոսկյա մասի մաքուր քաշը գրամներով:</small>
      </div>

      <div className="jw-input">
        <label>Հարգ (օր.` 585)</label>
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
          placeholder="օր. 585"
        />
        <small className="field-hint">Ընտրեք կամ մուտքագրեք հարգը ‰ ձևաչափով (585, 750 և այլն):</small>
      </div>

      <div className="jw-input">
        <label>Գին 1 գրամի համար (999 ոսկի, ընտրած արժույթով)</label>
        <input
          type="number"
          value={goldPricePerGram}
          onChange={(e) => setGoldPricePerGram(e.target.value)}
          placeholder="օր. 79"
        />
        <small className="field-hint">
          Գինը պետք է համապատասխանի ձեր ընտրած արժույթին (մնացած հարգերի գինը կհանվի 999 գնի հիման վրա):
        </small>
      </div>

      {/* LABOR */}
      <h3>Աշխատանքի գին</h3>
      <div className="jw-input">
        <label>Գումար (ընտրած արժույթով)</label>
        <input
          type="number"
          value={laborCost}
          onChange={(e) => setLaborCost(e.target.value)}
          placeholder="օր. 20"
        />
      </div>

      {/* DIAMOND */}
      <h3>Ադամանդ (ըստ անհրաժեշտության)</h3>
      <div className="jw-input">
        <label>Քաշը կարատներով (ct)</label>
        <input
          type="number"
          value={diamondCarat}
          onChange={(e) => setDiamondCarat(e.target.value)}
          placeholder="օր. 0.25"
        />
      </div>

      <div className="jw-input">
        <label>Գին 1 կարատի համար (ընտրած արժույթով)</label>
        <input
          type="number"
          value={diamondPricePerCarat}
          onChange={(e) => setDiamondPricePerCarat(e.target.value)}
          placeholder="օր. 2000"
        />
        <small className="field-hint">Թողեք ադամանդի դաշտերը դատարկ, եթե ադամանդ չկա:</small>
      </div>

      <div className="jw-input">
        <label>Կտրվածք (Cut)</label>
        <select value={diamondCut} onChange={(e) => setDiamondCut(e.target.value)}>
          <option value="EX">EX (Excellent)</option>
          <option value="VG">VG (Very Good)</option>
          <option value="G">G (Good)</option>
          <option value="F">F (Fair)</option>
        </select>
      </div>

      {/* Currency Selector */}
      <div className="jw-input">
        <label>Արժույթ</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="AMD">AMD</option>
        </select>
      </div>

      {/* Calculate Button */}
      <button className="jewbutton" onClick={calculateValue} disabled={isCalculating}>
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
          <h3>Ընդհանուր գին: {totalValue} {currency}</h3>
          {breakdown && (
            <div className="breakdown">
              <p>Ոսկի: {breakdown.gold} {currency} ({goldPurity}‰ · {goldGram || 0} գ)</p>
              <p>Աշխատանք: {breakdown.labor} {currency}</p>
              {breakdown.hasDiamond ? (
                <p>
                  Ադամանդ: {breakdown.diamond} {currency} ({diamondCarat} ct, {diamondCut},
                  գործակից {diamondCutMultiplier[diamondCut]}x)
                </p>
              ) : (
                <p>Ադամանդ չի մուտքագրվել</p>
              )}
              {currency === "AMD" && (
                <p className="field-hint">Հաշվարկը կատարվել է 1 USD = {breakdown.rateUsed} AMD կուրսով:</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
