"use client"

export function AnimatedLogo() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {/* Sun with rotating rays */}
      <div className="absolute">
        <div className="relative">
          {/* Sun rays */}
          <div className="absolute inset-0 animate-spin-slow">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-4 bg-yellow-400 rounded-full"
                style={{
                  top: "-8px",
                  left: "50%",
                  transformOrigin: "50% 24px",
                  transform: `translateX(-50%) rotate(${i * 45}deg)`,
                }}
              />
            ))}
          </div>
          {/* Sun circle */}
          <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600 animate-pulse" />
        </div>
      </div>

      {/* Floating cloud */}
      <div className="absolute left-2 top-2 animate-float">
        <div className="relative">
          {/* Cloud shape */}
          <div className="w-12 h-6 bg-blue-400 rounded-full border-2 border-blue-600" />
          <div className="absolute -top-2 left-2 w-6 h-6 bg-blue-400 rounded-full border-2 border-blue-600" />
          <div className="absolute -top-1 left-6 w-4 h-4 bg-blue-400 rounded-full border-2 border-blue-600" />
        </div>
      </div>

      {/* Animated raindrops */}
      <div className="absolute top-12 left-4">
        <div className="w-1 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
      </div>
      <div className="absolute top-12 left-6">
        <div className="w-1 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
      </div>
      <div className="absolute top-12 left-8">
        <div className="w-1 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  )
}
