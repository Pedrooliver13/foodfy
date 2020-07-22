const { formatBRL } = require('../../../lib/utils');

const User = require('../../models/usersModels');

const Recipes = require('../../models/recipes');
const File = require('../../models/files');

async function userId(session) {
  if(session.userId) {
    const { userId: id } = session;
    const user = await User.findOne({ where: {id} });

    return user;
  }
  return 
}

module.exports = {
  async index(req, res) {
    const { success } = req.query;
    
    try {
      
      const user = await userId(req.session); 

      let results = await Recipes.all();
      const recipes = results.rows;

      async function getImage(recipeId, userId) {
        let results = userId ? await File.find(userId) : await File.findRecipe(recipeId);
        const files = results.rows.map(
          (file) =>
            `${req.protocol}://${req.headers.host}${file.path.replace(
              "public",
              ""
            )}`
        );

        return files[0];
      }

      if(user) {
        user.img = await getImage("",user.file_id);  
      }
        

      const recipesPromise = recipes.map(async (recipe) => {
        recipe.img = await getImage(recipe.id);

        return recipe;
      });

      let lastAdded = await Promise.all(recipesPromise);

      return res.render("public/home/index", { recipes: lastAdded, user, success });

    } catch (error) {
      console.error(error);
    }
  },
};