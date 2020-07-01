// toggle da receita
const head = document.querySelectorAll(".recipe_section");

for (const recipe of head) {
  const btn = recipe.querySelector("button");
  const recipeContent = recipe.querySelector(".recipe_content");

  btn.addEventListener("click", function () {
    recipeContent.classList.toggle("active");

    if (recipeContent.classList.contains("active")) {
      btn.textContent = "Esconder";
    } else {
      btn.textContent = "Mostrar";
    }
  });
}

//menu responsivo
let show = true;

const menuSection = document.querySelector(".menu-section");
const menuToggle = menuSection.querySelector(".menu-toggle");

menuToggle.addEventListener("click", () => {
  document.body.style.overflow = show ? "hidden" : "initial"; // se for true ele libera hidden , se não initial

  menuSection.classList.toggle("on", show); // na primeira vez que clicar ele(show) vai estar como true , então ele só vai reforça o comando de colocar a class on

  show = !show; //e ele vai receber false, na proxima vez o toggle vai saber que tem de tirar a class on,isso tudo ,para evitar de fazer a funcionar sem eu mandar
});


const LightBox = {
  // Dados de entrada, processamento , e Saída;
  target: document.querySelector(".highlight .lightbox"),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector(".lightbox-target .close-lightbox"),
  open() {
    LightBox.target.style.opacity = 1;
    LightBox.target.style.top = 0;
    LightBox.target.style.bottom = 0;
    LightBox.closeButton.style.top = 0;
  },
  close() {
    LightBox.target.style.opacity = 0;
    LightBox.target.style.top = "-100%";
    LightBox.target.style.bottom = "initial";
    LightBox.closeButton.style.top = "-80px";
  },
};