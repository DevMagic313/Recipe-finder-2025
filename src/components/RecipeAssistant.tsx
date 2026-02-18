
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
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                        <Sparkles className="h-5 w-5 text-orange-500" />
                        AI Recipe Assistant
                    </DialogTitle>
                    <DialogDescription>
                        Tell me what you're craving, what ingredients you have, or ask for a random meal!
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSearch} className="flex gap-2 my-4">
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

                <ScrollArea className="flex-1 pr-4 -mr-4">
                    {error && (
                        <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    )}

                    {suggestion && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                <img
                                    src={suggestion.image}
                                    alt={suggestion.recipeName}
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-white">
                                    <h3 className="text-xl font-bold">{suggestion.recipeName}</h3>
                                    <div className="flex gap-2 text-sm text-gray-200">
                                        <span>{suggestion.category}</span>
                                        <span>•</span>
                                        <span>{suggestion.area}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        Ingredients
                                    </h4>
                                    <ul className="space-y-2 text-sm">
                                        {suggestion.ingredients.map((ing, idx) => (
                                            <li key={idx} className="flex justify-between border-b border-gray-100 pb-1">
                                                <span>{ing.name}</span>
                                                <span className="text-gray-500 font-medium">{ing.amount}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3">Instructions</h4>
                                    <ol className="space-y-4 text-sm max-h-[300px] overflow-y-auto pr-2">
                                        {suggestion.instructions.map((step, idx) => (
                                            <li key={idx} className="flex gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-gray-600 leading-relaxed">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>

                            {suggestion.videoLink && (
                                <div className="pt-4 border-t">
                                    <Button variant="outline" className="w-full gap-2" asChild>
                                        <a href={suggestion.videoLink} target="_blank" rel="noopener noreferrer">
                                            <Youtube className="h-4 w-4 text-red-600" />
                                            Watch Tutorial on YouTube
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default RecipeAssistant;
