import { Selector } from 'testcafe';

fixture `Audit History for Allowlist Management`
    .page `http://your-enterprise-security-platform-url.com`;

test('Audit entry is created when an entry is added to the allowlist', async t => {
    // Log in as an admin user
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Add an entry to the allowlist
    await t
        .typeText('#allowlistEntry', 'example.com')
        .click('#addEntryButton');

    // Check for audit entry creation
    const auditEntries = Selector('#auditLog');
    await t
        .expect(auditEntries.innerText).contains('Entry Added')
        .expect(auditEntries.innerText).contains('example.com');
});

test('Audit entry is created when an entry is deleted from the allowlist', async t => {
    // Log in as an admin user
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Delete an entry from the allowlist
    await t
        .click('#deleteEntryButton');

    // Check for audit entry creation
    const auditEntries = Selector('#auditLog');
    await t
        .expect(auditEntries.innerText).contains('Entry Deleted');
});

test('Audit entry is created when an entry is modified in the allowlist', async t => {
    // Log in as an admin user
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Modify an entry in the allowlist
    await t
        .typeText('#allowlistEntry', 'example-modified.com')
        .click('#modifyEntryButton');

    // Check for audit entry creation
    const auditEntries = Selector('#auditLog');
    await t
        .expect(auditEntries.innerText).contains('Entry Modified')
        .expect(auditEntries.innerText).contains('example-modified.com');
});

test('Non-admin user receives error message for insufficient permissions', async t => {
    // Log in as a non-admin user
    await t
        .typeText('#username', 'nonAdminUser')
        .typeText('#password', 'nonAdminPassword')
        .click('#loginButton');

    // Attempt to add an entry to the allowlist
    await t
        .typeText('#allowlistEntry', 'example.com')
        .click('#addEntryButton');

    // Check for error message and absence of audit entry
    const errorMessage = Selector('#errorMessage');
    await t
        .expect(errorMessage.innerText).contains('Insufficient permissions')
        .expect(Selector('#auditLog').innerText).notContains('Entry Added');
});

test('Admin user views audit history', async t => {
    // Log in as an admin user
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // View audit history
    await t
        .click('#viewAuditHistoryButton');

    // Check for presence of audit entries
    const auditEntries = Selector('#auditLog');
    await t
        .expect(auditEntries.innerText).contains('Entry Added')
        .expect(auditEntries.innerText).contains('Entry Deleted')
        .expect(auditEntries.innerText).contains('Entry Modified');
});

test('Old audit log entries are automatically deleted', async t => {
    // Simulate the passage of time and check for log entry deletion
    // This requires a predefined set of older entries to test against
    const oldAuditEntries = Selector('#auditLogOld');
    await t
        .expect(oldAuditEntries.innerText).notContains('Old Entry'); // Assuming 'Old Entry' was supposed to be removed
});

test('Audit entry timestamp reflects current date and time accurately', async t => {
    // Log in as an admin user
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Add an entry to the allowlist
    await t
        .typeText('#allowlistEntry', 'example.com')
        .click('#addEntryButton');

    // Verify the timestamp of the latest audit entry
    const auditEntries = Selector('#auditLog');
    const timestamp = await auditEntries.child('timestamp').innerText; // Assuming there's a timestamp element
    await t
        .expect(new Date(timestamp).getTime()).gte(Date.now() - 60000); // Check if the timestamp is within the last minute
});

test('Admin user filters audit history by action type', async t => {
    // Log in as an admin user
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Filter audit history by action type
    await t
        .click('#filterByActionType')
        .click(Selector('option').withText('Entry Added'));

    // Check for filtered audit entries
    const auditEntries = Selector('#auditLog');
    await t
        .expect(auditEntries.innerText).contains('Entry Added')
        .expect(auditEntries.innerText).notContains('Entry Deleted')
        .expect(auditEntries.innerText).notContains('Entry Modified');
});

test('Admin user exports audit history', async t => {
    // Log in as an admin user
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Request to export audit history
    await t
        .click('#exportAuditHistoryButton');

    // Check for export confirmation
    const exportConfirmation = Selector('#exportConfirmation');
    await t
        .expect(exportConfirmation.innerText).contains('Export successful');
});