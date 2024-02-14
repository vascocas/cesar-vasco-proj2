package aor.paj.service;

import aor.paj.bean.TaskBean;
import aor.paj.bean.UserBean;
import aor.paj.dto.Task;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;



@Path("/tasks")
public class TaskService {

    @Inject
    TaskBean taskBean;
    
    @PUT
    @Path("/moveTask")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response moveTask(Task t) {
        boolean updated = taskBean.moveTask(t.getTitle(), t.getColumn());
        if (!updated)
            return Response.status(400).entity("Task with this title is not found").build();
        return Response.status(200).entity("Task moved to the new column").build();
    }

    @PUT
    @Path("/updateTask")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateDescription(Task t, @QueryParam("taskTitle") String taskTitle) {
        boolean updated = taskBean.updateTask(taskTitle, t.getTitle(), t.getDescription(), t.getPriority(), t.getStartDate(), t.getEndDate());
        if (!updated)
            return Response.status(400).entity("Task with this title is not found").build();
        return Response.status(200).entity("Task content updated").build();
    }


}