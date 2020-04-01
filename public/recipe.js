const head = document.querySelectorAll('.recipe_section')

for(const recipe of head){
    const btn = recipe.querySelector("button")
    const recipeContent = recipe.querySelector('.recipe_content')

        btn.addEventListener('click' , function(){
            recipeContent.classList.toggle('active')


            if(recipeContent.classList.contains('active')){
                btn.textContent = 'Esconder'

            }else{
                btn.textContent = 'Mostrar'
                
            }
        })
}