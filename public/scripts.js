const currentPage = location.pathname; //location.pathname, ou seja pegando o nome da URL;
const activeMenu = document.querySelectorAll("header a"); // menu a ser usado.

activeMenu.forEach(item => {
  if (currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active");
  }
});
// toggle da receita

const head = document.querySelectorAll(".recipe_section");

for (const recipe of head) {
  const btn = recipe.querySelector("button");
  const recipeContent = recipe.querySelector(".recipe_content");

  btn.addEventListener("click", function() {
    recipeContent.classList.toggle("active");

    if (recipeContent.classList.contains("active")) {
      btn.textContent = "Esconder";
    } else {
      btn.textContent = "Mostrar";
    }
  });
}
//paginação
function paginate(selectedPage, totalPage) {
  let page = [],
    oldPage;

  for (let currentPages = 1; currentPages <= totalPage; currentPages++) {
    const FirstAndLastPages = currentPages == 1 || currentPages == totalPage;
    const pageAfterSelectedPages = currentPages <= selectedPage + 2;
    const pageBeforeSelectedPages = currentPages >= selectedPage - 2;

    if (
      FirstAndLastPages ||
      (pageAfterSelectedPages && pageBeforeSelectedPages)
    ) {
      if (oldPage && currentPages - oldPage > 2) {
        page.push("...");
      }
      if (oldPage && currentPages - oldPage == 2) {
        page.push(oldPage + 1);
      }

      page.push(currentPages);
      oldPage = currentPages;
    }
  }
  return page;
}
//responsável por chamar a função paginate e enviar o que recebeu para o front
function createPaginate(pagination) {
  const page = +pagination.dataset.page;
  const total = +pagination.dataset.total;

  const pages = paginate(page, total);
  let elements = "";

  for (let page of pages) {
    if (String(page).includes("...")) {
      elements += `<span>${page}</span>`;
    } else {
      elements += `<a href="?page=${page}">${page}</a>`;
    }
  }
  pagination.innerHTML = elements;
}
// getPagination
const pagination = document.querySelector(".pagination");
if (pagination) {
  createPaginate(pagination);
}

// confirmando se que deletar;
const wantDelete = {
  formDelete: document.querySelector("#formDelete"),
  inputTotalRecipes: document.querySelector("#totalRecipes"),
  handleDelete(event) {
    const totalRecipes = wantDelete.inputTotalRecipes.getAttribute("name");

    if (Number(totalRecipes) == 0) {
      const confirmation = confirm("Deseja deletar?");

      if (!confirmation) {
        event.preventDefault();
      }
    } else {
      event.preventDefault();
      alert(
        "não é possível deletar, Pois ele ainda tem receitas ativas no site"
      );
    }
  }
};

//menu responsivo
let show = true;

const menuSection = document.querySelector(".menu-section");
const menuToggle = document.querySelector('.menu-toggle')

menuToggle.addEventListener('click', ()=>{
  document.body.style.overflow = show ? "hidden":"initial"; // se for true ele libera hidden , se não initial

  menuSection.classList.toggle('on', show) // na primeira vez que clicar ele(show) vai estar como true , então ele só vai reforça o comando de colocar a class on 

  show = !show;//e ele vai receber false, na proxima vez o toggle vai saber que tem de tirar a class on,isso tudo ,para evitar de fazer a funcionar sem eu mandar

})