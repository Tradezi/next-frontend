'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ReactNode, useState, useEffect, useRef } from 'react';

// Animation variants
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2
    }
  }
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
};

export const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15
    }
  }
};

export const scrollIndicatorVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      delay: 1.0
    }
  }
};

// Motion components
export function MotionLogo({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={logoVariants}
    >
      {children}
    </motion.div>
  );
}

export function MotionContainer({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

export function MotionFormContainer({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.2,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
}

export function MotionHeading({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export function MotionForm({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

export function MotionText({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {children}
    </motion.p>
  );
}

export function MotionScrollIndicator({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set a timeout to hide the component after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    // Clean up the timer when component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={scrollIndicatorVariants}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MotionScrollToSection({
  children,
  className,
  id,
  threshold = 0.1,
  skipFirstScroll = false
}: {
  children: ReactNode;
  className?: string;
  id: string;
  threshold?: number;
  skipFirstScroll?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    amount: threshold,
    initial: false
  });
  // Add a ref to track if this is the first time the component is in view
  const isFirstRender = useRef(true);
  // Add state to track window width
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Check screen size on mount and when window resizes
  useEffect(() => {
    // Function to check if we're on a large screen (using lg breakpoint from Tailwind - 1024px)
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Skip scrolling if on large screens
    if (isLargeScreen) return;

    if (isInView) {
      // Check if we should skip the first scroll
      if (skipFirstScroll && isFirstRender.current) {
        // Mark that we've seen the first render
        isFirstRender.current = false;
        return;
      }

      // Scroll to the section with smooth animation when it comes into view
      const element = document.getElementById(id);
      if (element) {
        // Use a small delay to make the animation feel more natural
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }

      // If this was the first render, mark it as seen
      if (isFirstRender.current) {
        isFirstRender.current = false;
      }
    }
  }, [isInView, id, skipFirstScroll, isLargeScreen]);

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      initial={{ opacity: 0.9 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.section>
  );
}

// New components for dashboard
export function MotionTableContainer({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

export function MotionEmptyState({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

export function MotionButton({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}
