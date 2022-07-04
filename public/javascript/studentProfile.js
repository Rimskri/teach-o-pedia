const inputText = document.querySelectorAll(".text-class");
const inputCheckBox = document.querySelectorAll(".check-class");
const edit = document.querySelector("#edit");
const formSubmit = document.querySelector("#form-submit");
const cancel = document.querySelector("#cancel");
formSubmit.style.display = "none";
cancel.style.display = "none";
console.log(inputText);
console.log(inputCheckBox);

edit.addEventListener("click", ()=> {
    inputText.forEach(element => {
        console.log(element);
        element.readOnly = false;
    });
    inputCheckBox.forEach(element => {
        element.disabled = false;
    });
    edit.style.display = "none";
    formSubmit.style.display = "inline-block";
    cancel.style.display = "inline-block";

});

cancel.addEventListener("click", ()=> {
    inputText.forEach(element => {
        element.readOnly = true;
    });
    inputCheckBox.forEach(element => {
        element.disabled = true;
    });
    edit.style.display = "block";
    formSubmit.style.display = "none";
    cancel.style.display = "none";

})