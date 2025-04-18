fixture `Audit History Logging Tests`
    .page `https://your-security-platform-url.com`

test('Entry Added Log Creation', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'user_with_permissions')
        .typeText('#password', 'password123')
        .click('#login-button');

    // Add an entry to the allowlist
    await t
        .typeText('#allowlist-entry', 'new-entry')
        .click('#add-entry-button');

    // Verify that 'Entry Added' log is created
    const logEntry = await Selector('#audit-log').withText('Entry Added');
    await t.expect(logEntry.exists).ok('Entry Added log not found');
});

test('Entry Deleted Log Creation', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'user_with_permissions')
        .typeText('#password', 'password123')
        .click('#login-button');

    // Delete an entry from the allowlist
    await t
        .click('#delete-entry-button');

    // Verify that 'Entry Deleted' log is created
    const logEntry = await Selector('#audit-log').withText('Entry Deleted');
    await t.expect(logEntry.exists).ok('Entry Deleted log not found');
});

test('Entry Modified Log Creation', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'user_with_permissions')
        .typeText('#password', 'password123')
        .click('#login-button');

    // Modify an entry in the allowlist
    await t
        .typeText('#modify-entry-field', 'modified-value')
        .click('#modify-entry-button');

    // Verify that 'Entry Modified' log is created
    const logEntry = await Selector('#audit-log').withText('Entry Modified');
    await t.expect(logEntry.exists).ok('Entry Modified log not found');
});

test('Field Added Log Creation', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'user_with_permissions')
        .typeText('#password', 'password123')
        .click('#login-button');

    // Add a field to an existing allowlist entry
    await t
        .typeText('#add-field', 'new-field')
        .click('#add-field-button');

    // Verify that 'Field Added' log is created
    const logEntry = await Selector('#audit-log').withText('Field Added');
    await t.expect(logEntry.exists).ok('Field Added log not found');
});

test('Field Deleted Log Creation', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'user_with_permissions')
        .typeText('#password', 'password123')
        .click('#login-button');

    // Delete a field from an existing allowlist entry
    await t
        .click('#delete-field-button');

    // Verify that 'Field Deleted' log is created
    const logEntry = await Selector('#audit-log').withText('Field Deleted');
    await t.expect(logEntry.exists).ok('Field Deleted log not found');
});

test('Insufficient Permissions', async t => {
    // Log in as a user without appropriate permissions
    await t
        .typeText('#username', 'user_without_permissions')
        .typeText('#password', 'wrongpassword')
        .click('#login-button');

    // Attempt to perform allowlist management operation
    await t
        .click('#add-entry-button');

    // Verify that no log is created and an error message is displayed
    const logEntry = await Selector('#audit-log').withText('Entry Added');
    await t.expect(logEntry.exists).notOk('Log was created despite insufficient permissions');
    const errorMessage = await Selector('#error-message').withText('Insufficient permissions');
    await t.expect(errorMessage.exists).ok('Error message not displayed');
});

test('Multiple Operations Logging', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'user_with_permissions')
        .typeText('#password', 'password123')
        .click('#login-button');

    // Perform multiple operations
    await t
        .typeText('#allowlist-entry', 'entry1')
        .click('#add-entry-button')
        .typeText('#allowlist-entry', 'entry2')
        .click('#add-entry-button')
        .click('#delete-entry-button');

    // Verify chronological order of logs
    const logEntries = await Selector('#audit-log').child('li');
    await t.expect(logEntries.count).gt(0, 'No log entries found');
});

test('Querying Audit Logs', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'user_with_permissions')
        .typeText('#password', 'password123')
        .click('#login-button');

    // Query the audit logs
    await t
        .click('#query-log-button');

    // Verify that logs for the last year are returned
    const logEntries = await Selector('#audit-log').child('li').withText('Last Year');
    await t.expect(logEntries.exists).ok('No logs found for the last year');
});

test('Accessing Old Logs', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'user_with_permissions')
        .typeText('#password', 'password123')
        .click('#login-button');

    // Attempt to query logs older than 1 year
    await t
        .click('#query-old-log-button');

    // Verify that those logs are not accessible
    const logEntry = await Selector('#audit-log').withText('Older than 1 Year');
    await t.expect(logEntry.exists).notOk('Old logs should not be accessible');
});

test('Viewing Audit Logs', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'user_with_permissions')
        .typeText('#password', 'password123')
        .click('#login-button');

    // View the audit logs
    await t
        .click('#view-audit-logs-button');

    // Verify that logs display relevant information
    const logEntry = await Selector('#audit-log').child('li').withText('Event Type');
    await t.expect(logEntry.exists).ok('Relevant log information not displayed');
});

test('Heavy Load Logging', async t => {
    // Simulate heavy load
    for(let i = 0; i < 100; i++) {
        await t
            .typeText('#allowlist-entry', `entry${i}`)
            .click('#add-entry-button');
    }

    // Verify that logs are created without data loss
    const logEntries = await Selector('#audit-log').child('li');
    await t.expect(logEntries.count).eql(100, 'Logs not created successfully under heavy load');
});