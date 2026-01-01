import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Software Developer', value: 85, color: '#2563eb' },
  { name: 'Digital Marketer', value: 70, color: '#3b82f6' },
  { name: 'Graphic Designer', value: 65, color: '#60a5fa' },
  { name: 'UI/UX Designer', value: 75, color: '#93c5fd' },
  { name: 'Content Creator', value: 80, color: '#bfdbfe' },
];

const TrendChart: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-br from-white via-white to-blue-50/30 p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl shadow-xl border border-white/60 backdrop-blur-sm animate-fade-in">
      <div className="mb-8 md:mb-10 text-center md:text-left">
        <div className="inline-block md:block">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">လက်ရှိ အလုပ်အကိုင် ဈေးကွက် လိုအပ်ချက်</h3>
          <p className="text-sm text-slate-600 max-w-2xl font-medium">မြန်မာနိုင်ငံရှိ နည်းပညာနှင့် ဖန်တီးမှု နယ်ပယ်များ၏ ၂၀၂၅ ခုနှစ်အတွင်း ဝယ်လိုအား ခန့်မှန်းချက်</p>
        </div>
      </div>

      <div className="h-[250px] md:h-[320px] lg:h-[380px] w-full mb-8 md:mb-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              width={100}
            />
            <Tooltip
              cursor={{ fill: '#f0f9ff', radius: 8 }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#ffffff', padding: '12px 16px' }}
            />
            <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group p-5 md:p-6 bg-gradient-to-br from-green-50 to-green-50/50 rounded-2xl border border-green-200/60 shadow-md hover:shadow-lg transition-all duration-300 hover:border-green-300 cursor-default">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5 flex-shrink-0"></div>
            <p className="text-[10px] text-green-700 font-black uppercase tracking-wider">တိုးတက်မှု အမြန်ဆုံး</p>
          </div>
          <p className="text-base md:text-lg font-black text-green-900">Content Creator</p>
        </div>

        <div className="group p-5 md:p-6 bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl border border-blue-200/60 shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-300 cursor-default">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
            <p className="text-[10px] text-blue-700 font-black uppercase tracking-wider">ဝင်ငွေ အကောင်းဆုံး</p>
          </div>
          <p className="text-base md:text-lg font-black text-blue-900">Software Developer</p>
        </div>

        <div className="group p-5 md:p-6 bg-gradient-to-br from-purple-50 to-purple-50/50 rounded-2xl border border-purple-200/60 shadow-md hover:shadow-lg transition-all duration-300 hover:border-purple-300 cursor-default">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 flex-shrink-0"></div>
            <p className="text-[10px] text-purple-700 font-black uppercase tracking-wider">စွမ်းရည် လိုအပ်ချက်</p>
          </div>
          <p className="text-base md:text-lg font-black text-purple-900">AI Basics</p>
        </div>

        <div className="group p-5 md:p-6 bg-gradient-to-br from-orange-50 to-orange-50/50 rounded-2xl border border-orange-200/60 shadow-md hover:shadow-lg transition-all duration-300 hover:border-orange-300 cursor-default">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-orange-600 mt-1.5 flex-shrink-0"></div>
            <p className="text-[10px] text-orange-700 font-black uppercase tracking-wider">အလုပ်အကိုင် ပေါများမှု</p>
          </div>
          <p className="text-base md:text-lg font-black text-orange-900">Remote Work</p>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
