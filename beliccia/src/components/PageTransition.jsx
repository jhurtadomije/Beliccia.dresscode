import { motion, useReducedMotion } from "framer-motion";

export default function PageTransition({ children }) {
  const reduce = useReducedMotion();

  const variants = {
    hidden: {
      opacity: 0,
      y: reduce ? 0 : 30,
      filter: reduce ? "none" : "blur(8px)",
    },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: {
      opacity: 0,
      y: reduce ? 0 : -20,
      filter: reduce ? "none" : "blur(8px)",
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="show"
      exit="exit"
      transition={{
        duration: 1.3,               
        ease: [0.22, 1, 0.36, 1],    
      }}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
}
