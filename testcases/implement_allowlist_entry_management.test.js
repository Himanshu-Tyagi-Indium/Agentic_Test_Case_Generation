fixture `Allowlist Entry Management Tests`
    .page `https://your-enterprise-security-platform.com/allowlist-management`;

test('Verify user with Allowlist Manager role can see existing allowlist entries', async t => {
    // Log in as a user with Allowlist Manager role
    await t
        .loginAsAllowlistManager() // Custom login function
        .navigateToAllowlistManagement(); // Custom function to navigate

    // Check if the allowlist entries are visible
    const entryList = Selector('.allowlist-entry-list');
    await t
        .expect(entryList.exists).ok()
        .expect(Selector('.create-entry-button').exists).ok()
        .expect(Selector('.modify-entry-button').exists).ok()
        .expect(Selector('.delete-entry-button').exists).ok();
});

test('Verify user can create a new allowlist entry', async t => {
    await t
        .loginAsAllowlistManager()
        .navigateToAllowlistManagement()
        .click(Selector('.create-entry-button'))
        .typeText(Selector('#entryName'), 'Test Entry')
        .typeText(Selector('#entryIP'), '192.168.1.1')
        .typeText(Selector('#entryDescription'), 'Test description')
        .click(Selector('#submit'));

    // Check if the new entry is visible in the list
    await t
        .expect(Selector('.allowlist-entry-list').innerText).contains('Test Entry');
});

test('Verify user can modify an existing allowlist entry', async t => {
    await t
        .loginAsAllowlistManager()
        .navigateToAllowlistManagement()
        .click(Selector('.modify-entry-button').withText('Test Entry')) // Modify the entry created in the previous test
        .typeText(Selector('#entryName'), 'Updated Entry', { replace: true })
        .click(Selector('#save'));

    // Check if the entry is updated
    await t
        .expect(Selector('.allowlist-entry-list').innerText).contains('Updated Entry');
});

test('Verify user can delete an allowlist entry', async t => {
    await t
        .loginAsAllowlistManager()
        .navigateToAllowlistManagement()
        .click(Selector('.delete-entry-button').withText('Updated Entry')) // Delete the entry modified in the previous test
        .click(Selector('#confirm-delete'));

    // Check if the entry is removed from the list
    await t
        .expect(Selector('.allowlist-entry-list').innerText).notContains('Updated Entry');
});

test('Verify access denied for users without Allowlist Manager role', async t => {
    await t
        .loginAsRegularUser() // Custom function for a regular user
        .navigateToAllowlistManagement();

    // Check for access denied message
    await t
        .expect(Selector('.access-denied-message').innerText).eql('Access Denied');
});

test('Verify search functionality for allowlist entries', async t => {
    await t
        .loginAsAllowlistManager()
        .navigateToAllowlistManagement()
        .typeText(Selector('#search-bar'), 'Test Entry');

    // Check if the search results match the query
    await t
        .expect(Selector('.allowlist-entry-list').innerText).contains('Test Entry');
});

test('Verify validation error for invalid data in Add Allowlist Entry form', async t => {
    await t
        .loginAsAllowlistManager()
        .navigateToAllowlistManagement()
        .click(Selector('.create-entry-button'))
        .typeText(Selector('#entryIP'), 'invalid-ip')
        .click(Selector('#submit'));

    // Check for validation error message
    await t
        .expect(Selector('.error-message').innerText).contains('Invalid IP address format');
});

test('Verify error message when deleting referenced entry', async t => {
    await t
        .loginAsAllowlistManager()
        .navigateToAllowlistManagement()
        .click(Selector('.delete-entry-button').withText('Referenced Entry')) // Assuming this entry is referenced
        .click(Selector('#confirm-delete'));

    // Check for error message
    await t
        .expect(Selector('.error-message').innerText).contains('This entry cannot be deleted because it is referenced by another rule.');
});

test('Verify pagination controls are visible when entry count exceeds limit', async t => {
    await t
        .loginAsAllowlistManager()
        .navigateToAllowlistManagement();

    // Ensure pagination controls are visible if entries exceed display limit
    await t
        .expect(Selector('.pagination-controls').exists).ok();
});

test('Verify logging of user actions for audit purposes', async t => {
    await t
        .loginAsAllowlistManager()
        .navigateToAllowlistManagement();

    // Perform an action
    await t
        .click(Selector('.create-entry-button'))
        .typeText(Selector('#entryName'), 'Audit Entry')
        .click(Selector('#submit'));

    // Check logs for user action
    await t
        .expect(Selector('.audit-log').innerText).contains('User created an entry: Audit Entry');
});