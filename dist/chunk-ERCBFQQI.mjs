import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/register-for-event.ts
import z from "zod";
async function registerForEvent(app) {
  app.withTypeProvider().post(
    "/events/:eventId/attendees",
    {
      schema: {
        body: z.object({
          name: z.string().min(4),
          email: z.string().email()
        }),
        params: z.object({
          eventId: z.string().uuid()
        }),
        summary: "Register an attendee",
        tags: ["attendees"],
        response: {
          201: z.object({
            attendeeId: z.number()
          })
        }
      }
    },
    async (req, res) => {
      const { eventId } = req.params;
      const { name, email } = req.body;
      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            email,
            eventId
          }
        }
      });
      if (attendeeFromEmail !== null) {
        throw new BadRequest("This email is already registered for this event");
      }
      const [event, amountOfAttendeesForEvent] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId
          }
        }),
        prisma.attendee.count({
          where: {
            eventId
          }
        })
      ]);
      if (event?.maximumAttendees && amountOfAttendeesForEvent >= event?.maximumAttendees) {
        throw new Error(
          "The maximum number of attendees for this event has been reached"
        );
      }
      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId
        }
      });
      return res.status(201).send({ attendeeId: attendee.id });
    }
  );
}

export {
  registerForEvent
};
