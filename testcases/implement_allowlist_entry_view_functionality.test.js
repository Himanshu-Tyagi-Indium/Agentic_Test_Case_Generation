fixture`Allowlist Entry View Functionality Tests`
    .page`https://your-enterprise-security-platform-url`

test('Display allowlist entry details correctly', async t => {
    // Login as an authenticated user with necessary permissions
    await t
        .useRole(userWithPermissions)
        .navigateTo('/allowlist');

    // Select an existing allowlist entry
    await t
        .click(Selector('.allowlist-entry').withText('Example Entry'));

    // Verify the entry details are displayed
    await t
        .expect(Selector('.entry-name').innerText).eql('Example Entry')
        .expect(Selector('.entry-type').innerText).eql('Type A')
        .expect(Selector('.created-date').innerText).eql('2023-01-01')
        .expect(Selector('.status').innerText).eql('Active');
});

test('Redirect to modify entry page with pre-filled details', async t => {
    await t
        .useRole(userWithPermissions)
        .navigateTo('/allowlist')
        .click(Selector('.allowlist-entry').withText('Example Entry'))
        .click(Selector('.modify-button'));

    // Check if redirected to modify page
    await t
        .expect(Selector('.modify-entry-form').exists).ok()
        .expect(Selector('#entry-name').value).eql('Example Entry')
        .expect(Selector('#entry-type').value).eql('Type A');
});

test('Confirm deletion of allowlist entry', async t => {
    await t
        .useRole(userWithPermissions)
        .navigateTo('/allowlist')
        .click(Selector('.allowlist-entry').withText('Example Entry'))
        .click(Selector('.delete-button'));

    // Confirm deletion
    await t
        .click(Selector('.confirm-delete'));

    // Verify entry is deleted
    await t
        .expect(Selector('.allowlist-entry').withText('Example Entry').exists).notOk();
});

test('Disable allowlist entry', async t => {
    await t
        .useRole(userWithPermissions)
        .navigateTo('/allowlist')
        .click(Selector('.allowlist-entry').withText('Example Entry'))
        .click(Selector('.disable-button'));

    // Verify status change and success message
    await t
        .expect(Selector('.status').innerText).eql('Disabled')
        .expect(Selector('.success-message').innerText).eql('Entry successfully disabled.');
});

test('Insufficient permissions error when modifying, deleting, or disabling', async t => {
    await t
        .useRole(userWithoutPermissions)
        .navigateTo('/allowlist')
        .click(Selector('.allowlist-entry').withText('Example Entry'));

    // Attempt to modify without permissions
    await t
        .click(Selector('.modify-button'))
        .expect(Selector('.error-message').innerText).eql('Insufficient permissions.');

    // Attempt to delete without permissions
    await t
        .click(Selector('.delete-button'))
        .expect(Selector('.error-message').innerText).eql('Insufficient permissions.');

    // Attempt to disable without permissions
    await t
        .click(Selector('.disable-button'))
        .expect(Selector('.error-message').innerText).eql('Insufficient permissions.');
});

test('Show loading spinner while entry details are loading', async t => {
    await t
        .useRole(userWithPermissions)
        .navigateTo('/allowlist')
        .click(Selector('.allowlist-entry').withText('Example Entry'));

    // Check for loading spinner before details are fully loaded
    await t
        .expect(Selector('.loading-spinner').visible).ok()
        .expect(Selector('.loading-spinner').visible).notOk({ timeout: 5000 }); // Wait for spinner to disappear
});

test('Display error message if entry does not exist', async t => {
    await t
        .useRole(userWithPermissions)
        .navigateTo('/allowlist')
        .click(Selector('.allowlist-entry').withText('Non-existent Entry'));

    // Verify error message for non-existing entry
    await t
        .expect(Selector('.error-message').innerText).eql('Entry could not be found.');
});

test('Correct formatting of entry details', async t => {
    await t
        .useRole(userWithPermissions)
        .navigateTo('/allowlist')
        .click(Selector('.allowlist-entry').withText('Example Entry'));

    // Verify correct formatting of entry details
    await t
        .expect(Selector('.entry-name').innerText).match(/^[A-Za-z0-9\s]+$/) // Validate name format
        .expect(Selector('.entry-type').innerText).match(/^[A-Za-z\s]+$/) // Validate type format
        .expect(Selector('.created-date').innerText).match(/^\d{4}-\d{2}-\d{2}$/) // Validate date format
        .expect(Selector('.status').innerText).eql('Active'); // Validate status
});

test('Return to previous page without loss of context', async t => {
    await t
        .useRole(userWithPermissions)
        .navigateTo('/allowlist')
        .click(Selector('.allowlist-entry').withText('Example Entry'))
        .click(Selector('.close-button'));

    // Verify the user returns to the allowlist page
    await t
        .expect(Selector('.allowlist-page').visible).ok();
});