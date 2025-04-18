import { Selector } from 'testcafe';

fixture`API Endpoints for Allowlist Management`
    .page`http://your-api-endpoint.com`;

const apiUrl = '/allowlists';
const validAllowlistData = { name: 'Test Allowlist', description: 'This is a test allowlist.' };
let createdAllowlistId;

test('Create a new allowlist', async t => {
    const response = await t.request({
        method: 'POST',
        url: apiUrl,
        body: validAllowlistData,
        headers: { 'Authorization': 'Bearer your-auth-token' }
    });

    await t.expect(response.status).eql(201); // Check for 201 Created response
    createdAllowlistId = response.body.id; // Store the created allowlist ID for further tests
});

test('Get all allowlists', async t => {
    const response = await t.request({
        method: 'GET',
        url: apiUrl,
        headers: { 'Authorization': 'Bearer your-auth-token' }
    });

    await t.expect(response.status).eql(200); // Check for 200 OK response
    await t.expect(response.body).notEmpty(); // Ensure the response body is not empty
});

test('Get an existing allowlist by ID', async t => {
    const response = await t.request({
        method: 'GET',
        url: `${apiUrl}/${createdAllowlistId}`,
        headers: { 'Authorization': 'Bearer your-auth-token' }
    });

    await t.expect(response.status).eql(200); // Check for 200 OK response
    await t.expect(response.body.id).eql(createdAllowlistId); // Validate the allowlist ID
});

test('Update an existing allowlist', async t => {
    const updatedData = { name: 'Updated Allowlist', description: 'This is an updated allowlist.' };
    
    const response = await t.request({
        method: 'PUT',
        url: `${apiUrl}/${createdAllowlistId}`,
        body: updatedData,
        headers: { 'Authorization': 'Bearer your-auth-token' }
    });

    await t.expect(response.status).eql(200); // Check for 200 OK response
});

test('Delete an existing allowlist', async t => {
    const response = await t.request({
        method: 'DELETE',
        url: `${apiUrl}/${createdAllowlistId}`,
        headers: { 'Authorization': 'Bearer your-auth-token' }
    });

    await t.expect(response.status).eql(204); // Check for 204 No Content response
});

test('Get filtered allowlists', async t => {
    const response = await t.request({
        method: 'GET',
        url: `${apiUrl}?filter=name:Test`,
        headers: { 'Authorization': 'Bearer your-auth-token' }
    });

    await t.expect(response.status).eql(200); // Check for 200 OK response
    await t.expect(response.body).notEmpty(); // Ensure the response body is not empty
});

test('Unauthorized request to allowlist endpoint', async t => {
    const response = await t.request({
        method: 'GET',
        url: apiUrl,
    });

    await t.expect(response.status).eql(401); // Check for 401 Unauthorized response
});

test('Forbidden request to allowlist endpoint', async t => {
    const response = await t.request({
        method: 'GET',
        url: apiUrl,
        headers: { 'Authorization': 'Bearer unauthorized-token' }
    });

    await t.expect(response.status).eql(403); // Check for 403 Forbidden response
});

test('Create allowlist with missing required fields', async t => {
    const response = await t.request({
        method: 'POST',
        url: apiUrl,
        body: { name: '' }, // Missing description
        headers: { 'Authorization': 'Bearer your-auth-token' }
    });

    await t.expect(response.status).eql(400); // Check for 400 Bad Request response
    await t.expect(response.body.message).contains('description is required'); // Check for error message
});

test('Update allowlist with invalid data', async t => {
    const response = await t.request({
        method: 'PUT',
        url: `${apiUrl}/${createdAllowlistId}`,
        body: { name: '', description: 'Invalid update' }, // Invalid name
        headers: { 'Authorization': 'Bearer your-auth-token' }
    });

    await t.expect(response.status).eql(400); // Check for 400 Bad Request response
    await t.expect(response.body.message).contains('name is required'); // Check for error message
});

test('Delete a non-existing allowlist', async t => {
    const nonExistingId = '99999999';
    const response = await t.request({
        method: 'DELETE',
        url: `${apiUrl}/${nonExistingId}`,
        headers: { 'Authorization': 'Bearer your-auth-token' }
    });

    await t.expect(response.status).eql(404); // Check for 404 Not Found response
});

test('Get a non-existing allowlist by ID', async t => {
    const nonExistingId = '99999999';
    const response = await t.request({
        method: 'GET',
        url: `${apiUrl}/${nonExistingId}`,
        headers: { 'Authorization': 'Bearer your-auth-token' }
    });

    await t.expect(response.status).eql(404); // Check for 404 Not Found response
});