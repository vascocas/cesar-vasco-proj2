// Mocking localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};

const login = require("../../frontend/Pages/login");

test("User logado com sucesso", async () => {
    const response = await login.login("user1", "123B5");
    expect(response).toBe(true);
});

test("User login falhado", async () => {
    const response = await login.login("invalidUser", "invalidPassword");
    expect(response).toBe(false);
});