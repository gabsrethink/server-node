import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/check-in.ts
import z from "zod";
async function checkIn(app) {
  app.withTypeProvider().get(
    "/attendees/:attendeeId/check-in",
    {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        summary: "Check-in an attendee",
        tags: ["check-ins"],
        response: {
          201: z.null()
        }
      }
    },
    async (req, res) => {
      const { attendeeId } = req.params;
      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId
        }
      });
      if (attendeeCheckIn !== null) {
        throw new BadRequest("Attendee already checked in");
      }
      await prisma.checkIn.create({
        data: {
          attendeeId
        }
      });
      return res.status(201).send();
    }
  );
}

export {
  checkIn
};
