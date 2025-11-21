"use client"

export default function CoinCircles() {
  const coins = [
    { color: "bg-primary", size: "w-12 h-12", label: "BONO", shadow: "glow-neon" },
    { color: "bg-secondary", size: "w-16 h-16", label: "PINK", shadow: "glow-pink" },
    { color: "bg-secondary", size: "w-14 h-14", label: "GOLD", shadow: "glow-yellow" },
  ]

  return (
    <div className="relative h-40 mb-8 flex items-center justify-center">
      <div className="absolute w-48 h-40 flex items-center justify-center gap-4">
        {coins.map((coin, i) => (
          <div
            key={i}
            className={`${coin.size} ${coin.color} rounded-full ${coin.shadow} shadow-2xl flex items-center justify-center text-xs font-bold text-background cursor-pointer hover:scale-125 transition-all duration-300 transform hover:shadow-none border-2 border-background/20`}
          >
            {coin.label.charAt(0)}
          </div>
        ))}
      </div>
    </div>
  )
}
