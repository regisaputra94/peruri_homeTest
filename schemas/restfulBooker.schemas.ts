import { z } from 'zod';

/**
 * Runtime schema validation for the Restful-Booker API (Tugas 3). Using
 * zod instead of hand-rolled property checks means a single schema both
 * documents the expected contract and gives precise, readable failures
 * (field name + reason) when the API response drifts from it.
 */

export const AuthTokenSchema = z.object({
  token: z.string().min(5),
});

/**
 * Shape of a single booking record, e.g. the payload returned by
 * GET /booking/{id} and the "booking" field nested inside the
 * POST /booking response.
 */
export const BookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: z.string(),
    checkout: z.string(),
  }),
  additionalneeds: z.string().optional(),
});

/**
 * POST /booking wraps the created booking together with the new
 * bookingid — this is where the dynamic ID we thread through the rest
 * of the CRUD chain comes from.
 */
export const CreateBookingResponseSchema = z.object({
  bookingid: z.number(),
  booking: BookingSchema,
});

