package aor.paj.service;

import java.util.ArrayList;
import java.util.List;

import aor.paj.bean.UserBean;
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
        User user =  userBean.getUser(username);

        if (user==null) {
            return Response.status(400).entity("User with this username is not found").build();
        }
        return Response.status(200).entity(user).build();
    }

    @DELETE
    @Path("/delete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeUser(@QueryParam("username") String username) {
        boolean deleted =  userBean.removeUser(username);
        if (!deleted)
            return Response.status(200).entity("User with this username is not found").build();
        return Response.status(200).entity("User deleted").build();
    }

    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateUser(User updatedUser, @HeaderParam("username") String username) {
        boolean updated = userBean.updateUser(username,
                updatedUser.getEmail(),
                updatedUser.getFirstName(),
                updatedUser.getLastName(),
                updatedUser.getPhoneNumber(), updatedUser.getPhoto());
        if (!updated)
            return Response.status(400).entity("User with this username is not found").build();
        return Response.status(200).entity("User information updated").build();
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginUser(User u) {

        String username = u.getUsername();
        String password = u.getPassword();

        System.out.println(username + " , " + password);

        User user = userBean.getUser(username);

        if (user == null) {
            System.out.println("user null");
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
    public Response signUp(User u) {

        String username = u.getUsername();
        String password = u.getPassword();
        String email = u.getEmail();
        String phoneNumber = u.getPhoneNumber();

        ArrayList users = userBean.getUsers();

        if (username == null || username.isEmpty() || password == null || password.isEmpty() || email == null || email.isEmpty()) {
            return Response.status(400).entity("Username, password, and email are required.").build();
        }else{
            if (userBean.usernameExists(username, users)) {
                return Response.status(400).entity("Username already taken.").build();
            } else if (!userBean.validatePassword(password)) {
                return Response.status(400).entity("Invalid password").build();
            } else if (userBean.emailExists(email, users)) {
                return Response.status(400).entity("Email already in use.").build();
            } else if (userBean.phoneExists(phoneNumber, users)) {
                return Response.status(400).entity("This phone number is already in use.").build();
            }else {
                //Cria o novo utilizador e adiciona à lista
                User newUser = new User(username,password,email,u.getFirstName(),u.getLastName(),phoneNumber,u.getPhoto());
                userBean.addUser(newUser);
                return Response.status(201).entity("Thanks for being awesome! Your account has been successfully created.").build();
            }
        }
    }


    @GET
    @Path("/getuser")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(){
        User u = userBean.getLoggeduser();
        if(u!= null)
            return Response.status(200).entity(userBean.getLoggeduser()).build();
        else
            return Response.status(400).entity("There is no user logged in at the moment!").build();
    }

    @PUT
    @Path("/updatePassword")
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
}