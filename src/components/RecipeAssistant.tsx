
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Sparkles, Youtube } from "lucide-react";
import { getRecipeSuggestions, RecipeSuggestion, MealPlan } from "@/lib/recipeAssistant";

interface RecipeAssistantProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const RecipeAssistant = ({ open, onOpenChange }: RecipeAssistantProps) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState<RecipeSuggestion | MealPlan | null>(null);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError("");
        setSuggestion(null);

        try {
            const result = await getRecipeSuggestions(query);
            if (result) {
                setSuggestion(result);
            } else {
                setError("I couldn't find a matching recipe. Try asking for something else!");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isMealPlan = (data: any): data is MealPlan => {
        return data && 'mealPlan' in data;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] w-full max-h-[90vh] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2 shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                        <Sparkles className="h-5 w-5 text-orange-500" />
                        AI Recipe Assistant
                    </DialogTitle>
                    <DialogDescription>
                        Tell me what you're craving, what ingredients you have, or ask for a meal plan!
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-2 shrink-0">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., 'Spicy chicken', 'Keto meal plan', or 'Surprise me!'"
                            className="flex-1"
                            disabled={loading}
                        />
                        <Button type="submit" disabled={loading || !query.trim()} className="bg-orange-500 hover:bg-orange-600">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask AI"}
                        </Button>
                    </form>
                </div>

                <div className="flex-1 min-h-0 relative">
                    <ScrollArea className="h-full w-full">
                        <div className="p-6 pt-0 pb-6">
                            {error && (
                                <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            {suggestion && (
                                <div className="animate-in fade-in zoom-in-95 duration-300">
                                    {isMealPlan(suggestion) ? (
                                        // MEAL PLAN VIEW
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                                🗓️ Your Weekly Meal Plan
                                            </h3>

                                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {suggestion.mealPlan.map((day, idx) => (
                                                    <div key={idx} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h4 className="font-bold text-lg text-orange-600">{day.day}</h4>
                                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{day.calories} kcal</span>
                                                        </div>
                                                        <div className="space-y-2 text-sm">
                                                            <div>
                                                                <span className="text-gray-500 text-xs uppercase font-semibold">Breakfast</span>
                                                                <p className="font-medium text-gray-800">{day.breakfast}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500 text-xs uppercase font-semibold">Lunch</span>
                                                                <p className="font-medium text-gray-800">{day.lunch}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500 text-xs uppercase font-semibold">Dinner</span>
                                                                <p className="font-medium text-gray-800">{day.dinner}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {suggestion.shoppingList && suggestion.shoppingList.length > 0 && (
                                                <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-800">
                                                        🛒 Shopping List
                                                    </h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                        {suggestion.shoppingList.map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                                {item}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        // SINGLE RECIPE VIEW
                                        <div className="space-y-6">
                                            <div className="relative aspect-video w-full max-h-[300px] overflow-hidden rounded-lg bg-gray-100">
                                                <img
                                                    src={suggestion.image}
                                                    alt={suggestion.recipeName}
                                                    className="object-cover w-full h-full"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 text-white">
                                                    <h3 className="text-2xl font-bold text-shadow-sm">{suggestion.recipeName}</h3>
                                                    <div className="flex gap-2 text-sm text-gray-200 mt-1">
                                                        <span className="bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">{suggestion.category}</span>
                                                        <span className="bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">{suggestion.area}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Nutrition Summary (Existing Code) */}
                                            {(suggestion.calories || suggestion.dietaryInfo || suggestion.allergens) && (
                                                <div className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
                                                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                                        <span className="text-lg">🥗</span> Health & Nutrition
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {suggestion.calories && (
                                                            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-medium border border-orange-100">
                                                                <span>🔥</span>
                                                                <span>{suggestion.calories} kcal</span>
                                                            </div>
                                                        )}
                                                        {suggestion.dietaryInfo?.vegan && (
                                                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-100">
                                                                🌱 Vegan
                                                            </span>
                                                        )}
                                                        {suggestion.dietaryInfo?.keto && (
                                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                                                                🥩 Keto
                                                            </span>
                                                        )}
                                                        {suggestion.dietaryInfo?.glutenFree && (
                                                            <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium border border-amber-100">
                                                                🌾 Gluten-Free
                                                            </span>
                                                        )}
                                                        {suggestion.dietaryInfo?.dairyFree && (
                                                            <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium border border-cyan-100">
                                                                🥛 Dairy-Free
                                                            </span>
                                                        )}
                                                    </div>

                                                    {suggestion.allergens && suggestion.allergens.length > 0 && (
                                                        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 mt-2">
                                                            <span className="font-bold shrink-0">⚠️ Allergens:</span>
                                                            <span>{suggestion.allergens.join(", ")}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-orange-800">
                                                        Ingredients
                                                    </h4>
                                                    <ul className="space-y-3 text-sm">
                                                        {suggestion.ingredients.map((ing, idx) => (
                                                            <li key={idx} className="flex justify-between items-center border-b border-orange-100 pb-2 last:border-0">
                                                                <span className="font-medium text-gray-700">{ing.name}</span>
                                                                <span className="text-orange-600 font-bold bg-white px-2 py-1 rounded-md shadow-sm text-xs">{ing.amount}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
                                                        Instructions
                                                    </h4>
                                                    <ol className="space-y-6 text-sm">
                                                        {suggestion.instructions.map((step, idx) => (
                                                            <li key={idx} className="flex gap-4 group">
                                                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold border-2 border-orange-200 group-hover:border-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                                                    {idx + 1}
                                                                </span>
                                                                <p className="text-gray-600 leading-relaxed pt-1">{step}</p>
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            </div>

                                            {/* Tips & Substitutions (Existing Code) */}
                                            {(suggestion.substitutions?.length > 0 || suggestion.tips?.length > 0) && (
                                                <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                                                    {suggestion.substitutions && suggestion.substitutions.length > 0 && (
                                                        <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                                                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-800">
                                                                🌿 Healthy Substitutions
                                                            </h4>
                                                            <ul className="space-y-3 text-sm">
                                                                {suggestion.substitutions.map((sub, idx) => (
                                                                    <li key={idx} className="flex flex-col border-b border-green-100 pb-2 last:border-0">
                                                                        <span className="text-gray-500 text-xs">Instead of {sub.ingredient}:</span>
                                                                        <span className="font-medium text-green-700">{sub.alternative}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {suggestion.tips && suggestion.tips.length > 0 && (
                                                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800">
                                                                💡 Chef's Pro Tips
                                                            </h4>
                                                            <ul className="space-y-3 text-sm">
                                                                {suggestion.tips.map((tip, idx) => (
                                                                    <li key={idx} className="flex gap-3 items-start">
                                                                        <span className="text-blue-500 mt-1">•</span>
                                                                        <span className="text-gray-700 leading-relaxed">{tip}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {suggestion.videoLink && (
                                                <div className="pt-6 border-t mt-4">
                                                    <Button variant="outline" className="w-full gap-2 h-12 text-lg font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200" asChild>
                                                        <a href={suggestion.videoLink} target="_blank" rel="noopener noreferrer">
                                                            <Youtube className="h-5 w-5 text-red-600" />
                                                            Watch Tutorial on YouTube
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RecipeAssistant;
