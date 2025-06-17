import React from "react"
import Ingredient from "./ingredient";
import RecipeGenerator from "./getrecipie"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipeShown, setRecipeShown] = React.useState(false);
    const [recipe, setRecipe] = React.useState('');
    const [isLoadingRecipe, setIsLoadingRecipe] = React.useState(false);
    const [recipeError, setRecipeError] = React.useState(null);

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    async function handleGetRecipe() {
        setRecipeShown(true);
        setIsLoadingRecipe(true);
        setRecipeError(null);
        setRecipe('');
        try {
            const response = await fetch('http://localhost:3001/generate-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredients }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRecipe(data.recipeText);
        } catch (error) {
            setRecipeError(`Failed to get recipe: ${error.message}`);
        } finally {
            setIsLoadingRecipe(false);
        }
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>
            
            {ingredients.length > 0 && (
                <Ingredient
                    ingredients={ingredients}
                    toggleRecipeShow={handleGetRecipe}
                />
            )}
            
            {recipeShown && (
                <RecipeGenerator
                    recipe={recipe}
                    isLoadingRecipe={isLoadingRecipe}
                    recipeError={recipeError}
                />
            )}
        </main>
    )
}