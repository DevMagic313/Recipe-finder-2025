import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import RecipeCard from "@/components/RecipeCard";
import { Search, ChefHat, Sparkles } from "lucide-react";
import { getRandomMeal, getCategories, type Meal, type Category } from "@/api/mealdb";
import heroImage from "@/assets/hero-food.jpg";
import { motion, Variants } from "framer-motion";

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const heroVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.8 }
  }
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredRecipe, setFeaturedRecipe] = useState<Meal | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [randomMeal, categoriesData] = await Promise.all([
          getRandomMeal(),
          getCategories()
        ]);
        
        setFeaturedRecipe(randomMeal);
        setCategories(categoriesData.slice(0, 8)); // Show first 8 categories
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/recipes?category=${encodeURIComponent(category)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        
        <motion.div 
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ChefHat className="h-12 w-12 text-primary" />
            <Sparkles className="h-8 w-8 text-golden animate-pulse" />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Discover Amazing
            <span className="block bg-gradient-to-r from-primary to-golden bg-clip-text text-transparent">
              Recipes
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            From quick weeknight dinners to special occasion treats, find your next favorite dish from our collection of delicious recipes.
          </motion.p>

          {/* Hero Search */}
          <motion.form 
            onSubmit={handleSearch} 
            className="max-w-md mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-300 focus:border-primary"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90"
              >
                Search
              </Button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-3 relative overflow-hidden group">
              <Link to="/recipes">
                <span>Explore All Recipes</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-white/30 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Categories Section */}
      <motion.section 
        className="py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-4xl font-bold mb-4 text-foreground">Browse by Category</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse collection of recipes organized by cuisine type and meal category.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.idCategory}
                variants={itemVariants}
                custom={index}
              >
                <Card 
                  className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2 bg-card border-border"
                  onClick={() => handleCategoryClick(category.strCategory)}
                >
                <div className="relative overflow-hidden">
                  <img
                    src={category.strCategoryThumb}
                    alt={category.strCategory}
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
                    {category.strCategory}
                  </h3>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Recipe Section */}
      {featuredRecipe && (
        <motion.section 
          className="py-20 px-4 bg-secondary/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4 text-foreground">Recipe of the Day</h2>
              <p className="text-xl text-muted-foreground">
                Try something new with our daily featured recipe!
              </p>
            </motion.div>

            <motion.div 
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <RecipeCard recipe={featuredRecipe} />
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Home;