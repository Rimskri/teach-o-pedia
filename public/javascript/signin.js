const profile_teacher = document.querySelector("form[name=signin-form] input[id=teacher]");
const profile_student = document.querySelector("form[name=signin-form] input[id=student]");
document.querySelector("#teacher-part").style.display = "block";
document.querySelector("#student-part").style.display = "none";
document.getElementById("cls").required = false;
document.getElementById("sub").required = true;

profile_teacher.addEventListener("click" , () => {
    document.querySelector("#teacher-part").style.display = "block";
    document.querySelector("#student-part").style.display = "none";
    document.getElementById("cls").required = false;
    document.getElementById("sub").required = true;
});

profile_student.addEventListener("click" , () => {
    document.querySelector("#student-part").style.display = "block";
    document.querySelector("#teacher-part").style.display = "none";
    document.getElementById("sub").required = false;
    document.getElementById("cls").required = true;
});
