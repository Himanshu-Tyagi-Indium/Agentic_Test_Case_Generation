fixture `RBAC for Allowlisting Management`
    .page `https://your-enterprise-security-platform-url.com`;

test('Global Tuning Admin has full access to allowlisting management features', async t => {
    await t
        .loginAsGlobalTuningAdmin() // Custom function to log in as Global Tuning Admin
        .navigateToAllowlistingSection()
        .expect(Selector('#allowlist-management').visible).ok() // Check if management UI is visible
        .expect(Selector('#add-entry').visible).ok() // Check for add entry option
        .expect(Selector('#edit-entry').visible).ok() // Check for edit entry option
        .expect(Selector('#delete-entry').visible).ok(); // Check for delete entry option
});

test('Rule Tuning Admin can view and manage allowlist entries but cannot delete', async t => {
    await t
        .loginAsRuleTuningAdmin() // Custom function to log in as Rule Tuning Admin
        .navigateToAllowlistingSection()
        .expect(Selector('#allowlist-entries').visible).ok() // Check if entries are visible
        .expect(Selector('#delete-entry').visible).notOk(); // Delete option should not be visible
});

test('Rule Tuning Developer can only view allowlist entries', async t => {
    await t
        .loginAsRuleTuningDeveloper() // Custom function to log in as Rule Tuning Developer
        .navigateToAllowlistingSection()
        .expect(Selector('#allowlist-entries').visible).ok() // Check if entries are visible
        .expect(Selector('#add-entry').visible).notOk() // Add option should not be visible
        .expect(Selector('#edit-entry').visible).notOk() // Edit option should not be visible
        .expect(Selector('#delete-entry').visible).notOk(); // Delete option should not be visible
});

test('User with no assigned role receives Access Denied message', async t => {
    await t
        .loginAsNoRoleUser() // Custom function to log in as user with no role
        .navigateToAllowlistingSection()
        .expect(Selector('#access-denied-message').innerText).eql('Access Denied'); // Check for access denied message
});

test('Global Tuning Admin must fill mandatory fields when adding an allowlist entry', async t => {
    await t
        .loginAsGlobalTuningAdmin() // Log in as Global Tuning Admin
        .navigateToAllowlistingSection()
        .click(Selector('#add-entry')) // Click the add entry button
        .click(Selector('#submit-entry')) // Attempt to submit without filling fields
        .expect(Selector('#mandatory-fields-message').visible).ok(); // Check for mandatory fields error message
});

test('Rule Tuning Admin receives Insufficient Permissions message when trying to delete an entry', async t => {
    await t
        .loginAsRuleTuningAdmin() // Log in as Rule Tuning Admin
        .navigateToAllowlistingSection()
        .click(Selector('#delete-entry')) // Click to delete an entry
        .expect(Selector('#insufficient-permissions-message').innerText).eql('Insufficient Permissions'); // Check for insufficient permissions message
});

test('Rule Tuning Developer receives Insufficient Permissions message when trying to edit an entry', async t => {
    await t
        .loginAsRuleTuningDeveloper() // Log in as Rule Tuning Developer
        .navigateToAllowlistingSection()
        .click(Selector('#edit-entry')) // Attempt to edit an entry
        .expect(Selector('#insufficient-permissions-message').innerText).eql('Insufficient Permissions'); // Check for insufficient permissions message
});

test('Global Tuning Admin can modify an allowlist entry', async t => {
    await t
        .loginAsGlobalTuningAdmin() // Log in as Global Tuning Admin
        .navigateToAllowlistingSection()
        .click(Selector('#edit-entry')) // Click to edit an entry
        .typeText(Selector('#entry-name'), 'Updated Entry Name') // Modify the entry
        .click(Selector('#submit-entry')) // Submit the changes
        .expect(Selector('#allowlist-entry').innerText).contains('Updated Entry Name'); // Verify the entry is updated
});

test('All users can view allowlist entries with proper pagination', async t => {
    await t
        .loginAsGlobalTuningAdmin() // Log in as any user to check entries
        .navigateToAllowlistingSection()
        .expect(Selector('#allowlist-entries').child('li').count).gt(0) // Check that there are entries
        .expect(Selector('.pagination').visible).ok(); // Check that pagination is visible
});

test('Global Tuning Admin sees all management options in UI', async t => {
    await t
        .loginAsGlobalTuningAdmin() // Log in as Global Tuning Admin
        .navigateToAllowlistingSection()
        .expect(Selector('#add-entry').visible).ok() // Check for add option
        .expect(Selector('#edit-entry').visible).ok() // Check for edit option
        .expect(Selector('#delete-entry').visible).ok() // Check for delete option
        .expect(Selector('#view-entry').visible).ok(); // Check for view option
});