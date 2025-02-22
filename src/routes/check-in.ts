import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/check-in",
    {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        summary: "Check-in an attendee",
        tags: ["check-ins"],
        response: {
          201: z.null(),
        },
      },
    },
    async (req, res) => {
      const { attendeeId } = req.params;

      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId,
        },
      });

      if (attendeeCheckIn !== null) {
        throw new BadRequest("Attendee already checked in");
      }

      await prisma.checkIn.create({
        data: {
          attendeeId,
        },
      });

      return res.status(201).send();
    }
  );
}
