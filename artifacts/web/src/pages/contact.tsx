import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, MapPin, Phone } from "lucide-react";
import { useSubmitContact } from "@/hooks/use-contact";
import { ButtonPremium } from "@/components/ui/button-premium";

// Form Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { mutate: submitContact, isPending, isSuccess, isError, error } = useSubmitContact();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    submitContact(data, {
      onSuccess: () => {
        reset();
      }
    });
  };

  return (
    <div className="min-h-[80vh] py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Get <span className="text-primary">Early Access.</span></h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Interested in Premium? Have a question about our picks or methodology? Drop us a message and we'll get back to you fast.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-10"
        >
          <div className="glass-panel p-8 rounded-2xl">
            <h3 className="text-2xl font-display font-bold text-white mb-8">Reach Us Directly</h3>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mr-6 shrink-0 text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Email</p>
                  <p className="text-lg text-white font-medium">hello@edgewield.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mr-6 shrink-0 text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Headquarters</p>
                  <p className="text-lg text-white font-medium">100 Edge Nexus<br />Silicon Valley, CA 94025</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mr-6 shrink-0 text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Phone</p>
                  <p className="text-lg text-white font-medium">+1 (800) EDGE-WLD</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="glass-panel p-8 md:p-10 rounded-2xl relative overflow-hidden">
            {/* Subtle glow behind form */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            
            {isSuccess ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/30 mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white font-display">Transmission Received</h3>
                <p className="text-muted-foreground">Our team will process your request and respond shortly.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 text-primary hover:underline text-sm font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                
                {isError && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                    {error?.message || "An error occurred during transmission."}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className={`w-full bg-background border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.name ? 'border-destructive' : 'border-white/10 hover:border-white/20'}`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={`w-full bg-background border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.email ? 'border-destructive' : 'border-white/10 hover:border-white/20'}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-300">Your Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message")}
                    className={`w-full bg-background border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none ${errors.message ? 'border-destructive' : 'border-white/10 hover:border-white/20'}`}
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
                </div>

                <ButtonPremium type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Transmitting..." : "Send Message"}
                </ButtonPremium>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
