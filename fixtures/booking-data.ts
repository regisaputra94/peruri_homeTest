/**
 * Test data for the Restful-Booker CRUD chain (Tugas 3). Kept separate from
 * the spec so the request payload can be reused/adjusted without touching
 * test logic, and so the "updated" payload is visibly a variation of the
 * "created" one rather than an unrelated hardcoded object.
 */

export const authCredentials = {
  username: 'admin',
  password: 'password123',
};

export function newBookingPayload() {
  return {
    firstname: 'Ada',
    lastname: 'Lovelace',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2025-01-01',
      checkout: '2025-01-05',
    },
    additionalneeds: 'Breakfast',
  };
}

export function updatedBookingPayload() {
  return {
    firstname: 'Grace',
    lastname: 'Hopper',
    totalprice: 225,
    depositpaid: false,
    bookingdates: {
      checkin: '2025-02-10',
      checkout: '2025-02-15',
    },
    additionalneeds: 'Late check-out',
  };
}
