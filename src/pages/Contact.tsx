import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Clock, MessageSquare, ChefHat, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, Variants, Easing } from "framer-motion";
import { cn } from "@/lib/utils";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as Easing
    }
  }
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      
      // Show toast notification
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon!",
        className: "bg-primary text-primary-foreground",
      });
      
      // Reset form after showing success state
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setFormSubmitted(false);
      }, 3000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };
  
  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24">
          <h1 className="text-6xl font-bold mb-8 text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-primary to-spice bg-clip-text text-transparent">Get in Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Have a question, suggestion, or just want to say hello? We'd love to hear from you! 
            Drop us a message and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <span>Send us a Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle2 className="h-16 w-16 text-primary mb-6" />
                    <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Your message has been sent successfully. We'll get back to you as soon as possible.
                    </p>
                  </motion.div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 relative">
                        <Label 
                          htmlFor="name"
                          className={cn(
                            "transition-all duration-200",
                            focusedField === "name" ? "text-primary" : "text-foreground"
                          )}
                        >
                          Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => handleFocus("name")}
                          onBlur={handleBlur}
                          placeholder="Your full name"
                          className={cn(
                            "bg-secondary/50 transition-all duration-300 border-border/50",
                            focusedField === "name" ? "border-primary ring-1 ring-primary/20" : ""
                          )}
                        />
                        <motion.div 
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: focusedField === "name" ? 1 : 0 }}
                          className="h-0.5 bg-primary origin-left absolute -bottom-0.5 left-0 right-0"
                        />
                      </div>
                      <div className="space-y-2 relative">
                        <Label 
                          htmlFor="email"
                          className={cn(
                            "transition-all duration-200",
                            focusedField === "email" ? "text-primary" : "text-foreground"
                          )}
                        >
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => handleFocus("email")}
                          onBlur={handleBlur}
                          placeholder="your.email@example.com"
                          className={cn(
                            "bg-secondary/50 transition-all duration-300 border-border/50",
                            focusedField === "email" ? "border-primary ring-1 ring-primary/20" : ""
                          )}
                        />
                        <motion.div 
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: focusedField === "email" ? 1 : 0 }}
                          className="h-0.5 bg-primary origin-left absolute -bottom-0.5 left-0 right-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 relative">
                      <Label 
                        htmlFor="subject"
                        className={cn(
                          "transition-all duration-200",
                          focusedField === "subject" ? "text-primary" : "text-foreground"
                        )}
                      >
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => handleFocus("subject")}
                        onBlur={handleBlur}
                        placeholder="What's this about?"
                        className={cn(
                          "bg-secondary/50 transition-all duration-300 border-border/50",
                          focusedField === "subject" ? "border-primary ring-1 ring-primary/20" : ""
                        )}
                      />
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: focusedField === "subject" ? 1 : 0 }}
                        className="h-0.5 bg-primary origin-left absolute -bottom-0.5 left-0 right-0"
                      />
                    </div>

                    <div className="space-y-2 relative">
                      <Label 
                        htmlFor="message"
                        className={cn(
                          "transition-all duration-200",
                          focusedField === "message" ? "text-primary" : "text-foreground"
                        )}
                      >
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => handleFocus("message")}
                        onBlur={handleBlur}
                        placeholder="Tell us more details..."
                        rows={6}
                        className={cn(
                          "bg-secondary/50 resize-none transition-all duration-300 border-border/50",
                          focusedField === "message" ? "border-primary ring-1 ring-primary/20" : ""
                        )}
                      />
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: focusedField === "message" ? 1 : 0 }}
                        className="h-0.5 bg-primary origin-left absolute -bottom-0.5 left-0 right-0"
                      />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="pt-2"
                    >
                      <Button 
                        type="submit" 
                        className="w-full py-6 text-base relative overflow-hidden group" 
                        disabled={isSubmitting}
                      >
                        <span className={cn(
                          "flex items-center justify-center gap-2 transition-all duration-300",
                          isSubmitting ? "opacity-0" : "opacity-100"
                        )}>
                          <Mail className="h-5 w-5" />
                          Send Message
                        </span>
                        {isSubmitting && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </span>
                        )}
                        <span className="absolute bottom-0 left-0 h-1 w-0 bg-primary-foreground/30 group-hover:w-full transition-all duration-300"></span>
                      </Button>
                    </motion.div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-background to-secondary/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <a href="mailto:hello@recipefinder.com" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                        hello@recipefinder.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <a href="tel:+15551234567" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Address</p>
                      <p className="text-muted-foreground">
                        123 Recipe Street<br />
                        Food City, FC 12345<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Business Hours</p>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-background to-secondary/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <span>Quick Questions?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Looking for answers to common questions? Check out our FAQ section for quick help.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                      View FAQ
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-background to-secondary/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <ChefHat className="h-4 w-4 text-primary" />
                    </div>
                    <span>Recipe Suggestions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Have a recipe you'd like to see added? We'd love to hear your suggestions!
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                      Suggest a Recipe
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;