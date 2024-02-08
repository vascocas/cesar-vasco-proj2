package aor.paj.service;

import aor.paj.bean.TaskBean;
import aor.paj.dto.Task;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;


@Path("/tasks")
public class TaskService {

    @Inject
    TaskBean taskBean;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Task> getTasks() {
        return taskBean.getTasks();
    }

    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addTask(Task t) {
        taskBean.addTask(t);
        return Response.status(200).entity("A new task is created").build();
    }

    @GET
    @Path("/{title}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTask(@PathParam("title") String title) {
        Task task =  taskBean.getTask(title);

        if (task==null)
            return Response.status(200).entity("Task with this title is not found").build();
        return Response.status(200).entity(task).build();
    }

    @DELETE
    @Path("/{title}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeTask(@PathParam("title") String title) {
        boolean deleted =  taskBean.removeTask(title);
        if (!deleted)
            return Response.status(200).entity("Task with this title is not found").build();
        return Response.status(200).entity("Task deleted").build();
    }

    @PUT
    @Path("/updateColumn/{title}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateColumn(Task t, @PathParam("title") String column) {
        boolean updated = taskBean.updateColumn(t.getTitle(), column);
        if (!updated)
            return Response.status(200).entity("Task with this title is not found").build();
        return Response.status(200).entity("Task column updated").build();
    }

    @PUT
    @Path("/updateDescription/{title}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateDescription(Task t, @PathParam("title") String description) {
        boolean updated = taskBean.updateDescription(t.getTitle(), description);
        if (!updated)
            return Response.status(200).entity("Task with this title is not found").build();
        return Response.status(200).entity("Task description updated").build();
    }


}