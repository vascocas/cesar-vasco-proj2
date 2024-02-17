const signup = require("../../frontend/Pages/signup");

test("User registado com sucesso", async () => {
    const response = await signup.register("user_para_registo", "987Z1","user_registo@abc.pt","user","registo","974185263","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6la0dOXP7G7oy6b1-xmmmZSTvY2y612sYg&usqp=CAU");
    expect(response).toBe(201);
});

test("Registo falhado", async () => {
    const response = await signup.register("user123teste", "123","user_1@abc.pt","user","1","974185261","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6la0dOXP7G7oy6b1-xmmmZSTvY2y612sYg&usqp=CAU");
    expect(response).toBe(400);
});

test("Email já usado", async () => {
    const response = await signup.register("user1teste", "123B5","user1@abc.pt","user","1","974185260","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6la0dOXP7G7oy6b1-xmmmZSTvY2y612sYg&usqp=CAU");
    expect(response).toBe(403);
});

test("Username já existe", async () => {
    const response = await signup.register("user1", "123B5","user_1teste@abc.pt","user","1","974185268","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6la0dOXP7G7oy6b1-xmmmZSTvY2y612sYg&usqp=CAU");
    expect(response).toBe(409);
});

test("Obter todos os users", async () => {
    const users = await signup.getAllUsers();
    expect(users).toContainEqual({
        email: "user1@abc.pt",
        firstName: "user",
        lastName: "1",
        password: "123B5",
        phoneNumber: "912345678",
        photo: "https://tinyjpg.com/images/social/website.jpg",
        userTasks: [],
        username: "user1"
    });
});