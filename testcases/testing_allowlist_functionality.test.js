fixture`Testing Allowlist Functionality`
    .page`https://your-enterprise-security-platform-url.com/allowlist`;

test('User can see form to add a new entry with fields for Value and Description', async t => {
    // Log in as a user with permission
    await t
        .navigateTo('/login')
        .typeText('#username', 'validUser')
        .typeText('#password', 'validPassword')
        .click('#loginButton')
        .navigateTo('/allowlist');

    // Verify the presence of the form
    await t
        .expect(Selector('#allowlistForm').visible).ok()
        .expect(Selector('#valueField').exists).ok()
        .expect(Selector('#descriptionField').exists).ok();
});

test('User can submit a valid entry to the Allowlist', async t => {
    await t
        .navigateTo('/allowlist')
        .typeText('#valueField', 'validValue')
        .typeText('#descriptionField', 'A valid description')
        .click('#submitButton');

    // Verify entry is added
    await t
        .expect(Selector('.allowlistEntry').withText('validValue').exists).ok();
});

test('User sees error message on attempting to submit a duplicate entry', async t => {
    await t
        .navigateTo('/allowlist')
        .typeText('#valueField', 'validValue') // Using an existing value
        .typeText('#descriptionField', 'Another description')
        .click('#submitButton');

    // Verify error message for duplicate entry
    await t
        .expect(Selector('.errorMessage').withText('Duplicate entries are not allowed').exists).ok();
});

test('System auto-escapes special characters in entry submission', async t => {
    await t
        .navigateTo('/allowlist')
        .typeText('#valueField', 'valueWithSpecialChars<>')
        .typeText('#descriptionField', 'Description with special chars')
        .click('#submitButton');

    // Verify entry is added correctly with escaped characters
    await t
        .expect(Selector('.allowlistEntry').withText('valueWithSpecialChars%3C%3E').exists).ok(); // Assuming %3C and %3E are the escaped versions
});

test('User can see added entry displayed with correct value and description', async t => {
    await t
        .navigateTo('/allowlist')
        .expect(Selector('.allowlistEntry').withText('validValue').exists).ok()
        .expect(Selector('.allowlistEntry').withText('A valid description').exists).ok();
});

test('User without permission sees access denied message on Allowlist page', async t => {
    // Log in as a user without permission
    await t
        .navigateTo('/login')
        .typeText('#username', 'userWithoutPermission')
        .typeText('#password', 'validPassword')
        .click('#loginButton')
        .navigateTo('/allowlist');

    // Verify access denied message
    await t
        .expect(Selector('.accessDeniedMessage').exists).ok();
});

test('API returns success response when adding a new Allowlist entry', async t => {
    const { body } = await t.request({
        url: 'https://your-api-endpoint.com/allowlist',
        method: 'POST',
        json: {
            value: 'newValidValue',
            description: 'Description for new entry'
        }
    });

    // Verify success response
    await t.expect(body.success).eql(true);
    await t.expect(body.entry.value).eql('newValidValue');
});

test('API returns error on duplicate value submission', async t => {
    const { body } = await t.request({
        url: 'https://your-api-endpoint.com/allowlist',
        method: 'POST',
        json: {
            value: 'validValue', // Using an existing value
            description: 'Another description'
        }
    });

    // Verify error response
    await t.expect(body.error).eql('Duplicate entries are not allowed');
});

test('API returns success response for entry with escaped characters', async t => {
    const { body } = await t.request({
        url: 'https://your-api-endpoint.com/allowlist',
        method: 'POST',
        json: {
            value: 'valueWithSpecialChars<>',
            description: 'Description with special chars'
        }
    });

    // Verify success response
    await t.expect(body.success).eql(true);
    await t.expect(body.entry.value).eql('valueWithSpecialChars%3C%3E'); // Assuming %3C and %3E are the escaped versions
});

test('User can delete an entry from the Allowlist', async t => {
    await t
        .navigateTo('/allowlist')
        .click(Selector('.deleteButton').withText('validValue')) // Assuming there's a delete button for the entry
        .expect(Selector('.allowlistEntry').withText('validValue').exists).notOk(); // Verify entry is removed
});

test('User sees validation error messages for required fields on submission', async t => {
    await t
        .navigateTo('/allowlist')
        .click('#submitButton'); // Attempt to submit without filling fields

    // Verify validation messages
    await t
        .expect(Selector('.errorMessage').withText('Value is required').exists).ok()
        .expect(Selector('.errorMessage').withText('Description is required').exists).ok();
});

test('User sees error message when editing entry to a duplicate value', async t => {
    await t
        .navigateTo('/allowlist')
        .click(Selector('.editButton').withText('firstEntry')) // Click the edit button for the first entry
        .typeText('#valueField', 'validValue') // Attempt to change to an existing value
        .click('#submitButton');

    // Verify error message for duplicate entry
    await t
        .expect(Selector('.errorMessage').withText('Duplicate entries are not allowed').exists).ok();
});

test('User can view all entries sorted by the value field', async t => {
    await t
        .navigateTo('/allowlist')
        .expect(Selector('.allowlistEntry').nth(0).innerText).lt(Selector('.allowlistEntry').nth(1).innerText); // Check sorting
});