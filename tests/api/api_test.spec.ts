import { test, expect } from '@playwright/test';
import { AuthTokenSchema } from '../../schemas/restfulBooker.schemas';
import { ApiClient } from '../../utils/ApiClient';



test.describe('API Automation', () => {
  let token: string | null = null;
  test('POST /auth succeeds with valid credentials @smoke', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const username = 'admin';
    const password = 'password123';
    const { body, response } = await api.post('/auth', { username, password });

    expect(response.status()).toBe(200);
    const result = AuthTokenSchema.safeParse(body);
    token = result.success ? result.data.token : null;
    console.log(token);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
  });
});
