import React, { useEffect, useState, useRef, useCallback } from "react";
import "./GoldPrice.css";

const WORK_HOURS_UPDATE_TIMES = [9, 14, 19];

const karatPurity = {
  "999.9": 0.9999,
  "995": 0.995,
  "958": 0.958,
  "916": 0.916,
  "900": 0.9,
  "875": 0.875,
  "750": 0.75,
  "585": 0.585,
  "500": 0.5,
  "416": 0.416,
  "375": 0.375,
  "333": 0.333,
};

const mainKarats = ["999.9", "750", "585"];

const GoldPrice = () => {
  const [currency, setCurrency] = useState("USD");
  const [goldPricePerGram, setGoldPricePerGram] = useState(null);
  const [silverPricePerGram, setSilverPricePerGram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdateDateTime, setLastUpdateDateTime] = useState(null);
  const [showMoreKarats, setShowMoreKarats] = useState(false);

  const [goldPriceChanged, setGoldPriceChanged] = useState(false);
  const [silverPriceChanged, setSilverPriceChanged] = useState(false);

  const updateTimeoutRef = useRef(null);
  const STORAGE_KEY = "metal_price_cache";
  const armenianMarketDiscountPercent = 2;

  const fetchPrices = useCallback(async (selectedCurrency) => {
    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16).replace("T", " ");
    const today = now.toISOString().split("T")[0];

    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const cachedEntry = cached[selectedCurrency];

    if (cachedEntry && cachedEntry.date === today) {
      setGoldPricePerGram(cachedEntry.goldGram);
      setSilverPricePerGram(cachedEntry.silverGram);
      setLastUpdateDateTime(formattedDateTime);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://my-serverless-api-one.vercel.app/api/gold?currency=${selectedCurrency}`
      );
      if (!res.ok) throw new Error("Failed to fetch gold prices");
      const data = await res.json();

      const goldGramPrice = (data.gold / 31.1035) * (1 - armenianMarketDiscountPercent / 100);
      const silverGramPrice = data.silver / 31.1035;

      if (goldPricePerGram !== null && goldPricePerGram !== goldGramPrice) {
        setGoldPriceChanged(true);
        setTimeout(() => setGoldPriceChanged(false), 1500);
      }
      if (silverPricePerGram !== null && silverPricePerGram !== silverGramPrice) {
        setSilverPriceChanged(true);
        setTimeout(() => setSilverPriceChanged(false), 1500);
      }

      setGoldPricePerGram(goldGramPrice);
      setSilverPricePerGram(silverGramPrice);
      setLastUpdateDateTime(formattedDateTime);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...cached,
          [selectedCurrency]: {
            goldGram: goldGramPrice,
            silverGram: silverGramPrice,
            date: today,
          },
        })
      );

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Չհաջողվեց բեռնել ոսկու կամ արծաթի գինը");
      setGoldPricePerGram(null);
      setSilverPricePerGram(null);
      setLastUpdateDateTime(null);
    } finally {
      setLoading(false);
    }
  }, [goldPricePerGram, silverPricePerGram]);

  const getMillisUntilNextUpdate = () => {
    const now = new Date();
    const currentHour = now.getHours();
    let nextHour =
      WORK_HOURS_UPDATE_TIMES.find((h) => h > currentHour) ||
      WORK_HOURS_UPDATE_TIMES[0] + 24;
    const nextUpdate = new Date(now);
    nextUpdate.setHours(nextHour, 0, 0, 0);
    return nextUpdate.getTime() - now.getTime();
  };

  useEffect(() => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);

    const scheduleNextUpdate = () => {
      fetchPrices(currency);
      updateTimeoutRef.current = setTimeout(scheduleNextUpdate, getMillisUntilNextUpdate());
    };

    scheduleNextUpdate();

    return () => {
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    };
  }, [currency, fetchPrices]);

  const displayedKarats = showMoreKarats
    ? Object.entries(karatPurity)
    : Object.entries(karatPurity).filter(([karat]) => mainKarats.includes(karat));

  return (
    <div className="gold-price-container">
      <label>
        Ընտրեք արժույթը՝
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD $</option>
          <option value="EUR">EUR €</option>
          <option value="GBP">GBP £</option>
          <option value="RUB">RUB ₽</option>
        </select>
      </label>

      {loading ? (
        <p className="loading-text">Բեռնվում է...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : goldPricePerGram !== null && silverPricePerGram !== null ? (
        <>
          <p className={`price ${goldPriceChanged ? "price-change" : ""}`}>
            1 գրամ մաքուր ոսկու գին՝ <strong>{goldPricePerGram.toFixed(2)} {currency}</strong>
          </p>
          <p className="update-time">Վերջին թարմացում՝ {lastUpdateDateTime}</p>

          <h3>Ոսկու կարատների գնահատված գներ ({currency})</h3>
          <table>
            <thead>
              <tr>
                <th>Կարատ</th>
                <th style={{ textAlign: "right" }}>Գին (1 գրամ)</th>
              </tr>
            </thead>
            <tbody>
              {displayedKarats.map(([karat, purity]) => (
                <tr key={karat}>
                  <td>{karat}</td>
                  <td style={{ textAlign: "right" }}>
                    {(goldPricePerGram * purity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!showMoreKarats && (
            <button className="toggle-btn" onClick={() => setShowMoreKarats(true)}>
              More...
            </button>
          )}

          <h3 style={{ marginTop: "2rem" }}>⚪ 1 գրամ արծաթի գին ({currency})</h3>
          <p className={`price ${silverPriceChanged ? "price-change" : ""}`}>
            {silverPricePerGram.toFixed(2)} {currency}
          </p>

          {showMoreKarats && (
            <button
              className="toggle-btn toggle-btn-secondary"
              onClick={() => setShowMoreKarats(false)}
            >
              Less
            </button>
          )}
        </>
      ) : (
        <p>Տվյալներ դեռ չկան</p>
      )}
    </div>
  );
};

export default GoldPrice;
