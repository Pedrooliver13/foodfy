const formDelete = document.querySelector('#formDelete')
const inpuTotalRecipes = document.querySelector('#totalRecipes')
const totalRecipes = inpuTotalRecipes.getAttribute('name')

if(Number(totalRecipes) == 0){
    formDelete.addEventListener('submit' , function(event) {
        const confirmation = confirm('Deseja deletar?')
    
        if(!confirmation) {
            event.preventDefault()
        }
    })
}else{
    formDelete.addEventListener('submit' , (event)=>{
        event.preventDefault
        alert('não é possível deletar, Pois ele ainda tem receitas ativas no site')
    })
}

