import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Software Developer', value: 85, color: '#2563eb' },
  { name: 'Digital Marketer', value: 70, color: '#3b82f6' },
  { name: 'Graphic Designer', value: 65, color: '#60a5fa' },
  { name: 'UI/UX Designer', value: 75, color: '#93c5fd' },
  { name: 'Content Creator', value: 80, color: '#bfdbfe' },
  { name: 'Data Analyst', value: 78, color: '#1e40af' },
  { name: 'Cybersecurity Specialist', value: 82, color: '#1d4ed8' },
  { name: 'AI/ML Engineer', value: 88, color: '#1e3a8a' },
  { name: 'Mobile App Developer', value: 76, color: '#1e40af' },
  { name: 'Cloud Engineer', value: 79, color: '#1d4ed8' },
  { name: 'Civil Engineer', value: 72, color: '#dc2626' },
  { name: 'Mechanical Engineer', value: 68, color: '#ea580c' },
  { name: 'Electrical Engineer', value: 71, color: '#c2410c' },
  { name: 'Doctor', value: 90, color: '#16a34a' },
  { name: 'Nurse', value: 85, color: '#15803d' },
  { name: 'Teacher', value: 83, color: '#7c3aed' },
  { name: 'Project Manager', value: 75, color: '#be185d' },
  { name: 'HR Specialist', value: 72, color: '#ec4899' },
  { name: 'Marketing Manager', value: 76, color: '#f97316' },
  { name: 'DevOps Engineer', value: 81, color: '#0d9488' },
  { name: 'Game Developer', value: 73, color: '#14b8a6' },
  { name: 'Video Editor', value: 71, color: '#2dd4bf' },
  { name: 'Social Media Manager', value: 78, color: '#5b21b6' },
  { name: 'School Principal', value: 71, color: '#581c87' },
  { name: 'University Lecturer', value: 75, color: '#6d28d9' },
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
            <p className="text-[10px] text-green-700 font-black uppercase tracking-wider">ဝယ်လိုအား အမြင့်ဆုံး</p>
          </div>
          <p className="text-base md:text-lg font-black text-green-900">Doctor</p>
        </div>

        <div className="group p-5 md:p-6 bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl border border-blue-200/60 shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-300 cursor-default">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
            <p className="text-[10px] text-blue-700 font-black uppercase tracking-wider">နည်းပညာ အလားအလာ</p>
          </div>
          <p className="text-base md:text-lg font-black text-blue-900">AI/ML Engineer</p>
        </div>

        <div className="group p-5 md:p-6 bg-gradient-to-br from-purple-50 to-purple-50/50 rounded-2xl border border-purple-200/60 shadow-md hover:shadow-lg transition-all duration-300 hover:border-purple-300 cursor-default">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 flex-shrink-0"></div>
            <p className="text-[10px] text-purple-700 font-black uppercase tracking-wider">ပညာရေး လိုအပ်ချက်</p>
          </div>
          <p className="text-base md:text-lg font-black text-purple-900">Teacher</p>
        </div>

        <div className="group p-5 md:p-6 bg-gradient-to-br from-orange-50 to-orange-50/50 rounded-2xl border border-orange-200/60 shadow-md hover:shadow-lg transition-all duration-300 hover:border-orange-300 cursor-default">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-orange-600 mt-1.5 flex-shrink-0"></div>
            <p className="text-[10px] text-orange-700 font-black uppercase tracking-wider">အင်ဂျင်နီယာ နယ်ပယ်</p>
          </div>
          <p className="text-base md:text-lg font-black text-orange-900">Civil Engineer</p>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
