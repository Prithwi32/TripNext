"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface AnimatedIllustrationProps {
  images?: string[]
  title: string
  description: string
  animation?: "fade" | "scale" | "float"
}

export function AnimatedIllustration({
  images = ["/u.avif"],
  title,
  description,
  animation = "fade",
}: AnimatedIllustrationProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [images.length])

  const getAnimationProps = () => {
    switch (animation) {
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
          transition: { duration: 0.8 },
        }
      case "float":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.8 },
          className: "relative",
          children: (
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="relative h-[300px] w-[300px]"
            >
              <img src={images[index]} alt={title} className="h-full w-full object-contain" />
            </motion.div>
          ),
        }
      case "fade":
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: { duration: 0.8 },
        }
    }
  }

  const animationProps = getAnimationProps()

  return (
    <div className="flex h-full flex-col items-center justify-center p-12">
      <div className="relative h-[400px] w-[400px]">
        <AnimatePresence mode="wait">
          <motion.div key={index} {...animationProps} className="absolute h-full w-full">
            <img src={images[index]} alt={`${title}-${index}`} className="h-full w-full object-contain rounded-xl" />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-8 text-center"
      >
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-white/80">{description}</p>
      </motion.div>
    </div>
  )
}
