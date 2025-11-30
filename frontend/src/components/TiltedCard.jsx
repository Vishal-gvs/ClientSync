import { useRef } from "react";
import { motion, useSpring } from "motion/react";
import { useTheme } from "../theme/ThemeProvider.jsx";

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  title,
  description,
  rotateAmplitude = 14,
  scaleOnHover = 1.1,
  height = "260px",
  width = "100%",
  padding = "1.5rem",
}) {
  const ref = useRef(null);
  const { dark } = useTheme();

  const rotateX = useSpring(0, springValues);
  const rotateY = useSpring(0, springValues);
  const scale = useSpring(1, springValues);

  function handleMouse(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
  }

  function handleEnter() {
    scale.set(scaleOnHover);
  }

  function handleLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        height,
        width,
        padding,
        perspective: "800px",
      }}
      className={`
        rounded-2xl relative
        transition-all duration-300
        bg-slate-100/60 border border-slate-300/40 shadow
        dark:bg-white/5 dark:border-white/10

        /* Hover glow */
        hover:shadow-[0_0_18px_rgba(99,102,241,0.45)]
        dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]
      `}
    >
      <motion.div
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
          scale,
        }}
      >
        {/* Accept either plain strings or JSX elements */}
        {typeof title === "string" ? (
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
            {title}
          </h3>
        ) : (
          title
        )}

        {typeof description === "string" ? (
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {description}
          </p>
        ) : (
          description
        )}
      </motion.div>
    </div>
  );
}
