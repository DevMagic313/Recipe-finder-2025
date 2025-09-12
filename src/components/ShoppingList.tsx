import { useState } from 'react';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, X, Trash2, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShoppingListProps {
  onClose?: () => void;
}

const ShoppingList = ({ onClose }: ShoppingListProps) => {
  const { items, removeIngredient, removeAllFromRecipe, toggleChecked, clearList } = useShoppingList();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Group items by recipe
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.recipeId]) {
      acc[item.recipeId] = {
        recipeName: item.recipeName,
        items: []
      };
    }
    acc[item.recipeId].items.push(item);
    return acc;
  }, {} as Record<string, { recipeName: string; items: typeof items }>);

  // Filter items based on search term
  const filteredGroups = Object.entries(groupedItems).filter(([_, group]) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      group.recipeName.toLowerCase().includes(searchLower) ||
      group.items.some(item => 
        item.ingredient.toLowerCase().includes(searchLower) ||
        item.measure.toLowerCase().includes(searchLower)
      )
    );
  });

  const totalItems = items.length;
  const checkedItems = items.filter(item => item.checked).length;

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-border/50">
      <CardHeader className="bg-primary/5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Shopping List
            <Badge variant="secondary" className="ml-2">
              {checkedItems}/{totalItems}
            </Badge>
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search ingredients or recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 max-h-[60vh] overflow-y-auto">
        {totalItems === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Your shopping list is empty</p>
            <p className="text-sm mt-1">Add ingredients from recipes to get started</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No matching ingredients found</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            <AnimatePresence>
              {filteredGroups.map(([recipeId, group]) => (
                <motion.div 
                  key={recipeId}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-secondary/10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{group.recipeName}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs"
                        onClick={() => removeAllFromRecipe(recipeId)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove All
                      </Button>
                    </div>
                  </div>
                  <ul className="py-1">
                    <AnimatePresence>
                      {group.items
                        .filter(item => {
                          if (!searchTerm) return true;
                          const searchLower = searchTerm.toLowerCase();
                          return (
                            item.ingredient.toLowerCase().includes(searchLower) ||
                            item.measure.toLowerCase().includes(searchLower)
                          );
                        })
                        .map(item => (
                          <motion.li 
                            key={item.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 py-2 flex items-center gap-3 hover:bg-secondary/5 group"
                          >
                            <Checkbox 
                              checked={item.checked} 
                              onCheckedChange={() => toggleChecked(item.id)}
                              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <div className="flex-1 flex justify-between items-center">
                              <span className={`${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                                {item.ingredient}
                              </span>
                              <span className="text-sm text-muted-foreground">{item.measure}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeIngredient(item.id)}
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>

      {totalItems > 0 && (
        <CardFooter className="flex justify-between p-4 border-t border-border/50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearList}
            className="text-sm"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="text-sm"
            onClick={() => {
              const uncheckedItems = items.filter(item => !item.checked);
              if (uncheckedItems.length === 0) {
                clearList();
              } else {
                uncheckedItems.forEach(item => toggleChecked(item.id));
              }
            }}
          >
            <Check className="h-4 w-4 mr-1" />
            {checkedItems === totalItems ? 'Clear Completed' : 'Mark All Complete'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ShoppingList;