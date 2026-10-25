import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { RankingItem, MatchFormat, MatchGender } from '../types/cricket';
import { Award, ArrowUp, ArrowDown, Minus, Shield } from 'lucide-react';

export const RankingsPage: React.FC = () => {
  const [gender, setGender] = useState<MatchGender>('Men');
  const [category, setCategory] = useState<string>('Batting');
  const [format, setFormat] = useState<MatchFormat>('ODI');
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('2026-10-22');
  const [loading, setLoading] = useState(true);

  const categories = ['Team', 'Batting', 'Bowling', 'All-Rounders'];
  const formats: MatchFormat[] = ['ODI', 'Test', 'T20I'];

  useEffect(() => {
    async function loadRankings() {
      setLoading(true);
      try {
        const res = await api.getRankings(category, format, gender);
        setRankings(res.rankings || []);
        if (res.lastUpdated) setLastUpdated(res.lastUpdated);
      } catch (e) {
        console.error('Failed to load rankings:', e);
      } finally {
        setLoading(false);
      }
    }
    loadRankings();
  }, [gender, category, format]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-[#B8FF4D]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Official ICC Cricket Rankings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verified team and player rankings across Test, ODI, and T20I formats
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Source: <span className="text-slate-200 font-medium">International Cricket Council</span> · Updated Oct 2026
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-4 p-5 rounded-2xl bg-[#111A2E] border border-white/5">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Gender Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/60 rounded-lg border border-white/5">
            <button
              onClick={() => setGender('Men')}
              className={`px-4 py-1.5 rounded-md font-bold transition-colors ${
                gender === 'Men' ? 'bg-[#B8FF4D] text-[#080D1B] shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Men’s Rankings
            </button>
            <button
              onClick={() => setGender('Women')}
              className={`px-4 py-1.5 rounded-md font-bold transition-colors ${
                gender === 'Women' ? 'bg-[#37D5F5] text-[#080D1B] shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Women’s Rankings
            </button>
          </div>

          {/* Format Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/60 rounded-lg border border-white/5">
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-3.5 py-1.5 rounded-md font-semibold transition-colors ${
                  format === fmt ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-white/10 text-[#B8FF4D]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {gender}’s {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="rounded-2xl bg-[#111A2E] border border-white/5 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>{gender}’s {format} {category} Standings</span>
          <span className="text-slate-500 font-mono">ICC Rating Scale</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-[#B8FF4D] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading official ranking table...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-white/5 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-6 w-16">Rank</th>
                  <th className="py-3 px-4">Player / Team</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4 text-center">Movement</th>
                  <th className="py-3 px-6 text-right">Rating Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {rankings.map((item) => (
                  <tr key={item.name} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-base text-white tabular-nums">
                      {item.rank}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white text-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg select-none">{item.flagUrl || '🏏'}</span>
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{item.country}</td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {item.change > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
                          <ArrowUp className="w-3 h-3" />
                          <span>+{item.change}</span>
                        </span>
                      ) : item.change < 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-red-400 font-bold">
                          <ArrowDown className="w-3 h-3" />
                          <span>{item.change}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 inline-flex items-center">
                          <Minus className="w-3 h-3" />
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono font-bold text-white text-sm tabular-nums">
                      {item.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
