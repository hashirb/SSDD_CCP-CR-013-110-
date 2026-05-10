import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createTestApp } from './helpers.js';

/**
 * INTENTIONAL_VULN_IDOR — server/src/app.js GET /api/notes/:id
 * Expectations are for the **fixed** build. With VULNERABLE_MODE=true this test fails.
 */
describe('IDOR (note read)', () => {
  it('denies reading another user note by id', async () => {
    const { app } = createTestApp();
    const alice = request.agent(app);
    const bob = request.agent(app);

    await alice.post('/api/auth/register').send({ username: 'alice_idor', password: 'alicepw' }).expect(201);
    await bob.post('/api/auth/register').send({ username: 'bob_idor', password: 'bobpw' }).expect(201);

    await alice.post('/api/auth/login').send({ username: 'alice_idor', password: 'alicepw' }).expect(200);
    await bob.post('/api/auth/login').send({ username: 'bob_idor', password: 'bobpw' }).expect(200);

    const created = await bob.post('/api/notes').send({ title: 'Bob secret', body: 'classified' }).expect(201);
    const noteId = created.body.note.id;

    const res = await alice.get(`/api/notes/${noteId}`);

    expect(res.status).toBe(404);
  });
});
