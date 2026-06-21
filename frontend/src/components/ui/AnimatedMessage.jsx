"use client"

import { motion } from "framer-motion"
import { fadeIn } from "../../lib/animations"

export default function AnimatedMessage({ message, index = 0 }) {
  return (
    <motion.div
      {...fadeIn}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className="p-3 rounded-lg bg-gray-800/50"
    >
      {message}
    </motion.div>
  )
}
