"use client"

import { useState } from "react"

export default function CarFinance({ price }: { price: number }) {

const [downPercent, setDownPercent] = useState(20)
const [years, setYears] = useState(5)

const months = years * 12

// ดอกเบี้ย 4% ต่อปี
const interestRate = 0.04

const downPayment = price * (downPercent / 100)
const loan = price - downPayment

const totalInterest = loan * interestRate * years

const monthly = (loan + totalInterest) / months

return (
<>
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@400;600;700;900&display=swap');

  .cf-wrap {
    background: #17171B;
    border: 1px solid rgba(255,255,255,0.07);
    border-top: 2px solid #E8191A;
    border-radius: 8px;
    overflow: hidden;
    font-family: 'Barlow', sans-serif;
  }

  /* ── HEADER ── */
  .cf-header {
    background: #1F1F25;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    padding: 14px 18px;
    display: flex; align-items: center; gap: 10px;
  }
  .cf-header-slash {
    width: 3px; height: 18px;
    background: #E8191A; border-radius: 1px; flex-shrink: 0;
  }
  .cf-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem; letter-spacing: 0.1em;
    color: #F0EEE9; line-height: 1;
  }
  .cf-icon { font-size: 0.9rem; }

  /* ── BODY ── */
  .cf-body { padding: 16px 18px; }

  /* ── PRICE ROW ── */
  .cf-price-row {
    display: flex; align-items: baseline; justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .cf-price-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #6B6B78;
  }
  .cf-price-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.15rem; letter-spacing: 0.06em;
    color: #F0EEE9;
  }

  /* ── CONTROL BLOCK ── */
  .cf-control { margin-bottom: 14px; }
  .cf-control-header {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 8px;
  }
  .cf-control-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: #6B6B78;
  }
  .cf-control-value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem; letter-spacing: 0.06em;
    color: #E8191A;
  }

  /* ── SLIDER ── */
  .cf-slider {
    -webkit-appearance: none; appearance: none;
    width: 100%; height: 3px; border-radius: 2px; outline: none; cursor: pointer;
    background: linear-gradient(
      to right,
      #E8191A 0%,
      #E8191A var(--pct, 40%),
      #2A2A32 var(--pct, 40%),
      #2A2A32 100%
    );
  }
  .cf-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px; height: 16px; border-radius: 50%;
    background: #E8191A;
    border: 2px solid #F0EEE9;
    box-shadow: 0 0 8px rgba(232,25,26,0.5);
    cursor: pointer; transition: transform 0.15s;
  }
  .cf-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
  .cf-slider::-moz-range-thumb {
    width: 16px; height: 16px; border-radius: 50%;
    background: #E8191A; border: 2px solid #F0EEE9;
    cursor: pointer;
  }

  /* ── SELECT ── */
  .cf-select {
    width: 100%;
    background: #1F1F25;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px;
    color: #F0EEE9;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.88rem; letter-spacing: 0.06em;
    padding: 9px 32px 9px 12px; outline: none; cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23E8191A'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center;
    transition: border-color 0.2s;
  }
  .cf-select:focus { border-color: #E8191A; box-shadow: 0 0 0 2px rgba(232,25,26,0.2); }
  .cf-select option { background: #1F1F25; }

  /* ── DOWN PAYMENT INFO ── */
  .cf-down-row {
    display: flex; justify-content: space-between;
    margin-bottom: 14px;
    padding: 10px 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 4px;
  }
  .cf-down-item { text-align: center; }
  .cf-down-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.58rem; letter-spacing: 0.16em; text-transform: uppercase;
    color: #6B6B78; margin-bottom: 3px;
  }
  .cf-down-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.9rem; font-weight: 700;
    color: #888892;
  }
  .cf-down-val.accent { color: #F0EEE9; }

  /* ── RESULT ── */
  .cf-result {
    background: linear-gradient(135deg, rgba(232,25,26,0.12) 0%, rgba(183,18,18,0.06) 100%);
    border: 1px solid rgba(232,25,26,0.25);
    border-radius: 6px;
    padding: 16px 14px;
    text-align: center;
    position: relative; overflow: hidden;
    margin-top: 4px;
  }
  .cf-result::before {
    content: '฿';
    position: absolute; right: -4px; top: 50%; transform: translateY(-50%);
    font-family: 'Bebas Neue', sans-serif;
    font-size: 6rem; line-height: 1;
    color: rgba(232,25,26,0.07);
    pointer-events: none; letter-spacing: -0.05em;
  }
  .cf-result-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(232,25,26,0.7); margin-bottom: 6px;
  }
  .cf-result-amount {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.2rem; letter-spacing: 0.05em; line-height: 1;
    color: #E8191A;
    position: relative; z-index: 1;
  }
  .cf-result-unit {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; letter-spacing: 0.12em;
    color: rgba(232,25,26,0.6); margin-top: 2px;
  }
  .cf-result-note {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.58rem; letter-spacing: 0.1em;
    color: #4A4A54; margin-top: 8px;
    position: relative; z-index: 1;
  }
`}</style>

<div className="cf-wrap">

  {/* HEADER */}
  <div className="cf-header">
    <div className="cf-header-slash"/>
    <span className="cf-icon">💰</span>
    <span className="cf-title">คำนวณผ่อนรถ</span>
  </div>

  <div className="cf-body">

    {/* ราคารถ */}
    <div className="cf-price-row">
      <span className="cf-price-label">ราคารถ</span>
      <span className="cf-price-val">{price.toLocaleString()} บาท</span>
    </div>

    {/* ดาวน์ SLIDER */}
    <div className="cf-control">
      <div className="cf-control-header">
        <span className="cf-control-label">เงินดาวน์</span>
        <span className="cf-control-value">{downPercent}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="50"
        value={downPercent}
        onChange={(e) => setDownPercent(Number(e.target.value))}
        className="cf-slider"
        style={{ '--pct': `${(downPercent / 50) * 100}%` } as React.CSSProperties}
      />
    </div>

    {/* ข้อมูลดาวน์/ยอดกู้ */}
    <div className="cf-down-row">
      <div className="cf-down-item">
        <div className="cf-down-label">เงินดาวน์</div>
        <div className="cf-down-val accent">{Math.round(downPayment).toLocaleString()} ฿</div>
      </div>
      <div className="cf-down-item">
        <div className="cf-down-label">ยอดกู้</div>
        <div className="cf-down-val accent">{Math.round(loan).toLocaleString()} ฿</div>
      </div>
    </div>

    {/* ระยะเวลา SELECT */}
    <div className="cf-control">
      <div className="cf-control-header">
        <span className="cf-control-label">ระยะเวลา</span>
        <span className="cf-control-value">{years} ปี · {months} งวด</span>
      </div>
      <select
        value={years}
        onChange={(e) => setYears(Number(e.target.value))}
        className="cf-select"
      >
        <option value={3}>3 ปี</option>
        <option value={4}>4 ปี</option>
        <option value={5}>5 ปี</option>
        <option value={6}>6 ปี</option>
        <option value={7}>7 ปี</option>
      </select>
    </div>

    {/* RESULT */}
    <div className="cf-result">
      <div className="cf-result-label">ผ่อนต่อเดือนโดยประมาณ</div>
      <div className="cf-result-amount">{Math.round(monthly).toLocaleString()}</div>
      <div className="cf-result-unit">บาท / เดือน</div>
      <div className="cf-result-note">* ดอกเบี้ย 4% ต่อปี · คำนวณโดยประมาณเท่านั้น</div>
    </div>

  </div>
</div>
</>
)

}