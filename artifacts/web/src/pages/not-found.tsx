import { Link } from "wouter";
import { motion } from "framer-motion";
import { ButtonPremium } from "@/components/ui/button-premium";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-[150px] font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent leading-none select-none">
          404
        </h1>
        <div className="-mt-16 relative z-10">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Signal Lost</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            The coordinates you requested do not exist within our current architecture. It may have been relocated or deleted.
          </p>
          <Link href="/">
            <ButtonPremium>
              Return to Nexus
            </ButtonPremium>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
