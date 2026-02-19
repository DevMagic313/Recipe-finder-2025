import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Heart, Globe, Users, Instagram, Twitter, Mail } from "lucide-react";
import { motion, Variants, Easing } from "framer-motion";
import { cn } from "@/lib/utils";

// Animation variants for staggered animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
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

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    twitter?: string;
    instagram?: string;
    email?: string;
  };
}

const About = () => {
  const [activeSection, setActiveSection] = useState<string>("mission");
  const sectionRefs = {
    mission: useRef<HTMLDivElement>(null),
    story: useRef<HTMLDivElement>(null),
    features: useRef<HTMLDivElement>(null),
    team: useRef<HTMLDivElement>(null)
  };
  
  // Team members data
  const teamMembers: TeamMember[] = [
    {
      name: "Alex Johnson",
      role: "Head Chef & Founder",
      bio: "With over 15 years of culinary experience, Alex brings authentic recipes from around the world to your kitchen.",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=300&auto=format&fit=crop",
      social: {
        twitter: "#",
        instagram: "#",
        email: "alex@recipefinder.com"
      }
    },
    {
      name: "Samantha Lee",
      role: "Nutritionist",
      bio: "Samantha ensures all our recipes are balanced and nutritious without compromising on flavor.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop",
      social: {
        twitter: "#",
        instagram: "#",
        email: "samantha@recipefinder.com"
      }
    },
    {
      name: "Marcus Rivera",
      role: "Food Photographer",
      bio: "Marcus captures the beauty of each dish, making our recipes visually appealing and inspiring.",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
      social: {
        twitter: "#",
        instagram: "#",
        email: "marcus@recipefinder.com"
      }
    },
    {
      name: "Priya Patel",
      role: "Recipe Developer",
      bio: "Priya specializes in creating innovative recipes that blend traditional techniques with modern flavors.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
      social: {
        twitter: "#",
        instagram: "#",
        email: "priya@recipefinder.com"
      }
    }
  ];
  
  // Intersection observer to detect which section is in view
  useEffect(() => {
    const observers = Object.entries(sectionRefs).map(([id, ref]) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.5 }
      );
      
      if (ref.current) {
        observer.observe(ref.current);
      }
      
      return { id, observer };
    });
    
    return () => {
      observers.forEach(({ id, observer }) => {
        if (sectionRefs[id as keyof typeof sectionRefs].current) {
          observer.unobserve(sectionRefs[id as keyof typeof sectionRefs].current!);
        }
      });
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 relative">
        {/* Navigation dots */}
        <div className="hidden lg:flex fixed left-8 top-1/2 transform -translate-y-1/2 flex-col gap-6 z-10">
          {Object.entries(sectionRefs).map(([id, _]) => (
            <button
              key={id}
              onClick={() => {
                sectionRefs[id as keyof typeof sectionRefs].current?.scrollIntoView({ behavior: "smooth" });
              }}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                activeSection === id ? "bg-primary scale-125" : "bg-muted hover:bg-primary/50"
              )}
              aria-label={`Scroll to ${id} section`}
            />
          ))}
        </div>
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24">
          <div className="flex justify-center mb-6">
            <ChefHat className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-6xl font-bold mb-8 text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-primary to-spice bg-clip-text text-transparent">About</span> Recipe Finder
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Your ultimate destination for discovering, exploring, and enjoying delicious recipes from around the world. 
            We believe that great food brings people together and creates lasting memories.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          ref={sectionRefs.mission}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-32">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="border-b-2 border-primary pb-2">Our Mission</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden bg-gradient-to-br from-background to-secondary/20 border border-border/50">
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-center mb-2">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <Heart className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground text-center group-hover:text-primary transition-colors duration-300">Our Passion</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    We're passionate about making cooking accessible and enjoyable for everyone, from beginners to experienced chefs. Our carefully curated recipes inspire creativity in the kitchen.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="group md:translate-y-8">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden bg-gradient-to-br from-background to-secondary/20 border border-border/50">
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-center mb-2">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <Globe className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground text-center group-hover:text-primary transition-colors duration-300">Global Flavors</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    Explore diverse cuisines and discover authentic recipes from different cultures and traditions worldwide. Our collection spans continents to bring you the best flavors.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden bg-gradient-to-br from-background to-secondary/20 border border-border/50">
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-center mb-2">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground text-center group-hover:text-primary transition-colors duration-300">Community</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    Join a community of food lovers who share the same passion for discovering and sharing amazing recipes. Connect, learn, and grow with fellow cooking enthusiasts.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.div 
          ref={sectionRefs.story}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-32">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="border-b-2 border-primary pb-2">Our Story</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" 
                  alt="Cooking together" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary/90 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-xs">
                <p className="text-primary-foreground font-medium italic">
                  "We believe that cooking is not just about food—it's about creativity, connection, and joy."
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Recipe Finder was born from a simple idea: cooking should be fun, accessible, and inspiring. 
                We noticed that finding the perfect recipe often meant jumping between multiple websites, 
                dealing with cluttered interfaces, and struggling with unclear instructions.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                That's why we created Recipe Finder - a clean, user-friendly platform that puts the focus 
                where it belongs: on the food. Our carefully curated collection features recipes from around 
                the world, each with clear instructions, beautiful photography, and helpful tips.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're looking for a quick weeknight dinner, planning a special celebration, or 
                simply wanting to try something new, we're here to help you discover your next favorite dish. 
                Every recipe is tested and includes detailed ingredient lists and step-by-step instructions 
                to ensure your cooking success.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          ref={sectionRefs.features}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-32">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="border-b-2 border-primary pb-2">What Makes Us Different</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Easy Search & Discovery</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find exactly what you're looking for with our powerful search functionality and intuitive category browsing. Filter by ingredients, cuisine type, or dietary restrictions.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M14 4h6v6"></path>
                    <path d="M10 20H4v-6"></path>
                    <path d="m20 4-6 6"></path>
                    <path d="m4 20 6-6"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Clear Instructions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every recipe features step-by-step instructions that are easy to follow, even for beginners. Visual guides and timing tips ensure cooking success every time.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Global Cuisine</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Explore authentic recipes from different cultures and expand your culinary horizons. Learn about traditional cooking methods and ingredients from around the world.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
                    <path d="M12 18h.01"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Mobile Friendly</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access your favorite recipes anywhere, anytime with our responsive mobile design. Save recipes for offline viewing and set timers while you cook.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          ref={sectionRefs.team}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-32">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="border-b-2 border-primary pb-2">Meet Our Team</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group">
                <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex gap-4 justify-center mb-4">
                        {member.social.twitter && (
                          <a href={member.social.twitter} className="text-white hover:text-primary transition-colors">
                            <Twitter className="h-5 w-5" />
                          </a>
                        )}
                        {member.social.instagram && (
                          <a href={member.social.instagram} className="text-white hover:text-primary transition-colors">
                            <Instagram className="h-5 w-5" />
                          </a>
                        )}
                        {member.social.email && (
                          <a href={`mailto:${member.social.email}`} className="text-white hover:text-primary transition-colors">
                            <Mail className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                      <p className="text-white text-sm">{member.bio}</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-primary/10 to-spice/10 rounded-xl p-12 shadow-sm">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Ready to Start Cooking?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of home cooks who have discovered their new favorite recipes with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/recipes" 
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              Browse Recipes
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-4 border border-primary/30 rounded-md hover:bg-primary/10 transition-all duration-300 font-medium text-foreground shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;