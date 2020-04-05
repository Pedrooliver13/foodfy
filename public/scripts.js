//menu ativo;
const currentPage = location.pathname; //location.pathname, ou seja pegando o nome da URL;
const activeMenu = document.querySelectorAll("header a"); // menu a ser usado.

activeMenu.forEach((item) => {
  if (currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active");
  }
});

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
  },
};

//menu responsivo
let show = true;

const menuSection = document.querySelector(".menu-section");
const menuToggle = menuSection.querySelector(".menu-toggle");

menuToggle.addEventListener("click", () => {
  document.body.style.overflow = show ? "hidden" : "initial"; // se for true ele libera hidden , se não initial

  menuSection.classList.toggle("on", show); // na primeira vez que clicar ele(show) vai estar como true , então ele só vai reforça o comando de colocar a class on

  show = !show; //e ele vai receber false, na proxima vez o toggle vai saber que tem de tirar a class on,isso tudo ,para evitar de fazer a funcionar sem eu mandar
});

const PhotosUpload = {
  input: "",
  preview: document.querySelector(".photos-upload__preview"),
  UploadLimit: 8,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target;
    PhotosUpload.input = event.target;

    if (PhotosUpload.hasLimit(event)) return;

    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      PhotosUpload.files.push(file);

      reader.onload = () => {
        const image = new Image(); //<img>
        image.src = String(reader.result);

        const div = PhotosUpload.getContainer(image);

        PhotosUpload.preview.appendChild(div);
      };

      reader.readAsDataURL(file); // ele dispara o onload;
    });
    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  getAllFiles() {
    const dataTransfer =
      new ClipboardEvent("").clipboardData || new DataTransfer(); // mozilla e chrome;
    PhotosUpload.files.forEach((file) => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  hasLimit(event) {
    const { UploadLimit, input, preview } = PhotosUpload;
    const { files: fileList } = input;

    if (fileList.length > UploadLimit) {
      alert(
        `Você Ultrapassou o limite de envio de imagem(Limite máximo: ${UploadLimit})`
      );
      event.preventDefault();

      return true;
    }

    const photoDiv = [];
    preview.childNodes.forEach((item) => {
      if (item.classList && item.classList == "photo") photoDiv.push(item);
    });

    const totalPhotos = fileList.length + photoDiv.length;

    if (totalPhotos > UploadLimit) {
      alert(`Envie no máximo ${UploadLimit} fotos`);
      event.preventDefault();

      return true;
    }

    return false;
  },
  getContainer(image) {
    const div = document.createElement("div");
    div.classList.add("photo");

    div.onclick = PhotosUpload.removePhoto;

    div.appendChild(image);
    div.appendChild(PhotosUpload.removeButton());

    return div;
  },
  removeButton() {
    const button = document.createElement("i");
    button.classList.add("material-icons");
    button.innerHTML = "close";

    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode; // <div class="photo">
    const photoArray = Array.from(PhotosUpload.preview.children);

    const index = photoArray.indexOf(photoDiv);

    PhotosUpload.files.splice(index, 1);
    PhotosUpload.input.files = PhotosUpload.getAllFiles();

    return photoDiv.remove();
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;

    if (photoDiv.id) {
      const removedFiles = document.querySelector(
        'input[name="removed_files"]'
      );

      if (removedFiles) {
        removedFiles.value += `${photoDiv},`; // vamos remover a virgula no controllers;
      }
    }

    return photoDiv.remove();
  },
};

const ImageGallery = {
  previews: document.querySelectorAll(".gallery-preview img"),
  highLight: document.querySelector(".highlight > .highlight-image"),
  setImage(event) {
    const { target } = event;

    ImageGallery.previews.forEach((file) =>
      file.classList.remove("active-image")
    );

    target.classList.add("active-image");

    ImageGallery.highLight.src = target.src;

    LightBox.image.src = target.src;
  },
};

const LightBox = {
  target: document.querySelector(".lightbox"),
  image: document.querySelector(".lightbox-target img"),
  close: document.querySelector(".lightbox-target .close-lightbox"),
  open() {
    LightBox.target.style.opacity = 1;
    LightBox.target.style.top = 0;
    LightBox.target.style.bottom = 0;
    LightBox.close.style.top = 0;
  },
  close() {
    LightBox.target.style.opacity = 0;
    LightBox.target.style.top = "-100%";
    LightBox.target.style.bottom = "initial";
    LightBox.close.style.top = "-80px";
  },
};
