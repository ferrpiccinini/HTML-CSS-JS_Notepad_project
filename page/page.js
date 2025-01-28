const url = "https://ifsp.ddns.net/webservices/lembretes/lembrete";

document.querySelector("#logout-btn").addEventListener("click", logout);

document.addEventListener("DOMContentLoaded", function () {
    tokenValidator().then((isValid) => {
        if (!isValid) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = "../login/login.html";
        } else {
            let token = localStorage.getItem("token");
            let config = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            };

            fetch(url, config)
                .then((resp) => {
                    if (!resp.ok) {
                        throw new Error("Erro ao listar lembretes!");
                    }
                    return resp.json();
                })
                .then((response) => {
                    let ul = document.querySelector(".lista-lembretes");
                    ul.innerHTML = ""; // Limpa a lista antes de adicionar novos lembretes
                    response.forEach((lembrete) => {
                        let li = document.createElement("li");
                        let p = document.createElement("p");
                        p.innerText = lembrete.texto;
                        li.appendChild(p);
                        li.dataset.id = lembrete.id;
                        criarBotoes(li);
                        ul.append(li);
                    });
                })
                .catch((error) => {
                    alert(`Erro: ${error.message}`);
                });
        }
    });
});

function criarBotoes(li) {
    let div = document.createElement("div");

    let btnEditar = document.createElement("button");
    btnEditar.textContent = "Edit";
    btnEditar.classList.add("btn","btn-warning");
    btnEditar.addEventListener("click", editar);

    let btnDelete = document.createElement("button");
    btnDelete.textContent = "Delet";
    btnDelete.classList.add("btn","btn-danger");
    btnDelete.addEventListener("click", deletar);

    div.append(btnEditar, btnDelete);
    li.append(div);
}

document.querySelector("#button_add").addEventListener("click", async function (event) {
    event.preventDefault();

    const isValid = await tokenValidator();
    if (isValid) {
        const renewed = await renewToken();
        if (renewed) {
            let token = localStorage.getItem("token");
            let texto = document.querySelector("#lembrete-texto").value;

            if (!texto.trim()) {
                alert("O lembrete não pode estar vazio!");
                return;
            }

            let config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ texto: texto })
            };

            fetch(`${url}`, config)
                .then((resp) => {
                    if (!resp.ok) {
                        throw new Error("Erro ao cadastrar lembrete!");
                    }
                    return resp.json();
                })
                .then((response) => {
                    let ul = document.querySelector(".lista-lembretes");
                    let li = document.createElement("li");
                    let p = document.createElement("p");
                    p.innerText = response.texto;
                    li.appendChild(p);
                    li.dataset.id = response.id;
                    criarBotoes(li);
                    ul.append(li);

                    alert("Lembrete cadastrado com sucesso!");
                    document.querySelector("#lembrete-texto").value = ""; // Limpa o campo de texto
                })
                .catch((error) => {
                    alert(`Erro: ${error.message}`);
                });
        } else {
            alert("Erro ao renovar token. Faça login novamente.");
            window.location.href = "../login/login.html";
        }
    } else {
        alert("Sessão expirada! Faça login novamente.");
        window.location.href = "../login/login.html";
    }
});


async function tokenValidator() {
    const urlUser = "https://ifsp.ddns.net/webservices/lembretes/usuario";
    let token = localStorage.getItem("token");

    let config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    };

    try {
        const resp = await fetch(`${urlUser}/check`, config);
        if (!resp.ok) {
            throw new Error("Erro ao validar autenticação!");
        }
        return true;
    } catch (error) {
        alert(`Erro: ${error.message}`);
        return false;
    }
}

async function logout() {
    const urlUser = "https://ifsp.ddns.net/webservices/lembretes/usuario";
    let token = localStorage.getItem("token");

    let config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    };

    try {
        const resp = await fetch(`${urlUser}/logout`, config);
        if (!resp.ok) {
            throw new Error("Erro ao realizar o logout!");
        }

        localStorage.removeItem("token");
        alert("Logout realizado com sucesso!");
        window.location.href = "../login/login.html";
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}

async function renewToken() {
    const urlUser = "https://ifsp.ddns.net/webservices/lembretes/usuario";
    let token = localStorage.getItem("token");
    let config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    };

    try {
        const resp = await fetch(`${urlUser}/renew`, config);
        if (!resp.ok) {
            throw new Error("Erro ao renovar token!");
        }
        const response = await resp.json();
        localStorage.setItem("token", response.token);
        return true;
    } catch (error) {
        alert(`Erro: ${error.message}`);
        return false;
    }
}

function acharId(e) {
    return e.target.closest("li").dataset.id;
}

async function editar(e) {
    let id = acharId(e);
    let li = e.target.closest("li");
    let p = li.querySelector("p");
    let textoAtual = p.textContent;

    let input = document.createElement("textarea");
    input.value = textoAtual;
    input.classList.add("form-control", "mb-2"); 

    let btnSalvar = document.createElement("button");
    btnSalvar.textContent = "Salvar";
    btnSalvar.classList.add("btn", "btn-success", "btn-sm", "mr-2"); 

    let btnCancelar = document.createElement("button");
    btnCancelar.textContent = "Cancelar";
    btnCancelar.classList.add("btn", "btn-secondary", "btn-sm");

    btnSalvar.addEventListener("click", async function () {
        const textoEditado = input.value.trim();
        if (!textoEditado) {
            alert("O lembrete não pode estar vazio!");
            return;
        }

        let token = localStorage.getItem("token");
        let config = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ texto: textoEditado })
        };

        fetch(`${url}/${id}`, config)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("Erro ao editar lembrete!");
                }
                return resp.json();
            })
            .then(() => {
                p.textContent = textoEditado;
                input.remove();
                btnSalvar.remove();
                btnCancelar.remove();
                alert("Lembrete editado com sucesso!");
            })
            .catch((error) => {
                alert(`Erro: ${error.message}`);
            });
    });

    btnCancelar.addEventListener("click", function () {
        input.remove();
        btnSalvar.remove();
        btnCancelar.remove();
    });

    li.append(input, btnSalvar, btnCancelar);
}


async function deletar(e) {
    let id = acharId(e);
    let token = localStorage.getItem("token");
    let config = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    };

    fetch(`${url}/${id}`, config)
        .then((resp) => {
            if (!resp.ok) {
                throw new Error("Erro ao deletar lembrete!");
            }
            e.target.closest("li").remove();
            alert("Lembrete deletado com sucesso!");
        })
        .catch((error) => {
            alert(`Erro: ${error.message}`);
        });
}
