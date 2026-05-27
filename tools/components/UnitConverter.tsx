"use client";

/**
 * SEO Title: Unit Converter - Length and Weight Conversion
 * Meta Description: Convert between metric and imperial units for length and weight instantly.
 *
 * FAQ 1: Which units are supported?
 * We support Meters, Kilometers, Feet, Inches for length, and Kilograms, Pounds, Grams for weight.
 *
 * FAQ 2: How accurate is it?
 * It uses standard conversion factors with high precision.
 *
 * FAQ 3: Can I convert temperature?
 * This tool focuses on length and weight; temperature conversion will be added soon!
 */

import React, { useState } from 'react';

const units: any = {
  length: {
    meter: 1,
    kilometer: 0.001,
    centimeter: 100,
    inch: 39.3701,
    foot: 3.28084,
    yard: 1.09361,
    mile: 0.000621371
  },
  weight: {
    kilogram: 1,
    gram: 1000,
    milligram: 1000000,
    pound: 2.20462,
    ounce: 35.274
  }
};

export default function UnitConverter() {
  const [type, setType] = useState<'length' | 'weight'>('length');
  const [val, setVal] = useState(1);
  const [from, setFrom] = useState(type === 'length' ? 'meter' : 'kilogram');

  const convert = (toUnit: string) => {
    const base = val / units[type][from];
    return (base * units[type][toUnit]).toFixed(4);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-6">
        <div className="flex gap-2">
          <button onClick={() => { setType('length'); setFrom('meter'); }} className={`flex-1 py-2 rounded font-bold ${type === 'length' ? 'bg-black text-white' : 'bg-gray-100'}`}>Length</button>
          <button onClick={() => { setType('weight'); setFrom('kilogram'); }} className={`flex-1 py-2 rounded font-bold ${type === 'weight' ? 'bg-black text-white' : 'bg-gray-100'}`}>Weight</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Amount</label>
            <input type="number" value={val} onChange={(e) => setVal(parseFloat(e.target.value) || 0)} className="w-full border rounded p-2" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">From Unit</label>
            <select className="w-full border rounded p-2" value={from} onChange={(e) => setFrom(e.target.value)}>
              {Object.keys(units[type]).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <label className="text-sm font-medium">Conversions</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.keys(units[type]).map(u => (
              <div key={u} className="flex justify-between p-2 bg-gray-50 border rounded text-sm">
                <span className="capitalize">{u}</span>
                <span className="font-mono font-bold">{convert(u)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
