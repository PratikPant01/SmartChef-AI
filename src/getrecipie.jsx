import React from 'react';
import Markdown from 'react-markdown';

function RecipeGenerator({ recipe, isLoadingRecipe, recipeError }) {
  return (
    <div>
      {isLoadingRecipe && <p>Generating your recipe...</p>}
      {recipeError && <p style={{ color: 'red' }}>{recipeError}</p>}
      {recipe && (
        <section>
          <h2>Your Recipe:</h2>
          <div className="recipe-output">
            <Markdown>{recipe}</Markdown>
          </div>
        </section>
      )}
    </div>
  );
}

export default RecipeGenerator;