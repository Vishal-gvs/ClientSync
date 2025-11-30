import { useState, useRef } from "react";

const StarBorder = ({
  as: Component = "div",
  className = "",
  lightColor = "#38bdf8",
  darkColor = "#facc15",
  thickness = 2,
  dark = false,
  children,
}) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  const color = dark ? darkColor : lightColor;

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative rounded-3xl transition-all duration-300 hover:scale-[1.01] ${className}`}
    >
      {/* BORDER ONLY GLOW */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          padding: `${thickness}px`,
          background: `
            radial-gradient(
              circle at ${pos.x}% ${pos.y}%,
              ${color} 0%,
              transparent 70%
            )
          `,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          filter: "blur(12px)",
        }}
      ></div>

      {/* CONTENT */}
      <div className="relative z-10 rounded-[20px] bg-white/10 dark:bg-black/40 backdrop-blur p-6 border border-white/20 dark:border-white/10">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
