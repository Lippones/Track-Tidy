'use client'

import { motion } from 'motion/react'

export default function StartLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] items-center min-h-svh overflow-hidden px-4 py-8 gap-4">
      <motion.div
        className="max-lg:max-w-2xl mx-auto"
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        exit={{
          opacity: 0,
          y: -20
        }}
      >
        {children}
      </motion.div>
      <div className="bg-secondary w-full h-full rounded-lg p-4 max-lg:hidden"></div>
    </div>
  )
}
