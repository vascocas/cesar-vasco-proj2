package aor.paj.service;

import java.util.List;
import aor.paj.bean.UserBean;
import aor.paj.dto.User;
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


@Path("/user")
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
}