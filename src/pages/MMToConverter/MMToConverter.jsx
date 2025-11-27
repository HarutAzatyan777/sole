import React, { useState } from "react";
import "./MMToConverter.css";

export default function MMToConverter() {
  const [carat, setCarat] = useState("1");
  const [diameter, setDiameter] = useState("6.5");
  const [mode, setMode] = useState("caratToMm");
  const [cut, setCut] = useState("EX");
  const [result, setResult] = useState("");

  const cutFactor = {
    EX: 1.0,
    VG: 0.98,
    Good: 0.96,
  };

  const commonTable = [
    { carat: 0.25, mm: 4.1 },
    { carat: 0.5, mm: 5.2 },
    { carat: 0.75, mm: 5.8 },
    { carat: 1.0, mm: 6.5 },
    { carat: 1.5, mm: 7.4 },
    { carat: 2.0, mm: 8.2 },
    { carat: 3.0, mm: 9.4 },
  ];

  function calcCaratToMm(c) {
    const cNum = Number(c);
    if (!isFinite(cNum) || cNum <= 0) return "";
    let base = 6.5 * Math.cbrt(cNum);
    return base * cutFactor[cut];
  }

  function calcMmToCarat(mm) {
    const mmNum = Number(mm);
    if (!isFinite(mmNum) || mmNum <= 0) return "";
    const corrected = mmNum / cutFactor[cut];
    return Math.pow(corrected / 6.5, 3);
  }

  const handleCalculate = () => {
    if (mode === "caratToMm") {
      const mm = calcCaratToMm(carat);
      if (!mm) {
        setResult("Խնդրում ենք մուտքագրել ճիշտ կարատ");
      } else {
        setResult(`${mm.toFixed(2)} մմ (կախված կտորից)`);
        setDiameter(mm.toFixed(2));
      }
    } else {
      const c = calcMmToCarat(diameter);
      if (!c) {
        setResult("Խնդրում ենք մուտքագրել ճիշտ մմ");
      } else {
        setResult(`${c.toFixed(3)} կարատ (կտորի ուղղումով)`);
        setCarat(c.toFixed(3));
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert("Պատճենված է");
    } catch {
      alert("Չհաջողվեց պատճենել");
    }
  };

  return (
    <div className="mmc-container">
      <h2 className="mmc-title">Ադամանդի Carat → mm փոխարկիչ (Cut grade)</h2>

      <div className="mmc-toggle">
        <button
          className={`mmc-toggle-btn ${mode === "caratToMm" ? "active" : ""}`}
          onClick={() => setMode("caratToMm")}
        >
          Carat → mm
        </button>

        <button
          className={`mmc-toggle-btn ${mode === "mmToCarat" ? "active" : ""}`}
          onClick={() => setMode("mmToCarat")}
        >
          mm → Carat
        </button>
      </div>

      {/* CUT SELECT */}
      <div className="mmc-field">
        <label>Cut (Կտոր)</label>
        <select value={cut} onChange={(e) => setCut(e.target.value)}>
          <option value="EX">EX (Excellent)</option>
          <option value="VG">VG (Very Good)</option>
          <option value="Good">Good</option>
        </select>
      </div>

      {/* INPUT FIELD */}
      {mode === "caratToMm" ? (
        <div className="mmc-field">
          <label>Carat</label>
          <input
            type="number"
            value={carat}
            onChange={(e) => setCarat(e.target.value)}
          />
        </div>
      ) : (
        <div className="mmc-field">
          <label>Diameter (mm)</label>
          <input
            type="number"
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
          />
        </div>
      )}

      {/* BUTTONS */}
      <div className="mmc-buttons">
        <button className="btn primary" onClick={handleCalculate}>
          Հաշվել
        </button>
        <button
          className="btn light"
          onClick={() => {
            setCarat("");
            setDiameter("");
            setResult("");
          }}
        >
          Մաքրել
        </button>
        <button className="btn success" onClick={handleCopy}>
          Պատճենել
        </button>
      </div>

      {result && (
        <div className="mmc-result">
          <strong>Արդյունք:</strong>
          <p>{result}</p>
        </div>
      )}

      {/* TABLE */}
      <div className="mmc-table-wrap">
        <h3>Փոխարկման աղյուսակ</h3>
        <table className="mmc-table">
          <thead>
            <tr>
              <th>Carat</th>
              <th>Diameter (mm)</th>
            </tr>
          </thead>
          <tbody>
            {commonTable.map((r) => (
              <tr key={r.carat}>
                <td>{r.carat}</td>
                <td>{r.mm}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mmc-note">* Տվյալները մոտավոր են round brilliant կտորի համար։</p>
      </div>
    </div>
  );
}
