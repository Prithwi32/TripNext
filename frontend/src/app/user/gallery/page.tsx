"use client";

import { motion } from "framer-motion";
import InteractiveGallery from "./components/InteractiveGallery";

export default function GalleryPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <InteractiveGallery />
    </motion.div>
  );
}
