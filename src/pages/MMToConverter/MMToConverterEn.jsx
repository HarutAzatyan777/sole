import React, { useState } from "react";
import "./MMToConverter.css";
import { Helmet } from "react-helmet";

export default function MMToConverterEn() {
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

  // 🔥 Diamond parameters (ENGLISH)
  const diamondParameters = {
    EX: {
      height: "59% – 63%",
      table: "53% – 58%",
      crownAngle: "33° – 35°",
      crownHeight: "14% – 16%",
      girdle: "Thin – Medium",
      pavilionDepth: "42% – 44%",
      lwRatio: "1.00 – 1.02",
      tilt: "≤ 0.3°",
      starHalf: "Star 45–55%, Lower Half 75–80%",
      culet: "None – Very Small",
      origin: "Optional",
    },
    VG: {
      height: "58% – 64%",
      table: "52% – 62%",
      crownAngle: "32° – 36°",
      crownHeight: "13% – 17%",
      girdle: "Thin – Slightly Thick",
      pavilionDepth: "41.5% – 44.5%",
      lwRatio: "1.00 – 1.05",
      tilt: "≤ 0.5°",
      starHalf: "Star 40–60%, Lower Half 70–85%",
      culet: "None – Small",
      origin: "Optional",
    },
    Good: {
      height: "57% – 65%",
      table: "50% – 65%",
      crownAngle: "31° – 37°",
      crownHeight: "12% – 18%",
      girdle: "Thin – Thick",
      pavilionDepth: "41% – 45%",
      lwRatio: "1.00 – 1.10",
      tilt: "≤ 1°",
      starHalf: "Star 35–65%, Lower Half 65–90%",
      culet: "None – Medium",
      origin: "Optional",
    },
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
        setResult("Please enter a valid carat value.");
      } else {
        setResult(`${mm.toFixed(2)} mm (depends on cut)`);
        setDiameter(mm.toFixed(2));
      }
    } else {
      const c = calcMmToCarat(diameter);
      if (!c) {
        setResult("Please enter a valid millimeter value.");
      } else {
        setResult(`${c.toFixed(3)} carat (with cut correction)`);
        setCarat(c.toFixed(3));
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert("Copied!");
    } catch {
      alert("Copy failed.");
    }
  };

  const params = diamondParameters[cut];

  return (
    <div className="mmc-container">
      <Helmet>
        <title>Diamond Carat to mm Converter 2025 | Cut Grade Calculator</title>
        <meta
          name="description"
          content="Convert diamond carat to millimeters and vice versa with 2025 updated cut parameters. Excellent, Very Good, and Good grades included for accurate results."
        />
        <meta name="keywords" content="diamond carat, mm converter, diamond cut, EX VG Good, 2025, jewelry calculator, carat to mm, mm to carat" />
      </Helmet>

      <header>
        <h1 className="mmc-title">
          Diamond Carat ↔ mm Converter (Cut Grade Included)
        </h1>
        <p className="mmc-description">
          2025-2026 Updated Diamond Carat to Millimeter Converter with Excellent, Very Good, and Good cut grades. Enter carat or diameter to get precise results including diamond cut parameters.
        </p>
      </header>
      

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
        <label>Cut Grade</label>
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
          Calculate
        </button>
        <button
          className="btn light"
          onClick={() => {
            setCarat("");
            setDiameter("");
            setResult("");
          }}
        >
          Clear
        </button>
        <button className="btn success" onClick={handleCopy}>
          Copy
        </button>
      </div>

      {result && (
  <div className="mmc-result" id="resultBox">
    <strong>Result:</strong>
    <p>{result}</p>

    <div className="mmc-result-params">
      <h4>Cut Grade: {cut}</h4>
      <ul>
        <li>✔ Height: {params.height}</li>
        <li>✔ Table %: {params.table}</li>
        <li>✔ Crown Height / Angle: {params.crownHeight} / {params.crownAngle}</li>
        <li>✔ Girdle Thickness: {params.girdle}</li>
        <li>✔ Pavilion Depth: {params.pavilionDepth}</li>
        <li>✔ L/W Ratio: {params.lwRatio}</li>
        <li>✔ Tilt: {params.tilt}</li>
        <li>✔ Star Length / Lower Half: {params.starHalf}</li>
        <li>✔ Culet: {params.culet}</li>
        <li>✔ Rough Origin: {params.origin}</li>
      </ul>
    </div>

    {/* ACTION BUTTONS */}
    <div className="mmc-action-buttons">
      <button
        className="btn success"
        onClick={() => {
          const fullText = `
Result: ${result}

Cut Grade: ${cut}
Height: ${params.height}
Table %: ${params.table}
Crown Height / Angle: ${params.crownHeight} / ${params.crownAngle}
Girdle Thickness: ${params.girdle}
Pavilion Depth: ${params.pavilionDepth}
L/W Ratio: ${params.lwRatio}
Tilt: ${params.tilt}
Star Length / Lower Half: ${params.starHalf}
Culet: ${params.culet}
Rough Origin: ${params.origin}
`;
          navigator.clipboard.writeText(fullText);
          alert("All results copied!");
        }}
      >
        Copy All
      </button>

      <button
        className="btn primary"
        onClick={() => {
          const box = document.getElementById("resultBox");
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const width = box.offsetWidth;
          const height = box.offsetHeight;

          canvas.width = width * 2;
          canvas.height = height * 2;
          ctx.scale(2, 2);

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);

          // Render plain text (clean export)
          const text = box.innerText.split("\n");
          ctx.fillStyle = "#000";
          ctx.font = "16px Arial";

          let y = 30;
          text.forEach((line) => {
            ctx.fillText(line, 20, y);
            y += 24;
          });

          const link = document.createElement("a");
          link.download = "diamond_result.png";
          link.href = canvas.toDataURL();
          link.click();
        }}
      >
        Download Image
      </button>
    </div>
  </div>
)}


      {/* ⭐ PARAMETER BLOCK */}
      <div className="mmc-params">
        <h3>Diamond Cut Parameters ({cut})</h3>
        <ul>
          <li>✔ Height: {params.height}</li>
          <li>✔ Table %: {params.table}</li>
          <li>
            ✔ Crown Height / Angle: {params.crownHeight} / {params.crownAngle}
          </li>
          <li>✔ Girdle Thickness: {params.girdle}</li>
          <li>✔ Pavilion Depth: {params.pavilionDepth}</li>
          <li>✔ L/W Ratio: {params.lwRatio}</li>
          <li>✔ Tilt: {params.tilt}</li>
          <li>✔ Star / Lower Half: {params.starHalf}</li>
          <li>✔ Culet: {params.culet}</li>
          <li>✔ Rough Origin: {params.origin}</li>
        </ul>
      </div>

      {/* TABLE */}
      <div className="mmc-table-wrap">
        <h3>Conversion Table</h3>
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

        <p className="mmc-note">
          * Values are approximate for round brilliant diamonds.
        </p>
      </div>
    </div>
  );
}
