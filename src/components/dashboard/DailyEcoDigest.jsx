import React from 'react';
import { Newspaper } from 'lucide-react';

const ECO_FACTS = [
  "BEST buses in Mumbai carry over 3 million passengers daily, saving an estimated 6,200 tonnes of CO₂ vs private vehicles.",
  "Mumbai's local train network is one of the most eco-efficient transit systems globally — just 0.014 kg CO₂ per passenger-km.",
  "India's solar power capacity crossed 70 GW in 2023 — enough to power millions of homes carbon-free.",
  "A vegetarian meal emits 50% less CO₂ than a chicken meal and 90% less than a beef meal.",
  "Switching off a ceiling fan for 2 hours/day saves ~0.06 kWh — that's 22 kWh saved per year per fan!",
  "The average Indian emits 1.9 kg CO₂ per day — nearly 3× less than the global average of 4.7 kg.",
  "Cycling instead of riding a petrol bike for 10 km saves ~0.3 kg CO₂ — one sapling's monthly carbon absorption.",
  "India's electricity grid emits 0.82 kg CO₂ per kWh — one of the higher rates globally, so saving electricity matters a lot.",
  "A reusable cotton bag needs to be used 52+ times to offset its production footprint vs a single plastic bag.",
  "Mumbai's mangroves store ~30,000 tonnes of carbon annually — they are the city's green lungs.",
  "Eating one vegan meal per day for a year can save over 200 kg of CO₂ — equal to not driving ~1,000 km.",
  "One tree absorbs approximately 21 kg of CO₂ per year — planting a tree offsets 10 days of an average Indian's emissions.",
  "Air conditioning uses 40% of a typical office building's electricity in India — turning it 1°C warmer saves 6% energy.",
  "Composting food waste prevents methane release — methane is 28× more potent a greenhouse gas than CO₂.",
  "India's electric vehicle fleet is growing by 50% year-over-year, with Mumbai among the top cities for EV adoption.",
  "A 10-minute shower uses ~60 litres of water. Cutting it to 5 minutes halves your water-heating emissions.",
  "A laptop charger uses ~0.05 kWh — 20× less energy than an air cooler running for the same time.",
  "Shared cab trips reduce per-person emissions by 50–70% compared to solo rides — always carpool when possible.",
  "Paper production is the 4th largest industrial CO₂ emitter globally. Going digital for notes helps more than you think.",
  "India generates 62 million tonnes of solid waste annually. Segregating recyclables at home diverts 30% from landfills.",
  "TCET's campus trees absorb an estimated 2–5 tonnes of CO₂ per year — every walk on campus supports them.",
  "Washing clothes in cold water uses 90% less energy than hot water, while cleaning just as effectively.",
  "One cup of tea has a footprint of ~0.2 kg CO₂ — significantly less than a glass of dairy cow's milk.",
  "Turning off all standby electronics overnight saves up to 10% of monthly electricity in a hostel room.",
  "The Mumbai-Pune expressway generates ~8,00,000 kg CO₂ daily from vehicles — one big reason local train wins.",
  "India's renewable energy target is 500 GW by 2030. Every unit of solar energy used directly helps reach that.",
  "A smartphone charged daily for a year uses just 2 kWh — less than a single washing machine load.",
  "Repairing a broken item instead of replacing it saves 50–80% of the new item's manufacturing carbon footprint.",
  "Street food from a local thela often has a lower carbon footprint than packaged food due to minimal processing and packaging.",
  "Buying second-hand clothes saves ~3.6 kg CO₂ per item — the fashion industry accounts for 10% of global emissions.",
];

export default function DailyEcoDigest() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const fact = ECO_FACTS[dayOfYear % ECO_FACTS.length];

  return (
    <div className="eco-card p-4 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200">
      <div className="flex items-center gap-2 mb-2">
        <Newspaper size={14} className="text-teal-600 flex-shrink-0" />
        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
          Daily Eco Digest
        </span>
      </div>
      <p className="text-xs text-teal-900 leading-relaxed font-medium">{fact}</p>
    </div>
  );
}
