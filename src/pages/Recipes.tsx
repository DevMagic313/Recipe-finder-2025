import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RecipeCard from "@/components/RecipeCard";
import { Search, Filter, X } from "lucide-react";
import { 
  searchMealsByName, 
  getMealsByCategory, 
  getCategories, 
  type Meal, 
  type Category 
} from "@/api/mealdb";

const Recipes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    if (search) {
      setSearchQuery(search);
      searchRecipes(search);
    } else if (category) {
      setSelectedCategory(category);
      filterByCategory(category);
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const searchRecipes = async (query: string) => {
    setLoading(true);
    try {
      const results = await searchMealsByName(query);
      setRecipes(results);
      setSelectedCategory("");
    } catch (error) {
      console.error("Error searching recipes:", error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (category: string) => {
    setLoading(true);
    try {
      const results = await getMealsByCategory(category);
      setRecipes(results);
      setSearchQuery("");
    } catch (error) {
      console.error("Error filtering recipes:", error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSearchParams({ category });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setRecipes([]);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">All Recipes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover thousands of delicious recipes from around the world. Search by name or browse by category.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-secondary/50 border-border focus:border-primary"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Filter Toggle */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Categories
            </Button>
          </div>

          {/* Categories Filter */}
          {showFilters && (
            <div className="bg-secondary/30 rounded-lg p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.idCategory}
                    variant={selectedCategory === category.strCategory ? "default" : "outline"}
                    onClick={() => handleCategoryFilter(category.strCategory)}
                    className="text-sm"
                  >
                    {category.strCategory}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(searchQuery || selectedCategory) && (
            <div className="flex flex-wrap gap-2 justify-center">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                  Search: "{searchQuery}"
                  <button onClick={clearFilters} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                  Category: {selectedCategory}
                  <button onClick={clearFilters} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Results */}
        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && recipes.length === 0 && (searchQuery || selectedCategory) && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">
              No recipes found for your search.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && !searchQuery && !selectedCategory && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">
              Use the search bar or browse by category to find delicious recipes!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;