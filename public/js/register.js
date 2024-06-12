document.getElementById("register").addEventListener("submit", function(event){
    event.preventDefault();
    const formdata = new FormData(this);
    const username = formdata.get("username");
    const email = formdata.get("email");
    const password = formdata.get("password");

    fetch("/register", {
        method:"POST",
        headers: {
            "Content-Type":"application/json",
        },
        body: JSON.stringify({username, email,password})
    })
    .then(response => response.json())
    .then(data => {
        const messagetag = document.getElementById("message");
        messagetag.innerText = data.message;
        if (data.message === "User created successfully.") {
            messagetag.classList.add("success");
            messagetag.classList.remove("error");
        } else {
            messagetag.classList.add("error");
            messagetag.classList.remove("success");
        }
        document.getElementById("register");
    })
    .catch(error =>{
        console.error("Error:", error);
        document.getElementById("message").innerText = "An error occurred, please try again.";
    })
})