fixture`Allowlist Entry Modification Tests`
    .page`https://example.com/allowlist-management`; // Replace with the actual URL of the Allowlist Management UI

test('Authenticated user sees a list of existing allowlist entries with edit options', async t => {
    // Assume user is already authenticated
    await t
        .navigateTo('/allowlist-management') // Navigate to the Allowlist Management UI
        .expect(Selector('.allowlist-entry').count).gt(0) // Verify there are existing entries
        .expect(Selector('.edit-button').count).gt(0); // Verify there are options to edit
});

test('User clicks Edit button and sees pre-filled form', async t => {
    await t
        .click(Selector('.edit-button').nth(0)) // Click the first edit button
        .expect(Selector('#ip-address').value).notEql('') // Check IP address field is pre-filled
        .expect(Selector('#comments').value).notEql(''); // Check comments field is pre-filled
});

test('User updates IP address and submits form', async t => {
    await t
        .click(Selector('.edit-button').nth(0)) // Click the first edit button
        .typeText('#ip-address', '192.168.1.100', { replace: true }) // Change IP address
        .click('#submit-button') // Submit the form
        .expect(Selector('.success-message').innerText).contains('Entry has been updated') // Check for success message
        .expect(Selector('.allowlist-entry').withText('192.168.1.100').exists).ok(); // Verify updated entry appears in the list
});

test('User disables an entry and submits the form', async t => {
    await t
        .click(Selector('.edit-button').nth(0)) // Click the first edit button
        .click('#disable-entry') // Check the disable entry option
        .click('#submit-button') // Submit the form
        .expect(Selector('.allowlist-entry').withText('Disabled').exists).ok(); // Verify entry is marked as disabled
});

test('User adds or modifies comments and submits the form', async t => {
    await t
        .click(Selector('.edit-button').nth(0)) // Click the first edit button
        .typeText('#comments', 'Updated comment', { replace: true }) // Update comments
        .click('#submit-button') // Submit the form
        .expect(Selector('.allowlist-entry').withText('Updated comment').exists).ok(); // Verify updated comments
});

test('User submits form with empty required field and sees validation error', async t => {
    await t
        .click(Selector('.edit-button').nth(0)) // Click the first edit button
        .typeText('#ip-address', '', { replace: true }) // Leave IP address empty
        .click('#submit-button') // Submit the form
        .expect(Selector('.error-message').innerText).contains('IP address is required'); // Check for validation error
});

test('User inputs invalid IP address and sees validation error', async t => {
    await t
        .click(Selector('.edit-button').nth(0)) // Click the first edit button
        .typeText('#ip-address', 'invalid-ip', { replace: true }) // Enter invalid IP address
        .click('#submit-button') // Submit the form
        .expect(Selector('.error-message').innerText).contains('IP address is not valid'); // Check for validation error
});

test('User without permission sees unauthorized access message', async t => {
    // Assume user is not authenticated or doesn't have permission
    await t
        .navigateTo('/allowlist-management') // Navigate to the Allowlist Management UI
        .expect(Selector('.unauthorized-message').innerText).contains('Unauthorized access'); // Verify unauthorized message
});

test('User modifies an entry successfully and sees confirmation message', async t => {
    await t
        .click(Selector('.edit-button').nth(0)) // Click the first edit button
        .typeText('#ip-address', '192.168.1.101', { replace: true }) // Change IP address
        .click('#submit-button') // Submit the form
        .expect(Selector('.success-message').innerText).contains('Entry has been updated'); // Check for success message
});

test('User cancels editing and is redirected back without changes', async t => {
    await t
        .click(Selector('.edit-button').nth(0)) // Click the first edit button
        .click('#cancel-button') // Click cancel button
        .expect(Selector('.allowlist-entry').count).gt(0); // Verify user is back to the entry list
});

test('Updated entry reflects latest changes after page refresh', async t => {
    await t
        .navigateTo('/allowlist-management') // Navigate to the Allowlist Management UI
        .expect(Selector('.allowlist-entry').withText('192.168.1.101').exists).ok(); // Verify updated entry is present
});

test('System handles rapid modifications to an entry correctly', async t => {
    await t
        .click(Selector('.edit-button').nth(0)) // Click the first edit button
        .typeText('#ip-address', '192.168.1.102', { replace: true }) // Change IP address
        .click('#submit-button') // Submit the form
        .typeText('#comments', 'Rapid update', { replace: true }) // Update comments
        .click('#submit-button') // Submit again
        .expect(Selector('.success-message').innerText).contains('Entry has been updated'); // Check for success message
});