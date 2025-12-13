import { motion, useReducedMotion } from "framer-motion";

export default function PageTransition({ children }) {
  const reduce = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 10, filter: reduce ? "none" : "blur(2px)" },
    show:   { opacity: 1, y: 0, filter: "blur(0px)" },
    exit:   { opacity: 0, y: reduce ? 0 : -6, filter: reduce ? "none" : "blur(2px)" },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="show"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
}
