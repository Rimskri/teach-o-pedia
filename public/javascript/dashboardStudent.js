const select = document.querySelector("#subjectChooser");
// const value = select.options[select.selectedIndex].text;
const subject = document.querySelectorAll(".subject-container");
const profile = document.querySelectorAll(".user-part");
const submitBtn = document.querySelector("#submitBtn");
const closeBtn = document.querySelector("#close-button");
closeBtn.style.display = "none";

submitBtn.addEventListener("click", () => {
    let output = select.value;
    closeBtn.style.display = "block";
    submitBtn.disabled = true;
    for (i = 0 ; i< subject.length; i++){
        if(subject[i].textContent !== output) {
            profile[i].style.display = "none";
        }
    }
    console.log(output);
})

closeBtn.addEventListener("click" , () => {
    closeBtn.style.display = "none";
    submitBtn.disabled = false;
    select.selectedIndex = '0';
    for (i = 0 ; i< subject.length; i++){
        profile[i].style.display = "inline-block";
    }
})
