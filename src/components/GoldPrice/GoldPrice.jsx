import React, { useEffect, useState, useRef } from "react";
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

  const apiKey = "goldapi-1db5oxrlrxf6yrv-io";
  const STORAGE_KEY = "metal_price_cache";

  // 2% զեղչ հայկական շուկայում ոսկու գնի համար
  const armenianMarketDiscountPercent = 2;

  const fetchPrices = (selectedCurrency) => {
    console.log("Starting fetchPrices for currency:", selectedCurrency);

    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16).replace("T", " ");
    const today = now.toISOString().split("T")[0];

    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const cachedEntry = cached[selectedCurrency];

    if (
      cachedEntry &&
      cachedEntry.date === today &&
      cachedEntry.goldGram !== null &&
      cachedEntry.silverGram !== null
    ) {
      console.log("Using cached prices:", cachedEntry);

      if (goldPricePerGram !== null && goldPricePerGram !== cachedEntry.goldGram) {
        setGoldPriceChanged(true);
        setTimeout(() => setGoldPriceChanged(false), 1500);
      }
      if (silverPricePerGram !== null && silverPricePerGram !== cachedEntry.silverGram) {
        setSilverPriceChanged(true);
        setTimeout(() => setSilverPriceChanged(false), 1500);
      }

      setGoldPricePerGram(cachedEntry.goldGram);
      setSilverPricePerGram(cachedEntry.silverGram);
      setLastUpdateDateTime(formattedDateTime);
      setLoading(false);
      return;
    }

    setLoading(true);

    const goldFetch = fetch(`https://www.goldapi.io/api/XAU/${selectedCurrency}`, {
      method: "GET",
      headers: {
        "x-access-token": apiKey,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (!res.ok) {
        console.error("Gold API fetch failed with status:", res.status);
        throw new Error("Gold API Error");
      }
      return res.json();
    });

    const silverFetch = fetch(`https://www.goldapi.io/api/XAG/${selectedCurrency}`, {
      method: "GET",
      headers: {
        "x-access-token": apiKey,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (!res.ok) {
        console.error("Silver API fetch failed with status:", res.status);
        throw new Error("Silver API Error");
      }
      return res.json();
    });

    Promise.all([goldFetch, silverFetch])
      .then(([goldData, silverData]) => {
        console.log("Gold API response:", goldData);
        console.log("Silver API response:", silverData);

        const goldPricePerOunce = goldData.price;
        const silverPricePerOunce = silverData.price;

        if (!goldPricePerOunce || !silverPricePerOunce) {
          throw new Error("Missing price data in response");
        }

        const goldGramPrice = goldPricePerOunce / 31.1035;
        const silverGramPrice = silverPricePerOunce / 31.1035;

        // Հայկական շուկայում 2% զեղչ
        const discountedGoldGramPrice = goldGramPrice * (1 - armenianMarketDiscountPercent / 100);

        if (goldPricePerGram !== null && goldPricePerGram !== discountedGoldGramPrice) {
          setGoldPriceChanged(true);
          setTimeout(() => setGoldPriceChanged(false), 1500);
        }
        if (silverPricePerGram !== null && silverPricePerGram !== silverGramPrice) {
          setSilverPriceChanged(true);
          setTimeout(() => setSilverPriceChanged(false), 1500);
        }

        setGoldPricePerGram(discountedGoldGramPrice);
        setSilverPricePerGram(silverGramPrice);
        setLastUpdateDateTime(formattedDateTime);

        const updatedCache = {
          ...cached,
          [selectedCurrency]: {
            goldGram: discountedGoldGramPrice,
            silverGram: silverGramPrice,
            date: today,
          },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCache));
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching prices:", err);
        setError("Չհաջողվեց բեռնել ոսկու կամ արծաթի գինը");
        setGoldPricePerGram(null);
        setSilverPricePerGram(null);
        setLastUpdateDateTime(null);
      })
      .finally(() => setLoading(false));
  };

  const updateTimeoutRef = useRef(null);

  const getMillisUntilNextUpdate = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    let nextHour = null;
    for (let hour of WORK_HOURS_UPDATE_TIMES) {
      if (
        hour > currentHour ||
        (hour === currentHour && (currentMinute > 0 || currentSecond > 0))
      ) {
        nextHour = hour;
        break;
      }
    }
    if (nextHour === null) {
      const tomorrow9 = new Date(now);
      tomorrow9.setDate(now.getDate() + 1);
      tomorrow9.setHours(WORK_HOURS_UPDATE_TIMES[0], 0, 0, 0);
      return tomorrow9.getTime() - now.getTime();
    } else {
      const nextUpdate = new Date(now);
      nextUpdate.setHours(nextHour, 0, 0, 0);
      return nextUpdate.getTime() - now.getTime();
    }
  };

  useEffect(() => {
    console.log("Effect triggered for currency:", currency);
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    const scheduleNextUpdate = () => {
      console.log("Scheduling next update for currency:", currency);
      fetchPrices(currency);
      const timeout = getMillisUntilNextUpdate();
      updateTimeoutRef.current = setTimeout(() => {
        scheduleNextUpdate();
      }, timeout);
    };

    scheduleNextUpdate();

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [currency]);

  const displayedKarats = showMoreKarats
    ? Object.entries(karatPurity)
    : Object.entries(karatPurity).filter(([karat]) => mainKarats.includes(karat));

  return (
    <div className="gold-price-container">
      <label>
        Ընտրեք արժույթը՝{" "}
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
            1 գրամ մաքուր ոսկու գին՝{" "}
            <strong>
              {goldPricePerGram.toFixed(2).toLocaleString()} {currency}
            </strong>
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
              {displayedKarats.map(([karat, purity]) => {
                const price = goldPricePerGram * purity;
                return (
                  <tr key={karat}>
                    <td>{karat}</td>
                    <td style={{ textAlign: "right" }}>{price.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!showMoreKarats && (
            <button
              className="toggle-btn"
              onClick={() => setShowMoreKarats(true)}
            >
              More...
            </button>
          )}

          {showMoreKarats && (
            <button
              className="toggle-btn toggle-btn-secondary"
              onClick={() => setShowMoreKarats(false)}
            >
              Less
            </button>
          )}

          <h3 style={{ marginTop: "2rem" }}>
            ⚪ 1 գրամ արծաթի գին ({currency})
          </h3>
          <p className={`price ${silverPriceChanged ? "price-change" : ""}`}>
            {silverPricePerGram.toFixed(2).toLocaleString()} {currency}
          </p>
        </>
      ) : (
        <p>Տվյալներ դեռ չկան</p>
      )}
    </div>
  );
};

export default GoldPrice;
