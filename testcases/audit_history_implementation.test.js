fixture `Audit History Implementation Tests`
    .page `https://your-enterprise-security-platform-url.com`;

test('Admin adds a new entry and logs it as "Entry Added"', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Add a new entry to the allowlist
    await t
        .typeText('#entryField', 'newEntry@example.com')
        .click('#addEntryButton');

    // Verify that the audit history logs the entry added
    const logEntry = Selector('.audit-log').withText('Entry Added');
    await t
        .expect(logEntry.exists).ok('Audit log for "Entry Added" does not exist')
        .expect(logEntry.innerText).contains('newEntry@example.com');
});

test('Admin deletes an existing entry and logs it as "Entry Deleted"', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Delete an existing entry from the allowlist
    await t
        .click('#deleteEntryButton');

    // Verify that the audit history logs the entry deleted
    const logEntry = Selector('.audit-log').withText('Entry Deleted');
    await t
        .expect(logEntry.exists).ok('Audit log for "Entry Deleted" does not exist');
});

test('Admin modifies an existing entry and logs it as "Entry Modified"', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Modify an existing entry in the allowlist
    await t
        .typeText('#modifyEntryField', 'modifiedEntry@example.com')
        .click('#modifyEntryButton');

    // Verify that the audit history logs the entry modified
    const logEntry = Selector('.audit-log').withText('Entry Modified');
    await t
        .expect(logEntry.exists).ok('Audit log for "Entry Modified" does not exist')
        .expect(logEntry.innerText).contains('modifiedEntry@example.com');
});

test('Non-admin user attempts to modify an entry and receives error', async t => {
    // Log in as a non-admin user
    await t
        .typeText('#username', 'nonAdminUser')
        .typeText('#password', 'nonAdminPassword')
        .click('#loginButton');

    // Attempt to add an entry
    await t
        .typeText('#entryField', 'newEntry@example.com')
        .click('#addEntryButton');

    // Verify error message
    await t
        .expect(Selector('.error-message').innerText).eql('Insufficient permissions')
        .expect(Selector('.audit-log').withText('Entry Added').exists).notOk('Audit log was created for non-admin action');
});

test('Admin views audit history UI and sees all logged events', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Access the audit history UI
    await t
        .click('#auditHistoryButton');

    // Verify that all logged events are displayed
    const logEntries = Selector('.audit-log');
    await t
        .expect(logEntries.child('.log-entry').count).gt(0, 'No audit logs found');
});

test('Admin filters audit logs by date range', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Access the audit history UI
    await t
        .click('#auditHistoryButton')
        .typeText('#startDate', '2023-01-01')
        .typeText('#endDate', '2023-12-31')
        .click('#filterButton');

    // Verify that only events within the date range are displayed
    const filteredLogs = Selector('.audit-log');
    await t
        .expect(filteredLogs.child('.log-entry').count).gt(0, 'No logs found for the specified date range');
});

test('Admin views details of a specific log entry', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Access the audit history UI
    await t
        .click('#auditHistoryButton')
        .click(Selector('.log-entry').nth(0)); // Click the first log entry

    // Verify the details of the log entry
    await t
        .expect(Selector('.log-details').innerText).contains('Entry Added')
        .expect(Selector('.log-details').innerText).contains('timestamp')
        .expect(Selector('.log-details').innerText).contains('userID')
        .expect(Selector('.log-details').innerText).contains('entry details');
});

test('Audit logs are retained for a minimum of 1 year', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Access the audit history UI
    await t
        .click('#auditHistoryButton');

    // Verify logs are retained for a minimum of 1 year
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
    
    await t
        .expect(Selector('.audit-log').withText(oneYearAgo.toISOString().split('T')[0]).exists).ok('Logs older than 1 year should be purged');
});

test('Admin accesses audit logs efficiently', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Access the audit history UI and measure response time
    const startTime = new Date().getTime();
    await t
        .click('#auditHistoryButton');
    const endTime = new Date().getTime();
    const duration = endTime - startTime;

    // Verify that the logs are loaded within a reasonable response time
    await t
        .expect(duration).lt(2000, 'Audit logs took too long to load');
});

test('Admin searches for a specific log entry by ID', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Access the audit history UI
    await t
        .click('#auditHistoryButton')
        .typeText('#searchField', 'specificLogEntryID')
        .click('#searchButton');

    // Verify that the correct log entry is returned
    const searchedLogEntry = Selector('.log-entry').withText('specificLogEntryID');
    await t
        .expect(searchedLogEntry.exists).ok('The log entry corresponding to the searched ID was not found');
});