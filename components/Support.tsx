import React from 'react';

const Support: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
         
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent mb-4">
            ပံ့ပိုးထောက်ပံ့ရန်
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            MyanCareer AI ကို ထောက်ပံ့ပေးခြင်းဖြင့် မြန်မာလူငယ်များ၏ အနာဂတ်ကို အတူဖန်တီးလိုက်ပါ။
          </p>
        </div>

        {/* QR Codes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Wave Money */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-center">
              <h2 className="text-xl font-black text-white">Wave Money</h2>
            </div>
            <div className="p-8 flex flex-col items-center">
              <div className="w-64 h-64 mb-6 bg-white rounded-xl shadow-inner flex items-center justify-center p-4">
                <img 
                  src="/wavemoney.jpg" 
                  alt="Wave Money QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-2">ဖုန်းနံပါတ်</p>
                <p className="text-lg font-bold text-slate-700">09 758 430 371</p>
              </div>
            </div>
          </div>

          {/* KPay */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-center">
              <h2 className="text-xl font-black text-white">KPay</h2>
            </div>
            <div className="p-8 flex flex-col items-center">
              <div className="w-64 h-64 mb-6 bg-white rounded-xl shadow-inner flex items-center justify-center p-4">
                <img 
                  src="/kpay.jpg" 
                  alt="KPay QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-2">ဖုန်းနံပါတ်</p>
                <p className="text-lg font-bold text-slate-700">09 446 941 632</p>
              </div>
              <div className="mt-4 w-full">
             
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200/50 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">ကျေးဇူးတင်ပါသည်!</h3>
          <p className="text-slate-600 max-w-xl mx-auto font-medium">
            သင့်ပံ့ပိုးမှုသည် MyanCareer AI ကို မြန်မာလူငယ်များအတွက် အခမဲ့ နည်းပညာပညာပေးခြင်းနှင့် အလုပ်အကိုင် လမ်းညွှန်ခြင်း ဝန်ဆောင်မှုများ ဆက်လက် ပေးနိုင်ရန် အထောက်အကူ ဖြစ်ပါသည်။
          </p>
        </div>

        {/* Developer Info */}
        <div className="mt-12 text-center">
          <h4 className="text-lg font-bold text-slate-700 mb-4">ဆောင်ရွက်သူများ</h4>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white px-6 py-3 rounded-xl shadow-md border border-slate-200">
              <span className="text-sm text-slate-600">Developed with</span>
              <span className="text-red-500 mx-1">♥</span>
              <span className="text-sm font-bold text-slate-800">by MyanCareer AI Team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;

