const login = require("../../frontend/Pages/login");

test("User logado com sucesso", async () => {
    const response = await login.login("user_teste", "123A5");
    expect(response).toBe(true);
});

test("Login falhado", async () => {
    const response = await login.login("user_invalido","password_inválida");
    expect(response).toBe(false);
});

test("User com password errada", async () => {
    const response = await login.login("user_teste", "178");
    expect(response).toBe(false);
});