import { test, expect } from '@playwright/test';
import {
  AuthTokenSchema,
  BookingSchema,
  CreateBookingResponseSchema,
} from '../../schemas/restfulBooker.schemas';
import { ApiClient } from '../../utils/ApiClient';
import { authCredentials, newBookingPayload, updatedBookingPayload } from '../../fixtures/booking-data';

/**
 * Tugas 3 — API Automation (Restful-Booker) Auth -> Create -> Read -> Update -> Delete run as one
 * ordered story (`describe.serial`) because each step consumes state
 * produced by the previous one (auth token, bookingid) — nothing is
 * hardcoded, everything is captured from live responses.
 */
test.describe.serial('Restful-Booker CRUD chain', () => {
  const state: { token?: string; bookingId?: number } = {};

  test('1. Auth: POST /auth returns a valid token @smoke', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const { response, body } = await api.post('/auth', authCredentials);

    expect(response.status()).toBe(200);
    const result = AuthTokenSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);

    if (result.success) state.token = result.data.token;
  });

  test('2. Create: POST /booking creates a booking and returns a bookingid @smoke', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const payload = newBookingPayload();
    const { response, body } = await api.post('/booking', payload);

    expect(response.status()).toBe(200);
    const result = CreateBookingResponseSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
    if (!result.success) return;

    expect(result.data.booking).toEqual(payload);
    state.bookingId = result.data.bookingid;
  });

  test('3. Read: GET /booking/{id} returns the data just created @smoke', async ({ request }, testInfo) => {
    expect(state.bookingId, 'bookingId must have been captured by the Create step').toBeDefined();

    const api = new ApiClient(request, testInfo);
    const { response, body } = await api.get(`/booking/${state.bookingId}`);

    expect(response.status()).toBe(200);
    const result = BookingSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
    if (result.success) expect(result.data).toEqual(newBookingPayload());
  });

  test('4. Update: PUT /booking/{id} with auth token updates the booking @smoke', async ({ request }, testInfo) => {
    expect(state.bookingId, 'bookingId must have been captured by the Create step').toBeDefined();
    expect(state.token, 'token must have been captured by the Auth step').toBeDefined();

    const api = new ApiClient(request, testInfo);
    const updatePayload = updatedBookingPayload();
    const { response, body } = await api.put(`/booking/${state.bookingId}`, updatePayload, {
      headers: { Cookie: `token=${state.token}` },
    });

    expect(response.status()).toBe(200);
    const result = BookingSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
    if (result.success) expect(result.data).toEqual(updatePayload);

    // Confirm the change is persisted, not just echoed back by PUT.
    const { body: readBack } = await api.get(`/booking/${state.bookingId}`);
    expect(readBack).toEqual(updatePayload);
  });

  test('5. Delete: DELETE /booking/{id} with auth token removes the booking @smoke', async ({ request }, testInfo) => {
    expect(state.bookingId, 'bookingId must have been captured by the Create step').toBeDefined();
    expect(state.token, 'token must have been captured by the Auth step').toBeDefined();

    const api = new ApiClient(request, testInfo);
    const { response } = await api.delete(`/booking/${state.bookingId}`, {
      headers: { Cookie: `token=${state.token}` },
    });

    expect([200, 201]).toContain(response.status());

    // Confirm the booking is actually gone, not just that DELETE returned 2xx.
    const getAfterDelete = await api.get(`/booking/${state.bookingId}`);
    expect(getAfterDelete.response.status()).toBe(404);
  });
});
