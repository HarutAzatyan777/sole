import { useEffect, useRef, useState } from "react";

const SecretRedirect = () => {
  const bufferRef = useRef("");
  const [tapCount, setTapCount] = useState(0);
  const secretCode = "admin";
  const tapsNeeded = 5;
  const tapTimeoutMs = 3000; // 3 վրկ ընթացքում 5 սեղմում

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      bufferRef.current = (bufferRef.current + key).slice(-secretCode.length);

      if (bufferRef.current === secretCode) {
        window.location.href = "/admin";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (tapCount >= tapsNeeded) {
      window.location.href = "/admin";
    }
  }, [tapCount]);

  // Բացահայտելու համար 5 սեղմումները հետևողական և արագ
  useEffect(() => {
    if (tapCount === 0) return;
    const timer = setTimeout(() => {
      setTapCount(0);
    }, tapTimeoutMs);

    return () => clearTimeout(timer);
  }, [tapCount]);

  const handleTap = () => {
    setTapCount((c) => c + 1);
  };

  return (
    <>
      {/* Անտեսանելի բլոկ էկրանին սեղմելու համար (թույլ է տալիս նաև հեռախոսում) */}
      <div
        onClick={handleTap}
        style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          width: 50,
          height: 50,
          opacity: 0,
          zIndex: 9999,
          cursor: "pointer",
        }}
        aria-label="Secret tap area"
      />
    </>
  );
};

export default SecretRedirect;
