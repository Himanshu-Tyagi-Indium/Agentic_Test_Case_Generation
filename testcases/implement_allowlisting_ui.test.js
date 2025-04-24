fixture `Allowlisting Management UI Tests`
    .page `http://your-anvilogic-platform-url.com`;

test('Display Allowlisting management UI for logged-in user', async t => {
    // Log in the user with permission
    await t
        .typeText('#username', 'testuser')
        .typeText('#password', 'password123')
        .click('#loginButton')
        .navigateTo('http://your-anvilogic-platform-url.com/detect')
        .expect(Selector('#allowlistingUI').visible).ok('Allowlisting management UI should be displayed');
});

test('Display existing allowlist entries', async t => {
    await t
        .navigateTo('http://your-anvilogic-platform-url.com/detect')
        .expect(Selector('#allowlistEntries').child('li').count).gt(0
        , 'There should be existing allowlist entries visible');
});

test('Open Create form when Create button is clicked', async t => {
    await t
        .navigateTo('http://your-anvilogic-platform-url.com/detect')
        .click(Selector('#createButton'))
        .expect(Selector('#createForm').visible).ok('Create form should be visible');
});

test('Submit new allowlist entry', async t => {
    await t
        .navigateTo('http://your-anvilogic-platform-url.com/detect')
        .click(Selector('#createButton'))
        .typeText('#entryName', 'Test Entry')
        .typeText('#description', 'This is a test entry')
        .typeText('#ipAddress', '192.168.1.1')
        .click('#submitButton')
        .expect(Selector('#allowlistEntries').child('li').withText('Test Entry').exists).ok('New allowlist entry should be added');
});

test('Display allowlist entry details in modal', async t => {
    await t
        .navigateTo('http://your-anvilogic-platform-url.com/detect')
        .click(Selector('#allowlistEntries li').nth(0)) // Click on the first entry
        .expect(Selector('#detailsModal').visible).ok('Details modal should be displayed');
});

test('Save modified allowlist entry', async t => {
    await t
        .navigateTo('http://your-anvilogic-platform-url.com/detect')
        .click(Selector('#allowlistEntries li').nth(0)) // Click on the first entry
        .typeText('#entryName', 'Updated Entry', { replace: true })
        .click('#saveButton')
        .expect(Selector('#allowlistEntries').child('li').withText('Updated Entry').exists).ok('Changes should be reflected in the main page');
});

test('Confirm deletion of allowlist entry', async t => {
    await t
        .navigateTo('http://your-anvilogic-platform-url.com/detect')
        .click(Selector('#allowlistEntries li').nth(0)) // Click on the first entry
        .click('#deleteButton')
        .expect(Selector('#confirmationDialog').visible).ok('Confirmation dialog should appear')
        .click('#confirmDeleteButton')
        .expect(Selector('#allowlistEntries').child('li').withText('Updated Entry').exists).notOk('Allowlist entry should be removed');
});

test('Display message when no allowlist entries are available', async t => {
    await t
        .navigateTo('http://your-anvilogic-platform-url.com/detect')
        .expect(Selector('#noEntriesMessage').visible).ok('Message indicating no allowlist entries should be displayed');
});

test('Show error message for missing required fields', async t => {
    await t
        .navigateTo('http://your-anvilogic-platform-url.com/detect')
        .click(Selector('#createButton'))
        .click('#submitButton')
        .expect(Selector('#errorMessage').visible).ok('Error message should indicate required fields');
});

test('Access denied for user without permission', async t => {
    await t
        .navigateTo('http://your-anvilogic-platform-url.com/detect')
        .expect(Selector('#accessDeniedMessage').visible).ok('Access denied message should be displayed');
});

test('Display tooltip on button hover', async t => {
    await t
        .navigateTo('http://your-anvilogic-platform-url.com/detect')
        .hover(Selector('#createButton'))
        .expect(Selector('#createButtonTooltip').visible).ok('Tooltip should be displayed on button hover');
});

test('Responsive layout for Allowlisting management UI', async t => {
    await t
        .navigateTo('http://your-anvilogic-platform-url.com/detect')
        .resizeWindow(1024, 768)
        .expect(Selector('#allowlistingUI').visible).ok('All UI elements should remain visible and usable after resizing');
});