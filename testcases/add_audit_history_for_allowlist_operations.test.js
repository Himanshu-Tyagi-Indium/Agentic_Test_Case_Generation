fixture `Audit History for Allowlist Operations`

test('Audit log creation when an entry is added to the allowlist', async t => {
    // Login as a user with appropriate permissions
    await t
        .navigateTo('/login')
        .typeText('#username', 'adminUser')
        .typeText('#password', 'password123')
        .click('#loginButton');

    // Add an entry to the allowlist
    await t
        .navigateTo('/allowlist')
        .typeText('#entryInput', 'testEntry')
        .click('#addEntryButton');

    // Verify that an audit log is created
    const logEntry = Selector('#auditLog').withText('added');
    await t.expect(logEntry.exists).ok();
});

test('Audit log creation when an entry is modified in the allowlist', async t => {
    // Login as a user with appropriate permissions
    await t
        .navigateTo('/login')
        .typeText('#username', 'adminUser')
        .typeText('#password', 'password123')
        .click('#loginButton');

    // Modify an existing entry in the allowlist
    await t
        .navigateTo('/allowlist')
        .click('#editEntryButton')
        .typeText('#entryInput', 'modifiedEntry', { replace: true })
        .click('#saveEntryButton');

    // Verify that an audit log is created
    const logEntry = Selector('#auditLog').withText('modified');
    await t.expect(logEntry.exists).ok();
});

test('Audit log creation when an entry is deleted from the allowlist', async t => {
    // Login as a user with appropriate permissions
    await t
        .navigateTo('/login')
        .typeText('#username', 'adminUser')
        .typeText('#password', 'password123')
        .click('#loginButton');

    // Delete an entry from the allowlist
    await t
        .navigateTo('/allowlist')
        .click('#deleteEntryButton');

    // Verify that an audit log is created
    const logEntry = Selector('#auditLog').withText('deleted');
    await t.expect(logEntry.exists).ok();
});

test('Audit log creation when an entry is enabled or disabled', async t => {
    // Login as a user with appropriate permissions
    await t
        .navigateTo('/login')
        .typeText('#username', 'adminUser')
        .typeText('#password', 'password123')
        .click('#loginButton');

    // Enable or disable an entry in the allowlist
    await t
        .navigateTo('/allowlist')
        .click('#toggleEntryButton');

    // Verify that an audit log is created
    const logEntry = Selector('#auditLog').withText('enabled or disabled');
    await t.expect(logEntry.exists).ok();
});

test('No audit log creation for users without appropriate permissions', async t => {
    // Login as a user without appropriate permissions
    await t
        .navigateTo('/login')
        .typeText('#username', 'normalUser')
        .typeText('#password', 'password123')
        .click('#loginButton');

    // Attempt to add an entry to the allowlist
    await t
        .navigateTo('/allowlist')
        .typeText('#entryInput', 'testEntry')
        .click('#addEntryButton');

    // Verify that no audit log is created
    const logEntry = Selector('#auditLog').withText('testEntry');
    await t.expect(logEntry.exists).notOk();
    await t.expect(Selector('#errorMessage').withText('insufficient permissions').exists).ok();
});

test('Audit log structure verification', async t => {
    // Login as a user with appropriate permissions
    await t
        .navigateTo('/login')
        .typeText('#username', 'adminUser')
        .typeText('#password', 'password123')
        .click('#loginButton');

    // Add an entry to trigger an audit log
    await t
        .navigateTo('/allowlist')
        .typeText('#entryInput', 'testEntry')
        .click('#addEntryButton');

    // Check if audit log contains required fields
    const logEntry = Selector('#auditLog').withText('added');
    await t.expect(logEntry.exists).ok();
    await t.expect(logEntry.innerText).contains('action type: added');
    await t.expect(logEntry.innerText).contains('entry details: testEntry');
    await t.expect(logEntry.innerText).contains('timestamp');
    await t.expect(logEntry.innerText).contains('user ID: adminUser');
});

test('Administrator access to audit logs', async t => {
    // Login as an administrator user
    await t
        .navigateTo('/login')
        .typeText('#username', 'adminUser')
        .typeText('#password', 'password123')
        .click('#loginButton');

    // Access the audit log
    await t
        .navigateTo('/audit-log');

    // Verify that the audit logs within the last year are displayed
    const logEntry = Selector('#auditLog').withText('added');
    await t.expect(logEntry.exists).ok();
});

test('Handling failures in the logging mechanism', async t => {
    // Simulate a failure in the logging mechanism
    await t
        .navigateTo('/simulate-failure');

    // Trigger an action that should fail
    await t.click('#triggerFailureButton');
    
    // Verify that an error message is shown
    await t.expect(Selector('#errorMessage').withText('Logging failure').exists).ok();
});

test('Sorting and filtering audit logs', async t => {
    // Login as an administrator user
    await t
        .navigateTo('/login')
        .typeText('#username', 'adminUser')
        .typeText('#password', 'password123')
        .click('#loginButton');

    // Access the audit log
    await t
        .navigateTo('/audit-log');

    // Sort and filter logs
    await t
        .click('#sortByDateButton')
        .click('#filterByActionTypeButton');

    // Verify that logs are sorted and filtered correctly
    const sortedLogEntry = Selector('#auditLog').withText('recentAction');
    await t.expect(sortedLogEntry.exists).ok();
});