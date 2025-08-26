import React, { useEffect, useState } from "react";

export default function QuoteWidget() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch("https://zenquotes.io/api/random");
        const data = await res.json();
        setQuote(data[0]); // zenquotes returns array
      } catch (err) {
        console.error("Error fetching quote:", err);
      }
    }
    fetchQuote();
  }, []);

  return (
    <div style={{ margin: "1rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
      {quote ? (
        <>
          <p style={{ fontSize: "1.25rem", fontStyle: "italic" }}>"{quote.q}"</p>
          <p style={{ textAlign: "right", marginTop: "0.5rem", fontWeight: "bold" }}>— {quote.a}</p>
        </>
      ) : (
        "Loading quote..."
      )}
    </div>
  );
}