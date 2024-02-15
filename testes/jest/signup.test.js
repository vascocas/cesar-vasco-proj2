const signup = require("../../frontend/Pages/signup");

test("User registado com sucesso", async () => {
    const response = await signup.register("user_para_registo", "987Z1","user_registo@abc.pt","user","registo","974185263","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6la0dOXP7G7oy6b1-xmmmZSTvY2y612sYg&usqp=CAU");
    expect(response).toBe(true);
});

test("Registo falhado", async () => {
    const response = await signup.register("user1", "123B5","user_1@abc.pt","user","1","974185261","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6la0dOXP7G7oy6b1-xmmmZSTvY2y612sYg&usqp=CAU");
    expect(response).toBe(false);
});