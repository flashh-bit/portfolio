"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoItemProps {
    className?: string;
    children: ReactNode;
}

export const BentoItem = ({ className, children }: BentoItemProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
                "bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden relative",
                "transition-transform duration-300",
                // Desktop hover effect (lg+)
                "lg:hover:scale-[1.02]",
                className
            )}
        >
            {children}
        </motion.div>
    );
};
