const url = "https://ifsp.ddns.net/webservices/lembretes/usuario";

function createpopup() {
    if (document.querySelector(".popup-overlay")) {
        document.querySelector(".popup-overlay").remove();
    }

    const popup_over = document.createElement("div");
    popup_over.classList.add("popup-overlay", "d-flex", "justify-content-center", "align-items-center");

    const popup = document.createElement("div");
    popup.classList.add("popup", "bg-white", "p-4", "rounded", "shadow");

    const title = document.createElement("h3");
    title.innerText = "Register!";

    const login = document.createElement("input");
    login.type = "text";
    login.placeholder = "User";
    login.classList.add("form-control", "mb-3");

    const senha = document.createElement("input");
    senha.type = "password";
    senha.placeholder = "Password";
    senha.classList.add("form-control", "mb-3");

    const loginButton = document.createElement("button");
    loginButton.innerText = "Register";
    loginButton.classList.add("btn", "btn-primary", "me-2");

    const closeButton = document.createElement("button");
    closeButton.innerText = "Exit";
    closeButton.classList.add("btn", "btn-danger");

    function popup_closer() {
        popup.classList.add("popup-closing");
        setTimeout(() => {
            document.body.removeChild(popup_over);
        }, 400);
    }

    loginButton.addEventListener("click", () => {
        if (login.value === "" || senha.value === "") {
            loginButton.classList.add("shake");
            setTimeout(() => {
                loginButton.classList.remove("shake");
            }, 400);
        } else {
            let config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    login: login.value,
                    senha: senha.value
                })
            };

            fetch(`${url}/signup`, config)
                .then((resp) => {
                    if (!resp.ok) {
                        throw new Error("Erro ao tentar cadastrar usuário.");
                    }
                    return resp.json();
                })
                .then((response) => {
                    alert("Sucesso! Usuário cadastrado com sucesso!");
                    if (typeof(Storage) !== "undefined") {
                        localStorage.setItem("token", response.token);
                    }
                    // Redireciona para a página principal
                    window.location.href = "../page/page.html";
                })
                .catch((error) => {
                    alert("Erro: " + error.message);
                });

            popup_closer();
        }
    });

    closeButton.addEventListener("click", () => {
        popup_closer();
    });

    popup.appendChild(title);
    popup.appendChild(login);
    popup.appendChild(senha);
    popup.appendChild(loginButton);
    popup.appendChild(closeButton);
    popup_over.appendChild(popup);

    document.body.appendChild(popup_over);
}

let b_register = document.querySelector("#button1");
b_register.addEventListener("click", createpopup);


let b_login = document.querySelector("#button0");
b_login.addEventListener("click", () => {
    let login_input = document.querySelector("#form2Example1");
    let pass_input = document.querySelector("#form2Example2");

    if (login_input.value === "" || pass_input.value === "") {
        b_login.classList.add("shake");
        setTimeout(() => {
            b_login.classList.remove("shake");
        }, 400);
    } else {
        let username = login_input.value;
        let password = pass_input.value;
        let config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                login: username,
                senha: password
            })
        };

        fetch(`${url}/login`, config)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("Usuário ou senha incorretos.");
                }
                return resp.json();
            })
            .then((response) => {
                alert("Sucesso! Usuário logado com sucesso!");
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("token", response.token);
                }
                // Redireciona para a página principal
                window.location.href = "../page/page.html";
            })
            .catch((error) => {
                alert("Erro: " + error.message);
            });
    }
});
