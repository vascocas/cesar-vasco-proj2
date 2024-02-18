const signup = require("../../frontend/Pages/signup");

test("User registado com sucesso", async () => {
    const response = await signup.register("user_para_registo", "987Z1","user_registo@abc.pt","user","registo","974185263","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6la0dOXP7G7oy6b1-xmmmZSTvY2y612sYg&usqp=CAU");
    expect(response).toBe(201);
});

test("Registo falhado", async () => {
    const response = await signup.register("", "","user_1@abc.pt","user","1","974185261","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6la0dOXP7G7oy6b1-xmmmZSTvY2y612sYg&usqp=CAU");
    expect(response).toBe(400);
});

test("Password inválida", async () => {
    const response = await signup.register("user123teste", "123","user_1@abc.pt","user","1","974185261","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6la0dOXP7G7oy6b1-xmmmZSTvY2y612sYg&usqp=CAU");
    expect(response).toBe(400);
});

test("Email já usado", async () => {
    const response = await signup.register("mnbbs321", "123B5","user_teste@abc.pt","user","1","974185260","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6la0dOXP7G7oy6b1-xmmmZSTvY2y612sYg&usqp=CAU");
    expect(response).toBe(403);
});

test("Username já existe", async () => {
    const response = await signup.register("user_teste", "123B5","user_1teste@abc.pt","user","1","974185268","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6la0dOXP7G7oy6b1-xmmmZSTvY2y612sYg&usqp=CAU");
    expect(response).toBe(409);
});

test("Contacto já existe", async () => {
    const response = await signup.register("poiouiiy789", "123B5","poiouiiy789e@abc.pt","user","1","912345678","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6la0dOXP7G7oy6b1-xmmmZSTvY2y612sYg&usqp=CAU");
    expect(response).toBe(400);
});

test("Obter todos os users", async () => {
    const users = await signup.getAllUsers();
    expect(users).toContainEqual({
        email: "user_teste@abc.pt",
        firstName: "user",
        lastName: "teste",
        password: "123A5",
        phoneNumber: "912345678",
        photo: "https://a.storyblok.com/f/191576/1200x800/faa88c639f/round_profil_picture_before_.webp",
        userTasks: [],
        username: "user_teste"
    });
});