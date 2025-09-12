import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Meal } from "@/api/mealdb";
import { Clock, MapPin, ChefHat, ShoppingBag } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { useToast } from "@/hooks/use-toast";

// Animation variants
const cardVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  hover: { y: -8, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

const imageVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } }
};

const buttonVariants: Variants = {
  initial: { x: 0 },
  hover: { x: 5, transition: { repeat: Infinity, repeatType: "reverse", duration: 0.6 } }
};

interface RecipeCardProps {
  recipe: Meal;
  className?: string;
}

const RecipeCard = ({ recipe, className = "" }: RecipeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addIngredientsByRecipeId, isRecipeInShoppingList } = useShoppingList();
  const { toast } = useToast();
  
  const handleAddToShoppingList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addIngredientsByRecipeId(recipe.idMeal);
    toast({
      title: "Added to Shopping List",
      description: `Ingredients from ${recipe.strMeal} have been added to your shopping list.`,
      className: "bg-primary text-primary-foreground",
    });
  };
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
    >
      <Card className="overflow-hidden h-full flex flex-col border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative overflow-hidden">
          <motion.div
            variants={imageVariants}
            className="w-full h-52"
          >
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
          
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-sm py-1 px-3 rounded-full shadow-sm">
              {recipe.strCategory}
            </Badge>
          </motion.div>
          
          {/* Shopping bag icon */}
          <motion.div 
            className="absolute top-3 right-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              size="icon" 
              variant={isRecipeInShoppingList?.(recipe.idMeal) ? "secondary" : "outline"}
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-primary hover:text-white shadow-sm"
              onClick={handleAddToShoppingList}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-card-foreground tracking-tight">
            {recipe.strMeal}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-full bg-primary/10">
                <MapPin className="h-3.5 w-3.5 text-primary" />
              </div>
              <span>{recipe.strArea}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Clock className="h-3.5 w-3.5 text-primary" />
              </div>
              <span>30 min</span>
            </div>
          </div>

          {recipe.strTags && (
            <div className="flex flex-wrap gap-1">
              {recipe.strTags.split(',').slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <motion.div
            className="w-full"
          >
            <Button 
              asChild 
              className="w-full relative overflow-hidden group"
              variant="default"
            >
              <Link to={`/recipe/${recipe.idMeal}`} className="flex items-center justify-center gap-2">
                <ChefHat className="h-4 w-4" />
                <span>View Recipe</span>
                <motion.span
                  variants={buttonVariants}
                  className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary-foreground/30 group-hover:w-full transition-all duration-300"
                ></motion.span>
              </Link>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RecipeCard;