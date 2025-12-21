"use client";

export default function StarfieldBackground() {
  return (
    <div className="fixed inset-0 z-2 overflow-hidden">
      {/* 星星 */}
      {Array.from({ length: 35 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-30 animate-star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() + 1}px`,
            height: `${Math.random() + 1}px`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* 流星 */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`meteor-${i}`}
          className="shooting-star absolute transform-gpu"
          style={{
            width: `${50 + Math.random() * 100}px`,
            height: `${1 + Math.random()}px`,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 100}%`,
            animation: `shooting-star 5s ease-out ${
              Math.random() * 6
            }s infinite`,
          }}
        />
      ))}
    </div>
  );
}
