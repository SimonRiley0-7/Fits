import { motion } from "framer-motion";

export function EmptyState({ emoji = "📭", title, description, action }: {
  emoji?: string; title: string; description: string; action?: React.ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center">
      <motion.div animate={{ rotate: [0,-5,5,-3,3,0] }} transition={{ duration: 0.6, delay: 0.3 }}
        className="text-5xl mb-5">{emoji}
      </motion.div>
      <h3 className="t-h3 mb-2">{title}</h3>
      <p className="t-small max-w-xs mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
