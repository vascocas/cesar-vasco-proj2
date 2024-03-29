package aor.paj.service;

import java.util.ArrayList;
import java.util.List;
import aor.paj.bean.UserBean;
import aor.paj.dto.Task;
import aor.paj.dto.User;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.Path;

@Path("/users")
public class UserService {

    @Inject
    UserBean userBean;

    @Context
    private HttpServletRequest request;

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public List<User> getUsers() {
        return userBean.getUsers();
    }

    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("username") String username) {
        User user = userBean.getUser(username);
        if (user == null) {
            return Response.status(400).entity("User with this username is not found").build();
        }
        return Response.status(200).entity(user).build();
    }

    @DELETE
    @Path("/delete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeUser(@QueryParam("username") String username) {
        boolean deleted = userBean.removeUser(username);
        if (!deleted)
            return Response.status(200).entity("User with this username is not found").build();
        return Response.status(200).entity("User deleted").build();
    }

    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateUser(User updatedUser,
                               @HeaderParam("username") String username,
                               @HeaderParam("password") String password) {
        boolean updated = userBean.updateUser(username, password,
                updatedUser.getEmail(),
                updatedUser.getFirstName(),
                updatedUser.getLastName(),
                updatedUser.getPhoneNumber(),
                updatedUser.getPhoto());
        if (!updated)
            return Response.status(400).entity("User with this username is not found").build();
        return Response.status(200).entity("User information updated").build();
    }


    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginUser(@HeaderParam("username") String username,
                              @HeaderParam("password") String password) {
        User user = userBean.getUser(username);
        if (user == null) {
            return Response.status(401).entity("User with this username is not found").build();
        } else if (!user.getPassword().equals(password)) {
            return Response.status(401).entity("Invalid password").build();
        } else {
            userBean.login(username);
            return Response.status(200).entity("User logged in successfully").build();
        }
    }

    @POST
    @Path("/logout")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response logout() {
        HttpSession session = request.getSession();
        session.invalidate();
        return Response.status(200).entity("User logged out successfully").build();
    }

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response register(@HeaderParam("username") String username,
                             @HeaderParam("password") String password,
                             @HeaderParam("email") String email,
                             @HeaderParam("firstName") String firstName,
                             @HeaderParam("lastName") String lastName,
                             @HeaderParam("phoneNumber") String phoneNumber,
                             @HeaderParam("photo") String photo) {

        ArrayList<User> users = userBean.getUsers();

        if (username == null || username.isEmpty() || password == null || password.isEmpty() || email == null || email.isEmpty()) {
            return Response.status(400).entity("Username, password, and email are required.").build();
        } else {
            if (userBean.usernameExists(username)) {
                //409 Indica que a solicitação não pode ser concluída devido a um conflito com o estado atual do pedido.
                return Response.status(409).entity("Username already taken.").build();
            } else if (!userBean.validatePassword(password)) {
                return Response.status(400).entity("Invalid password").build();
            } else if (userBean.emailExists(email, users)) {
                //403 Indica que o servidor entendeu a solicitação, mas recusa-se a autorizá-la.
                return Response.status(403).entity("Email already in use.").build();
            } else if (userBean.phoneExists(phoneNumber, users)) {
                return Response.status(400).entity("This phone number is already in use.").build();
            } else {
                //Cria o novo utilizador e adiciona à lista
                User newUser = new User(username,password,email,firstName,lastName,phoneNumber,photo);
                userBean.addUser(newUser);
                return Response.status(201).entity("Thanks for being awesome! Your account has been successfully created.").build();
            }
        }
    }


    @GET
    @Path("/getuser")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser() {
        User u = userBean.getLoggeduser();
        if (u != null)
            return Response.status(200).entity(userBean.getLoggeduser()).build();
        else
            return Response.status(400).entity("There is no user logged in at the moment!").build();
    }

    @PUT
    @Path("/update/password")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updatePassword(@HeaderParam("username") String username,
                                   @HeaderParam("oldpassword") String oldPassword,
                                   @HeaderParam("newpassword") String newPassword) {

        // Verificar password antiga
        boolean isOldPasswordValid = userBean.verifyPassword(username, oldPassword);
        if (!isOldPasswordValid) {
            return Response.status(401).entity("Incorrect old password").build();
        }
        // Se a password antiga é válida, update a password
        boolean updated = userBean.updatePassword(username, newPassword);
        if (!updated)
            return Response.status(400).entity("User with this username is not found").build();
        return Response.status(200).entity("User password updated").build();
    }


    // User authentication
    private boolean authenticateUser(String userPath, String user, String pass) {
        if (!userBean.verifyUsername(userPath, user) || !userBean.verifyPassword(userPath, pass)) {
            return false;
        }
        return true;
    }

    // Add Task
    @POST
    @Path("{username}/tasks")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addTask(Task t, @HeaderParam("username") String user,
                            @HeaderParam("password") String pass,
                            @PathParam("username") String userPath) {
        // User authentication checks
        if (!authenticateUser(userPath, user, pass)) {
            return Response.status(403).entity("Utilizador sem autorização").build();
        }
        // Repeated taskId check
        if (userBean.verifyTaskId(userPath, t.getTaskId())) {
            return Response.status(400).entity("Tarefa com este iD já existe").build();
        }
        // Empty task name check
        if (t.getTitle().isEmpty()) {
            return Response.status(400).entity("Por favor preencha o Título").build();
        }
        // If priority value is blank or different from the set values, set default value
        int priority = t.getPriority();
        if (priority != 100 && priority != 300 && priority != 500) {
            t.setPriority(100);
        }
        userBean.addTaskUser(userPath, t);
        return Response.status(200).entity("Nova tarefa criada com sucesso").build();
    }

    // Get Tasks of a user
    @GET
    @Path("{username}/tasks")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTasks(@PathParam("username") String userPath) {
        if (userBean.getUser(userPath)==null) {
            return Response.status(404).entity("Utilizador não existe").build();
        }
        List<Task> tasks = userBean.getTasks(userPath);
        return Response.status(200).entity(tasks).build();
    }

    // Delete Task
    @DELETE
    @Path("{username}/delete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeTask(@QueryParam("iD") long iD, @HeaderParam("username") String user, @HeaderParam("password") String pass, @PathParam("username") String userPath) {
        // User authentication checks
        if (!authenticateUser(userPath, user, pass)) {
            return Response.status(403).entity("Utilizador sem autorização").build();
        }
        boolean deleted =  userBean.removeTask(userPath, iD);
        if (!deleted)
            return Response.status(400).entity("Tarefa com este iD não encontrada").build();
        return Response.status(200).entity("Tarefa apagada").build();
    }

    // Move Task
    @PUT
    @Path("{username}/moveTask")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response moveTask(Task t, @HeaderParam("username") String user, @HeaderParam("password") String pass, @PathParam("username") String userPath) {
        // User authentication checks
        if (!authenticateUser(userPath, user, pass)) {
            return Response.status(403).entity("Utilizador sem autorização").build();
        }
        String destinationColumn = t.getColumn();
        // Check if destination column is one of the default options
        if (!(destinationColumn.equals("todo-cards") || destinationColumn.equals("doing-cards") || destinationColumn.equals("done-cards"))) {
            return Response.status(400).entity("A coluna de destino não é válida").build();
        }
        boolean updated = userBean.moveTask(userPath, t.getTaskId(), t.getColumn());
        if (!updated)
            return Response.status(400).entity("Tarefa com este iD não encontrada").build();
        return Response.status(200).entity("Tarefa movida de coluna").build();
    }

    // Edit task content
    @PUT
    @Path("{username}/updateTask")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateDescription(Task t, @QueryParam("iD") long iD, @HeaderParam("username") String user, @HeaderParam("password") String pass, @PathParam("username") String userPath) {
        // User authentication checks
        if (!authenticateUser(userPath, user, pass)) {
            return Response.status(403).entity("Utilizador sem autorização").build();
        }
        // Empty task name check
        if (t.getTitle().isEmpty()) {
            return Response.status(400).entity("Por favor preencha o Título").build();
        }
        // If priority value is blank or different from the set values, set default value
        int priority = t.getPriority();
        if (priority != 100 && priority != 300 && priority != 500) {
            t.setPriority(100);
        }
        boolean updated = userBean.updateTask(userPath, iD, t.getTitle(), t.getDescription(), t.getPriority(), t.getStartDate(), t.getEndDate());
        if (!updated)
            return Response.status(400).entity("Tarefa com este iD não encontrada").build();
        return Response.status(200).entity("Conteúdo da tarefa actualizado").build();
    }
}