"use client";

import { useState } from "react";

export default function ShippingTestPage() {
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function runTest() {
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch("/api/shipping/test", { cache: "no-store" });
      const data = await response.json();
      setResult(JSON.stringify({ httpStatus: response.status, ...data }, null, 2));
    } catch (error) {
      setResult(JSON.stringify({ error: error instanceof Error ? error.message : "Request failed." }, null, 2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="test-page">
      <section className="test-panel">
        <p className="eyebrow">TEMPORARY API TEST</p>
        <h1>Shiprocket shipping quote</h1>
        <p>This test uses New Delhi PIN 110001 to Bengaluru PIN 560001, a 0.5 kg prepaid parcel, and does not create an order or schedule a pickup.</p>
        <button onClick={runTest} disabled={busy}>{busy ? "Testing Shiprocket..." : "Calculate test shipping rates"}</button>
        {result && <pre>{result}</pre>}
      </section>
      <style jsx>{`
        .test-page { min-height: 100vh; padding: 48px 20px; background: var(--cream); color: var(--cocoa); }
        .test-panel { max-width: 760px; margin: 0 auto; padding: 32px; background: var(--white); border: 1px solid rgba(75,58,50,.12); }
        .eyebrow { color: var(--coral); font: 700 12px var(--font-lato), sans-serif; letter-spacing: .12em; }
        h1 { margin: 8px 0; font-size: 32px; }
        p { line-height: 1.6; }
        button { margin-top: 16px; padding: 13px 18px; border-radius: 4px; background: var(--coral); color: var(--white); font-weight: 700; }
        button:disabled { opacity: .6; }
        pre { max-height: 560px; overflow: auto; margin-top: 24px; padding: 16px; background: #241f1c; color: #f7f2ea; font: 12px/1.5 monospace; white-space: pre-wrap; }
        @media (max-width: 600px) { .test-page { padding: 24px 12px; } .test-panel { padding: 22px; } h1 { font-size: 26px; } }
      `}</style>
    </main>
  );
}
