import { Selector } from 'testcafe';

fixture `Public API Endpoints for Allowlisting`
    .page `https://your-api-endpoint.com`; // Replace with actual API endpoint

const validToken = 'your-valid-auth-token'; // Replace with actual valid token
let allowlistEntryId;

test('Create allowlist entry', async t => {
    const response = await t.request({
        method: 'POST',
        url: '/allowlist',
        body: {
            entryData: 'valid entry data' // Replace with actual entry data
        },
        headers: {
            'Authorization': `Bearer ${validToken}`
        }
    });

    await t.expect(response.status).eql(201);
    await t.expect(response.body).contains('entryData'); // Adjust based on response structure
    allowlistEntryId = response.body.id; // Save the created entry ID for future tests
});

test('View allowlist entry', async t => {
    const response = await t.request({
        method: 'GET',
        url: `/allowlist/${allowlistEntryId}`,
        headers: {
            'Authorization': `Bearer ${validToken}`
        }
    });

    await t.expect(response.status).eql(200);
    await t.expect(response.body.id).eql(allowlistEntryId);
});

test('Update allowlist entry', async t => {
    const response = await t.request({
        method: 'PUT',
        url: `/allowlist/${allowlistEntryId}`,
        body: {
            entryData: 'updated valid entry data' // Replace with actual updated data
        },
        headers: {
            'Authorization': `Bearer ${validToken}`
        }
    });

    await t.expect(response.status).eql(200);
    await t.expect(response.body.entryData).eql('updated valid entry data'); // Adjust based on response structure
});

test('Delete allowlist entry', async t => {
    const response = await t.request({
        method: 'DELETE',
        url: `/allowlist/${allowlistEntryId}`,
        headers: {
            'Authorization': `Bearer ${validToken}`
        }
    });

    await t.expect(response.status).eql(204);

    // Verify the entry is no longer retrievable
    const getResponse = await t.request({
        method: 'GET',
        url: `/allowlist/${allowlistEntryId}`,
        headers: {
            'Authorization': `Bearer ${validToken}`
        }
    });

    await t.expect(getResponse.status).eql(404);
});

test('Filter allowlist entries', async t => {
    const response = await t.request({
        method: 'GET',
        url: '/allowlist?status=active', // Example filter
        headers: {
            'Authorization': `Bearer ${validToken}`
        }
    });

    await t.expect(response.status).eql(200);
    await t.expect(response.body).contains('active'); // Adjust based on expected response
});

test('Retrieve audit history', async t => {
    const response = await t.request({
        method: 'GET',
        url: '/allowlist/audit',
        headers: {
            'Authorization': `Bearer ${validToken}`
        }
    });

    await t.expect(response.status).eql(200);
    await t.expect(response.body).contains('auditDetails'); // Adjust based on expected response
});

test('Create allowlist entry with invalid data', async t => {
    const response = await t.request({
        method: 'POST',
        url: '/allowlist',
        body: {
            // Missing required fields
        },
        headers: {
            'Authorization': `Bearer ${validToken}`
        }
    });

    await t.expect(response.status).eql(400);
    await t.expect(response.body).contains('validation issue'); // Adjust based on actual error message
});

test('View non-existing allowlist entry', async t => {
    const response = await t.request({
        method: 'GET',
        url: `/allowlist/non-existing-id`, // Use a dummy ID
        headers: {
            'Authorization': `Bearer ${validToken}`
        }
    });

    await t.expect(response.status).eql(404);
    await t.expect(response.body).contains('not found'); // Adjust based on actual error message
});

test('Delete allowlist entry without permissions', async t => {
    const response = await t.request({
        method: 'DELETE',
        url: `/allowlist/${allowlistEntryId}`,
        headers: {
            // Simulate no permissions (incorrect token or none at all)
            'Authorization': `Bearer invalid-token`
        }
    });

    await t.expect(response.status).eql(403);
    await t.expect(response.body).contains('insufficient permissions'); // Adjust based on actual error message
});

test('Get all allowlist entries without filters', async t => {
    const response = await t.request({
        method: 'GET',
        url: '/allowlist',
        headers: {
            'Authorization': `Bearer ${validToken}`
        }
    });

    await t.expect(response.status).eql(200);
    await t.expect(response.body).notEql([]); // Verify that entries are returned
});