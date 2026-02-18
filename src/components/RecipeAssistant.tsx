
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
import { getRecipeSuggestions, RecipeSuggestion } from "@/lib/recipeAssistant";

interface RecipeAssistantProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const RecipeAssistant = ({ open, onOpenChange }: RecipeAssistantProps) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState<RecipeSuggestion | null>(null);
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] w-full max-h-[90vh] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2 shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                        <Sparkles className="h-5 w-5 text-orange-500" />
                        AI Recipe Assistant
                    </DialogTitle>
                    <DialogDescription>
                        Tell me what you're craving, what ingredients you have, or ask for a random meal!
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-2 shrink-0">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., 'I want a spicy chicken dish' or 'Surprise me!'"
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
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
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
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RecipeAssistant;
