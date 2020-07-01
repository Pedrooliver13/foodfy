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

// validators
const validate = {
  apply(input, func) {
    validate.clearErros(input);

    let results = validate[func](input.value);
    results.value;

    if (results.error) validate.displayError(input, results.error);
  },
  displayError(input, error) {
    input.parentNode.classList.add('error');

    input.focus();
  },
  clearErros(input) {
    input.parentNode.classList.remove("error");
  },
  isEmail(value) {
    let error = null;

    // formatando o email;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!value.match(mailFormat)) error = "E-mail inválido";

    return {
      error,
      value,
    };
  },
};
