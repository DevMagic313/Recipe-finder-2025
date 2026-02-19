# 🍳 Recipe Finder Application

## Project Overview

Recipe Finder is a modern, responsive single-page application (SPA) built with **React**, **TypeScript**, and **Vite**. It allows users to discover, search, and save their favorite recipes, while also managing a shopping list for ingredients. The application leverages **TheMealDB API** to provide access to thousands of recipes from around the world.

This project demonstrates best practices in frontend development, including component-based architecture, efficient state management with Context API, and polished UI/UX using Tailwind CSS and Framer Motion animations.

## ✨ Key Features

-   **Recipe Discovery**:
    -   **Search Functionality**: Instantly search for recipes by name.
    -   **Category Browsing**: Filter recipes by categories (e.g., Beef, Vegan, Dessert).
    -   **Detailed Views**: View comprehensive recipe details including ingredients, measurements, and step-by-step instructions.
    -   **Video Integration**: Embedded YouTube tutorials for visual learners.

-   **User Utilities**:
    -   **Shopping List**: Add ingredients from any recipe directly to your shopping list. Check off items as you shop.
    -   **Favorites**: Save recipes to your personal "Favorites" list for quick access (currently session-based).
    -   **Print Friendly**: Optimized layout for printing recipes.

-   **Modern UI/UX**:
    -   **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.
    -   **Interactive Animations**: smooth transitions and hover effects powered by Framer Motion.
    -   **Dark/Light Mode**: (If applicable, or "Prepared for") Theming support via Tailwind.

## 🛠 Tech Stack

### Core
-   **Frontend Framework**: [React 18](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)

### Styling & UI
-   **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI primitives)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)

### State & Data
-   **Routing**: [React Router DOM v6](https://reactrouter.com/)
-   **State Management**: React Context API (`ShoppingListContext`)
-   **Data Fetching**: Native Fetch API (integration with React Query planned)
-   **API**: [TheMealDB](https://www.themealdb.com/api.php)

## 📂 Codebase Structure

```bash
src/
├── api/                # API service functions (mealdb.ts)
├── assets/             # Static assets (images, fonts)
├── components/         # Reusable UI components
│   ├── ui/             # Shadcn UI primitives (Button, Card, Input...)
│   ├── RecipeCard.tsx  # Individual recipe display card
│   └── ShoppingList.tsx # Modal component for ingredients
├── contexts/           # Global state contexts
│   └── ShoppingListContext.tsx # Manages shopping list state
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helper functions (utils.ts)
├── pages/              # Application pages (Home, Recipes, Detail)
├── App.tsx             # Main application component & Routing
└── main.tsx            # Entry point
```

## 🚀 Setup & Installation

To run this project locally on your machine, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/recipe-finder.git
    cd recipe-finder
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    Visit `http://localhost:5173` (or the port shown in your terminal).

## 📖 Usage Instructions

### Searching for Recipes
1.  Use the search bar on the **Home** page or the dedicated **Recipes** page.
2.  Type a keyword (e.g., "Chicken", "Pasta") and press Enter or click Search.

### Managing Your Shopping List
1.  Open any **Recipe Detail** page.
2.  Click the **"Add into Shopping List"** button in the Ingredients section.
3.  Click the Shopping Bag icon in the header or "View Shopping List" button to see your items.
4.  You can verify items, remove them individually, or clear the entire list.

### Saving Favorites
1.  On a Recipe Detail page, click the **Heart** icon to save a recipe.
2.  *Note: Currently, favorites are stored in local component state. Future updates will include persistent storage.*

## ⚠️ Additional Notes

-   **Persistence**: The shopping list is persisted to `localStorage`, so your items remain even after refreshing the page.
-   **Performance**: Images are lazy-loaded where possible to improve initial load times.
-   **Accessibility**: The application follows WCAG guidelines, ensuring semantic HTML structure and keyboard navigability.

---

Built with ❤️ by [Your Name]