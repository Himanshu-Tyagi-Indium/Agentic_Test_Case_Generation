fixture `API Endpoints for Allowlisting`
    .page `http://localhost:3000`; // Replace with the actual URL of your API

test('Admin can create a new allowlist entry', async t => {
    const response = await t.request({
        method: 'POST',
        url: '/api/allowlists',
        body: { name: 'New Allowlist Entry' },
        headers: { 'Authorization': 'Bearer <admin_token>' } // Replace with actual token
    });
    await t.expect(response.status).eql(201);
    await t.expect(response.body).contains({ name: 'New Allowlist Entry' });
});

test('User cannot create a new allowlist entry', async t => {
    const response = await t.request({
        method: 'POST',
        url: '/api/allowlists',
        body: { name: 'New Allowlist Entry' },
        headers: { 'Authorization': 'Bearer <user_token>' } // Replace with actual token
    });
    await t.expect(response.status).eql(403);
});

test('Admin can retrieve all allowlist entries', async t => {
    const response = await t.request({
        method: 'GET',
        url: '/api/allowlists',
        headers: { 'Authorization': 'Bearer <admin_token>' } // Replace with actual token
    });
    await t.expect(response.status).eql(200);
    await t.expect(response.body).isArray();
});

test('Admin can retrieve a specific allowlist entry', async t => {
    const id = 'existing_id'; // Replace with an actual existing ID
    const response = await t.request({
        method: 'GET',
        url: `/api/allowlists/${id}`,
        headers: { 'Authorization': 'Bearer <admin_token>' } // Replace with actual token
    });
    await t.expect(response.status).eql(200);
    await t.expect(response.body).contains({ id });
});

test('Admin can update an existing allowlist entry', async t => {
    const id = 'existing_id'; // Replace with an actual existing ID
    const response = await t.request({
        method: 'PUT',
        url: `/api/allowlists/${id}`,
        body: { name: 'Updated Allowlist Entry' },
        headers: { 'Authorization': 'Bearer <admin_token>' } // Replace with actual token
    });
    await t.expect(response.status).eql(200);
    await t.expect(response.body).contains({ name: 'Updated Allowlist Entry' });
});

test('Admin can delete an existing allowlist entry', async t => {
    const id = 'existing_id'; // Replace with an actual existing ID
    const response = await t.request({
        method: 'DELETE',
        url: `/api/allowlists/${id}`,
        headers: { 'Authorization': 'Bearer <admin_token>' } // Replace with actual token
    });
    await t.expect(response.status).eql(204);
});

test('Admin can search allowlist entries', async t => {
    const response = await t.request({
        method: 'GET',
        url: '/api/allowlists/search?filter=value',
        headers: { 'Authorization': 'Bearer <admin_token>' } // Replace with actual token
    });
    await t.expect(response.status).eql(200);
    await t.expect(response.body).contains({ filter: 'value' });
});

test('Admin can access audit history of allowlist entries', async t => {
    const response = await t.request({
        method: 'GET',
        url: '/api/allowlists/audit-history',
        headers: { 'Authorization': 'Bearer <admin_token>' } // Replace with actual token
    });
    await t.expect(response.status).eql(200);
    await t.expect(response.body).isArray();
});

test('Admin receives 404 for invalid allowlist ID', async t => {
    const id = 'invalid_id'; // Replace with an invalid ID
    const response = await t.request({
        method: 'GET',
        url: `/api/allowlists/${id}`,
        headers: { 'Authorization': 'Bearer <admin_token>' } // Replace with actual token
    });
    await t.expect(response.status).eql(404);
});

test('Admin receives 400 for missing required fields', async t => {
    const response = await t.request({
        method: 'POST',
        url: '/api/allowlists',
        body: {}, // Missing required fields
        headers: { 'Authorization': 'Bearer <admin_token>' } // Replace with actual token
    });
    await t.expect(response.status).eql(400);
    await t.expect(response.body).contains({ message: 'Missing required fields' });
});

test('Admin receives 400 for invalid data types', async t => {
    const response = await t.request({
        method: 'POST',
        url: '/api/allowlists',
        body: { name: 12345 }, // Invalid data type
        headers: { 'Authorization': 'Bearer <admin_token>' } // Replace with actual token
    });
    await t.expect(response.status).eql(400);
    await t.expect(response.body).contains({ message: 'Validation errors' });
});

test('Admin access control for audit history', async t => {
    const response = await t.request({
        method: 'GET',
        url: '/api/allowlists/audit-history',
        headers: { 'Authorization': 'Bearer <non_admin_token>' } // Replace with a non-admin token
    });
    await t.expect(response.status).eql(403);
});

test('API rate limiting response', async t => {
    // Simulate multiple requests to hit the rate limit
    const response = await t.request({
        method: 'GET',
        url: '/api/allowlists',
        headers: { 'Authorization': 'Bearer <admin_token>' } // Replace with actual token
    });
    await t.expect(response.status).eql(429);
});