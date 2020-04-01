const currentPage = location.pathname; //location.pathname, ou seja pegando o nome da URL;
const activeMenu = document.querySelectorAll("header a"); // menu a ser usado.

activeMenu.forEach(item => {
  if (currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active");
  }
});
// toggle da receita
const RecipeToggle = {
  recipeContent: document.querySelector(".recipe_content"),
  button: "",
  replaceNameToggle(event) {
    const content = RecipeToggle.recipeContent;
    const button = event;

    if (content.classList.contains("active")) {
      button.textContent = "Mostrar";
    } else {
      button.textContent = "Esconder";
    }
  },
  handleToggleRecipe(event) {
    const content = RecipeToggle.recipeContent;

    RecipeToggle.replaceNameToggle(event);
    content.classList.toggle("active");
  }
};
//paginação
function paginate(selectedPage, totalPage) {
	let page = [],
		oldPage

	for (let currentPages = 1; currentPages <= totalPage; currentPages++) {
		const FirstAndLastPages = currentPages == 1 || currentPages == totalPage
		const pageAfterSelectedPages = currentPages <= selectedPage + 2
		const pageBeforeSelectedPages = currentPages >= selectedPage - 2

		if (FirstAndLastPages || pageAfterSelectedPages && pageBeforeSelectedPages) {
			if (oldPage && currentPages - oldPage > 2) {
				page.push('...')
			}
			if (oldPage && currentPages - oldPage == 2) {
				page.push(oldPage + 1)
			}

			page.push(currentPages)
			oldPage = currentPages
		}
	}
	return page
}
//responsável por chamar a função paginate e enviar o que recebeu para o front
function createPaginate(pagination) {
	const page = +pagination.dataset.page
	const total = +pagination.dataset.total

	const pages = paginate(page, total)
	let elements = ""

	for (let page of pages) {
		if (String(page).includes('...')) {
			elements += `<span>${page}</span>`
		} else {
			elements += `<a href="?page=${page}">${page}</a>`
		}
	}
	pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if (pagination) {
	createPaginate(pagination)
}
