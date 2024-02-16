const login = require("../../frontend/Pages/login");

test("User logado com sucesso", async () => {
    const response = await login.login("user1", "123B5");
    expect(response).toBe(true);
});

test("Login falhado", async () => {
    const response = await login.login("user_invalido","password_inválida");
    expect(response).toBe(false);
});