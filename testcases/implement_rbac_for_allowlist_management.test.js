fixture `RBAC for Allowlist Management Tests`
    .page `https://example.com/allowlist-management`;

test('Global Tuning Admin can view, manage, and administer allowlist entries', async t => {
    // Log in as Global Tuning Admin
    await t
        .typeText('#username', 'global_admin')
        .typeText('#password', 'password123')
        .click('#login');

    // Access Allowlist Management page
    await t
        .navigateTo(`https://example.com/allowlist-management`);

    // Check for presence of options
    await t
        .expect(Selector('#view-option').visible).ok()
        .expect(Selector('#manage-option').visible).ok()
        .expect(Selector('#administer-option').visible).ok();
});

test('Rule Tuning Admin can view and manage allowlist entries but not administer', async t => {
    // Log in as Rule Tuning Admin
    await t
        .typeText('#username', 'rule_admin')
        .typeText('#password', 'password123')
        .click('#login');

    // Access Allowlist Management page
    await t
        .navigateTo(`https://example.com/allowlist-management`);

    // Check for presence of options
    await t
        .expect(Selector('#view-option').visible).ok()
        .expect(Selector('#manage-option').visible).ok()
        .expect(Selector('#administer-option').visible).notOk();
});

test('Rule Tuning Developer can only view allowlist entries', async t => {
    // Log in as Rule Tuning Developer
    await t
        .typeText('#username', 'rule_developer')
        .typeText('#password', 'password123')
        .click('#login');

    // Access Allowlist Management page
    await t
        .navigateTo(`https://example.com/allowlist-management`);

    // Check for presence of options
    await t
        .expect(Selector('#view-option').visible).ok()
        .expect(Selector('#manage-option').visible).notOk()
        .expect(Selector('#administer-option').visible).notOk();
});

test('User without roles sees Access Denied message', async t => {
    // Log in as a user without roles
    await t
        .typeText('#username', 'no_role_user')
        .typeText('#password', 'password123')
        .click('#login');

    // Attempt to access Allowlist Management page
    await t
        .navigateTo(`https://example.com/allowlist-management`);

    // Check for Access Denied message
    await t
        .expect(Selector('#access-denied-message').visible).ok();
});

test('User with view privilege sees all relevant details of allowlist entry', async t => {
    // Log in as a user with view privilege
    await t
        .typeText('#username', 'view_user')
        .typeText('#password', 'password123')
        .click('#login');

    // Access an allowlist entry
    await t
        .navigateTo(`https://example.com/allowlist-entry/1`);

    // Check for relevant details
    await t
        .expect(Selector('#entry-name').innerText).eql('Allowlist Entry 1')
        .expect(Selector('#entry-status').innerText).eql('Active')
        .expect(Selector('#entry-creation-date').innerText).notEql('');
});

test('User with manage privilege can edit allowlist entry', async t => {
    // Log in as a user with manage privilege
    await t
        .typeText('#username', 'manage_user')
        .typeText('#password', 'password123')
        .click('#login');

    // Access an allowlist entry
    await t
        .navigateTo(`https://example.com/allowlist-entry/1`);

    // Edit the entry
    await t
        .click('#edit-button')
        .selectText('#status-dropdown')
        .click('#status-dropdown option[value="Inactive"]')
        .click('#save-button');

    // Verify the status change
    await t
        .expect(Selector('#entry-status').innerText).eql('Inactive');
});

test('User with administer privilege receives confirmation prompt before deletion', async t => {
    // Log in as a user with administer privilege
    await t
        .typeText('#username', 'admin_user')
        .typeText('#password', 'password123')
        .click('#login');

    // Access an allowlist entry
    await t
        .navigateTo(`https://example.com/allowlist-entry/1`);

    // Attempt to delete the entry
    await t
        .click('#delete-button')
        .expect(Selector('#confirmation-prompt').visible).ok()
        .click('#confirm-delete-button');

    // Verify deletion success
    await t
        .expect(Selector('#entry-not-found-message').visible).ok();
});

test('User with manage privilege sees validation error when adding new entry without fields', async t => {
    // Log in as a user with manage privilege
    await t
        .typeText('#username', 'manage_user')
        .typeText('#password', 'password123')
        .click('#login');

    // Attempt to add a new allowlist entry
    await t
        .navigateTo(`https://example.com/allowlist-management`)
        .click('#add-entry-button')
        .click('#save-button'); // Save without filling fields

    // Check for validation error
    await t
        .expect(Selector('#validation-error-message').visible).ok();
});

test('User with view privilege sees Access Denied on settings page', async t => {
    // Log in as a user with view privilege
    await t
        .typeText('#username', 'view_user')
        .typeText('#password', 'password123')
        .click('#login');

    // Attempt to access settings page
    await t
        .navigateTo(`https://example.com/allowlist-settings`);

    // Check for Access Denied message
    await t
        .expect(Selector('#access-denied-message').visible).ok();
});

test('User with administer privilege sees Admin panel on Allowlist Management page', async t => {
    // Log in as a user with administer privilege
    await t
        .typeText('#username', 'admin_user')
        .typeText('#password', 'password123')
        .click('#login');

    // Access Allowlist Management page
    await t
        .navigateTo(`https://example.com/allowlist-management`);

    // Check for Admin panel presence
    await t
        .expect(Selector('#admin-panel').visible).ok();
});

test('Rule Tuning Admin receives permission error when managing restricted entry', async t => {
    // Log in as Rule Tuning Admin
    await t
        .typeText('#username', 'rule_admin')
        .typeText('#password', 'password123')
        .click('#login');

    // Attempt to manage a restricted rule entry
    await t
        .navigateTo(`https://example.com/allowlist-entry/2`)
        .click('#manage-button');

    // Check for permission error message
    await t
        .expect(Selector('#permission-error-message').innerText).eql('You do not have permission to manage this entry.');
});