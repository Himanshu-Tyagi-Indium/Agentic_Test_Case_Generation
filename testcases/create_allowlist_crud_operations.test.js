import { RequestMock, Selector } from 'testcafe';

const apiUrl = 'http://api.example.com/allowlist';

const validEntry = { entry: '192.168.1.1' };
const updatedEntry = { entry: '192.168.1.2' };
const invalidEntry = { }; // missing 'entry' field

const requestMock = RequestMock()
    .onRequestTo(apiUrl)
    .respond({ success: true }, 200, { 'Content-Type': 'application/json' });

fixture`Allowlist CRUD Operations`
    .page`${apiUrl}`; // This would normally point to a test page

test('Create allowlist entry with valid data', async t => {
    const response = await t.request({
        method: 'POST',
        url: apiUrl,
        body: validEntry,
        headers: { 'Content-Type': 'application/json' }
    });
    
    await t.expect(response.status).eql(201);
    await t.expect(response.body).contains(validEntry);
});

test('Retrieve all allowlist entries', async t => {
    const response = await t.request({
        method: 'GET',
        url: apiUrl,
        headers: { 'Content-Type': 'application/json' }
    });

    await t.expect(response.status).eql(200);
    await t.expect(response.body).typeOf('array');
});

test('Retrieve specific allowlist entry by ID', async t => {
    const id = '1'; // assume this ID exists
    const response = await t.request({
        method: 'GET',
        url: `${apiUrl}/${id}`,
        headers: { 'Content-Type': 'application/json' }
    });

    await t.expect(response.status).eql(200);
    await t.expect(response.body).contains({ id });
});

test('Update existing allowlist entry with valid data', async t => {
    const id = '1'; // assume this ID exists
    const response = await t.request({
        method: 'PUT',
        url: `${apiUrl}/${id}`,
        body: updatedEntry,
        headers: { 'Content-Type': 'application/json' }
    });

    await t.expect(response.status).eql(200);
    await t.expect(response.body).contains(updatedEntry);
});

test('Delete existing allowlist entry', async t => {
    const id = '1'; // assume this ID exists
    const response = await t.request({
        method: 'DELETE',
        url: `${apiUrl}/${id}`,
        headers: { 'Content-Type': 'application/json' }
    });

    await t.expect(response.status).eql(204);
});

test('Create allowlist entry with invalid data', async t => {
    const response = await t.request({
        method: 'POST',
        url: apiUrl,
        body: invalidEntry,
        headers: { 'Content-Type': 'application/json' }
    });

    await t.expect(response.status).eql(400);
});

test('Attempt CRUD operations without appropriate permissions', async t => {
    const response = await t.request({
        method: 'POST',
        url: apiUrl,
        body: validEntry,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer invalid_token' }
    });

    await t.expect(response.status).eql(403);
});

test('Retrieve all allowlist entries when there are none', async t => {
    const response = await t.request({
        method: 'GET',
        url: apiUrl,
        headers: { 'Content-Type': 'application/json' }
    });

    await t.expect(response.status).eql(200);
    await t.expect(response.body).eql([]);
});