import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Users, MapPin, Youtube, ExternalLink, ShoppingBag, Heart, Share2, Printer, Check, Plus } from "lucide-react";
import { getMealById, extractIngredients, type Meal } from "@/api/mealdb";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import ShoppingList from "@/components/ShoppingList";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const { addAllIngredients, isRecipeInShoppingList } = useShoppingList();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(false);
      
      try {
        const recipeData = await getMealById(id);
        if (recipeData) {
          setRecipe(recipeData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Recipe Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The recipe you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/recipes">Browse All Recipes</Link>
          </Button>
        </div>
      </div>
    );
  }

  const ingredients = extractIngredients(recipe);
  const instructions = recipe.strInstructions.split('\n').filter(step => step.trim());

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/recipes" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Recipes
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Header */}
            <div>
              <h1 className="text-4xl font-bold mb-4 text-foreground leading-tight">
                {recipe.strMeal}
              </h1>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-primary text-primary-foreground">
                  {recipe.strCategory}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{recipe.strArea}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>30-45 min</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>4 servings</span>
                </div>
              </div>

              {recipe.strTags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {recipe.strTags.split(',').map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Recipe Image */}
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-80 object-cover"
              />
            </div>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-foreground leading-relaxed pt-1">
                      {instruction.trim()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* YouTube Video */}
            {recipe.strYoutube && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-red-500" />
                    Video Tutorial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Watch on YouTube
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ingredients */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ingredients.map((item, index) => (
                    <div key={index} className="flex justify-between items-start gap-2">
                      <span className="text-foreground font-medium flex-1">
                        {item.ingredient}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {item.measure}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Total: {ingredients.length} ingredients
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      className="w-full relative group overflow-hidden" 
                      variant={isRecipeInShoppingList(recipe.idMeal) ? "secondary" : "default"}
                      onClick={() => {
                        addAllIngredients(recipe);
                        toast({
                          title: "Added to Shopping List",
                          description: `Ingredients from ${recipe.strMeal} have been added to your shopping list.`,
                          className: "bg-primary text-primary-foreground",
                        });
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {isRecipeInShoppingList(recipe.idMeal) ? (
                          <>
                            <Check className="h-4 w-4" />
                            Added to List
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-4 w-4" />
                            Add to Shopping List
                          </>
                        )}
                      </span>
                      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary-foreground/30 group-hover:w-full transition-all duration-300"></span>
                    </Button>
                  </motion.div>
                  
                  {isRecipeInShoppingList(recipe.idMeal) && (
                    <Button 
                      variant="link" 
                      className="mt-2 text-sm text-primary" 
                      onClick={() => setShowShoppingList(true)}
                    >
                      View Shopping List
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="p-1.5 rounded-full bg-primary/10">
                    <Plus className="h-4 w-4 text-primary" />
                  </span>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="w-full relative group overflow-hidden" 
                    variant={isFavorite ? "secondary" : "outline"}
                    onClick={() => {
                      setIsFavorite(!isFavorite);
                      toast({
                        title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
                        description: isFavorite 
                          ? `${recipe.strMeal} has been removed from your favorites.`
                          : `${recipe.strMeal} has been added to your favorites.`,
                        className: "bg-primary text-primary-foreground",
                      });
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary" : ""}`} />
                      {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
                    </span>
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary/30 group-hover:w-full transition-all duration-300"></span>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="w-full relative group overflow-hidden" 
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link Copied!",
                        description: "Recipe link has been copied to clipboard.",
                        className: "bg-primary text-primary-foreground",
                      });
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Share Recipe
                    </span>
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary/30 group-hover:w-full transition-all duration-300"></span>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="w-full relative group overflow-hidden" 
                    variant="outline"
                    onClick={() => window.print()}
                  >
                    <span className="flex items-center gap-2">
                      <Printer className="h-4 w-4" />
                      Print Recipe
                    </span>
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary/30 group-hover:w-full transition-all duration-300"></span>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="w-full relative group overflow-hidden" 
                    variant="outline"
                    onClick={() => setShowShoppingList(true)}
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      View Shopping List
                    </span>
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary/30 group-hover:w-full transition-all duration-300"></span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Shopping List Modal */}
      {showShoppingList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-md"
          >
            <ShoppingList onClose={() => setShowShoppingList(false)} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;