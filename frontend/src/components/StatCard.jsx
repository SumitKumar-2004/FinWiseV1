import React from "react";

function StatCard({ icon: Icon, title, value, subtitle, bgColor, iconColor }) {
  return (
    <div
      className={`text-white rounded-2xl p-6 ${bgColor} relative overflow-hidden group cursor-pointer transition-all hover:scale-105 backdrop-blur-xl bg-opacity-10 border border-white/10 shadow-2xl hover:shadow-3xl hover:bg-opacity-20`}
    >
      {/* Glossmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>

      <div
        className={`inline-flex p-3 ${iconColor} rounded-xl mb-4 group-hover:rotate-12 transition-all duration-300 relative z-10 backdrop-blur-sm bg-opacity-20 border border-white/10`}
      >
        <Icon className="w-6 h-6" strokeWidth={2.5} />
      </div>
      <div className="relative z-10">
        <h3 className="text-3xl lg:text-4xl font-bold mb-1">{value}</h3>
        <p className="text-sm opacity-90 font-medium">{title}</p>
        {/* condtional rendering */}

        {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export default StatCard;
