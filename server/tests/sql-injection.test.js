import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createTestApp } from './helpers.js';

/**
 * INTENTIONAL_VULN_SQLI_LOGIN — server/src/app.js
 * Expectations are for the **fixed** build. With VULNERABLE_MODE=true this test fails (demonstrating the flaw).
 */
describe('SQL injection (login)', () => {
  it('rejects OR 1=1 style credential bypass', async () => {
    const { app } = createTestApp();
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({ username: 'victim_user', password: 'supersecret' }).expect(201);

    const res = await agent.post('/api/auth/login').send({
      username: "nope' OR 1=1 --",
      password: 'anything',
    });

    expect(res.status).toBe(401);
  });
});
