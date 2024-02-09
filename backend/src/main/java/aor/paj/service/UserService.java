package aor.paj.service;

import java.util.ArrayList;
import java.util.List;
import aor.paj.bean.UserBean;
import aor.paj.dto.User;
import aor.paj.dto.UserCredentials;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.Path;


@Path("/users")
public class UserService {

    @Inject
    UserBean userBean;


    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public List<User> getUsers() {
        return userBean.getUsers();
    }


    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addUser(User u) {

        userBean.addUser(u);
        return Response.status(200).entity("A new user is created").build();
    }

    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("username") String username) {
        User user =  userBean.getUser(username);

        if (user==null)
            return Response.status(200).entity("User with this username is not found").build();
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
    public Response updateUserFirstName(User u, @HeaderParam("username") String firstName) {
        boolean updated = userBean.updateUserFirstName(u.getUsername(), firstName);
        if (!updated)
            return Response.status(200).entity("User with this username is not found").build();
        return Response.status(200).entity("User first name updated").build();
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response loginUser(UserCredentials credentials) {
        String username = credentials.getUsername();
        String password = credentials.getPassword();

        User user = userBean.getUser(username);

        if (user == null) {
            return Response.status(404).entity("User with this username is not found").build();
        } else if (!user.getPassword().equals(password)) {
            return Response.status(401).entity("Invalid password").build();
        } else {
            return Response.status(200).entity("User logged in successfully").build();
        }
    }

    @POST
    @Path("/logout")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response logoutUser() {

        return Response.status(200).entity("User logged out successfully").build();
    }

    @POST
    @Path("/signup")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response signUp(User u) {

        ArrayList users = userBean.getUsers();

        if (userBean.usernameExists(u.getUsername(), users)) {
            return Response.status(400).entity("Username already in use").build();
        } else if (userBean.emailExists(u.getEmail(), users)) {
            return Response.status(400).entity("Email already in use").build();
        } else if (userBean.phoneExists(u.getPhoneNumber(), users)) {
            return Response.status(400).entity("This phone number is already in use").build();
        } else {
            u.setUserTasks(new ArrayList<>()); //Coloca Arraylist vazia
            u.setId(u.getNextId()); //Coloca ID na criação
            userBean.addUser(u);
            return Response.status(200).entity("Thanks for being awesome! Your account has been successfully created.").build();
        }
    }

}