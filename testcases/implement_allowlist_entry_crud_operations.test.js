fixture`Allowlist Entry CRUD Operations`
    .page`http://enterprise-security-platform-url.com`;

test('Admin creates a new allowlist entry with valid data', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Create new allowlist entry
    await t
        .typeText('#ipAddress', '192.168.1.1')
        .typeText('#description', 'Test Allowlist Entry')
        .click('#createButton')
        .expect(Selector('#successMessage').innerText)
        .eql('Allowlist entry created successfully');
});

test('Admin attempts to create a new allowlist entry with invalid data', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Attempt to create new allowlist entry with invalid IP
    await t
        .typeText('#ipAddress', 'invalidIP')
        .typeText('#description', 'Invalid Entry')
        .click('#createButton')
        .expect(Selector('#errorMessage').innerText)
        .eql('Validation failed: Invalid IP address format');
});

test('Admin views existing allowlist entries', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // View allowlist entries
    await t
        .click('#viewAllowlistButton')
        .expect(Selector('#allowlistTable').child('tr').count).gt(0);
});

test('User attempts to view allowlist entries', async t => {
    // Log in as User
    await t
        .typeText('#username', 'normalUser')
        .typeText('#password', 'userPassword')
        .click('#loginButton');

    // Attempt to view allowlist entries
    await t
        .click('#viewAllowlistButton')
        .expect(Selector('#unauthorizedMessage').innerText)
        .eql('Unauthorized access');
});

test('Admin updates an existing allowlist entry with valid data', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Update existing allowlist entry
    await t
        .click('#editButton_1') // Assuming ID 1 for the entry
        .typeText('#ipAddress', '192.168.1.2', { replace: true })
        .click('#updateButton')
        .expect(Selector('#successMessage').innerText)
        .eql('Allowlist entry updated successfully');
});

test('Admin attempts to update an existing allowlist entry with invalid data', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Attempt to update existing allowlist entry with invalid IP
    await t
        .click('#editButton_1') // Assuming ID 1 for the entry
        .typeText('#ipAddress', 'invalidIP', { replace: true })
        .click('#updateButton')
        .expect(Selector('#errorMessage').innerText)
        .eql('Validation failed: Invalid IP address format');
});

test('Admin deletes an existing allowlist entry', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Delete existing allowlist entry
    await t
        .click('#deleteButton_1') // Assuming ID 1 for the entry
        .expect(Selector('#successMessage').innerText)
        .eql('Allowlist entry deleted successfully');
});

test('User attempts to delete an allowlist entry', async t => {
    // Log in as User
    await t
        .typeText('#username', 'normalUser')
        .typeText('#password', 'userPassword')
        .click('#loginButton');

    // Attempt to delete allowlist entry
    await t
        .click('#deleteButton_1') // Assuming ID 1 for the entry
        .expect(Selector('#unauthorizedMessage').innerText)
        .eql('Unauthorized access');
});

test('Admin performs CRUD operations and checks for immediate reflection', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Create new allowlist entry
    await t
        .typeText('#ipAddress', '192.168.1.3')
        .typeText('#description', 'Temporary Entry')
        .click('#createButton')
        .expect(Selector('#successMessage').innerText)
        .eql('Allowlist entry created successfully');

    // Check if the new entry is reflected in the list
    await t
        .click('#viewAllowlistButton')
        .expect(Selector('#allowlistTable').innerText).contains('192.168.1.3');
});

test('Admin actions are logged for audit purposes', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Create new allowlist entry
    await t
        .typeText('#ipAddress', '192.168.1.4')
        .typeText('#description', 'Audit Entry')
        .click('#createButton');

    // Check logs for the action
    await t
        .click('#viewLogsButton')
        .expect(Selector('#logsTable').innerText).contains('Created entry for user adminUser');
});

test('CRUD operations adhere to RBAC policies', async t => {
    // Log in as Admin
    await t
        .typeText('#username', 'adminUser')
        .typeText('#password', 'adminPassword')
        .click('#loginButton');

    // Attempt to create a new entry
    await t
        .typeText('#ipAddress', '192.168.1.5')
        .typeText('#description', 'RBAC Test Entry')
        .click('#createButton')
        .expect(Selector('#successMessage').innerText)
        .eql('Allowlist entry created successfully');

    // Log out and log in as User
    await t
        .click('#logoutButton')
        .typeText('#username', 'normalUser')
        .typeText('#password', 'userPassword')
        .click('#loginButton');

    // Attempt to create an entry
    await t
        .typeText('#ipAddress', '192.168.1.6')
        .typeText('#description', 'User RBAC Entry')
        .click('#createButton')
        .expect(Selector('#unauthorizedMessage').innerText)
        .eql('Unauthorized access');
});