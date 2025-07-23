import { Selector } from 'testcafe';

fixture`Allowlisting UI Tests`
    .page`https://your-anvilogic-platform-url.com`;

test('Verify Allowlists submenu item is present under Detect', async t => {
    // Log in as a user with access
    await t
        .typeText('#username', 'validUser')  // Replace with actual username selector
        .typeText('#password', 'validPassword')  // Replace with actual password selector
        .click('#loginButton');  // Replace with actual login button selector

    // Navigate to the Detect menu
    await t
        .click(Selector('#detectMenu'));  // Replace with actual Detect menu selector

    // Check if Allowlists submenu item is present
    const allowlistsMenuItem = Selector('#allowlistsSubmenu');  // Replace with actual Allowlists submenu selector
    await t.expect(allowlistsMenuItem.exists).ok();
});

test('Navigate to Allowlisting UI', async t => {
    // Click on Allowlists submenu item
    await t
        .click(Selector('#allowlistsSubmenu'));  // Replace with actual Allowlists submenu selector

    // Verify redirection to Allowlisting UI
    await t.expect(Selector('#allowlistingUI').exists).ok();  // Replace with allowlisting UI selector
});

test('Allowlisting UI matches design mockups', async t => {
    await t.expect(Selector('#allowlistingUI').visible).ok(); // Ensure the UI is visible
    // Add assertions for specific UI elements to match design
    await t.expect(Selector('.mockup-element').exists).ok(); // Replace with actual selectors
});

test('Check allowlisting icon', async t => {
    const allowlistingIcon = Selector('#allowlistingIcon');  // Replace with actual icon selector
    await t.expect(allowlistingIcon.exists).ok();
});

test('Presence of fields and components in Allowlisting UI', async t => {
    await t
        .expect(Selector('#field1').exists).ok()  // Replace with actual field selectors
        .expect(Selector('#field2').exists).ok()  // Replace with actual field selectors
        .expect(Selector('#submitButton').exists).ok();  // Replace with actual button selector
});

test('Validation error messages for empty allowlist entry form', async t => {
    await t
        .click(Selector('#submitButton'))  // Submit the form
        .expect(Selector('.error-message').count).gt(0);  // Ensure error messages are displayed
});

test('Submit valid data for new allowlist entry', async t => {
    await t
        .typeText('#field1', 'validEntry')  // Replace with actual field selectors
        .click('#submitButton')  // Submit the form
        .expect(Selector('.confirmation-message').innerText).eql('Entry added successfully');  // Replace with actual confirmation message selector
});

test('Access Allowlisting UI without permissions', async t => {
    // Log in as a user without permissions
    await t
        .typeText('#username', 'userWithoutPermissions')  // Replace with actual username selector
        .typeText('#password', 'validPassword')
        .click('#loginButton');

    await t
        .navigateTo('ALLOWLISTING_URL')  // Replace with actual URL
        .expect(Selector('.error-message').innerText).eql('You do not have access');  // Replace with actual error message selector
});

test('Attempt invalid action on Allowlisting UI', async t => {
    // Assume the user is logged in with sufficient permissions
    await t
        .click(Selector('#deleteSharedAllowlistButton'))  // Replace with actual delete button selector
        .expect(Selector('.error-message').innerText).eql('Insufficient permissions');  // Replace with actual error message selector
});

test('Confirm deletion of an allowlist entry', async t => {
    await t
        .click(Selector('#deleteAllowlistEntryButton'))  // Replace with actual delete entry button selector
        .expect(Selector('#confirmationDialog').visible).ok();  // Replace with actual confirmation dialog selector
});

test('Verify new entry persists after refresh', async t => {
    await t
        .click(Selector('#submitButton'))  // First, submit a new entry
        .expect(Selector('.confirmation-message').innerText).eql('Entry added successfully')
        .navigateTo('ALLOWLISTING_URL')  // Refresh the page
        .expect(Selector('#allowlistEntry').exists).ok();  // Ensure new entry exists
});

test('Attempt to add duplicate allowlist entry', async t => {
    await t
        .typeText('#field1', 'duplicateEntry')  // Replace with actual field selectors
        .click('#submitButton')
        .expect(Selector('.error-message').innerText).eql('The entry already exists');  // Replace with actual error message selector
});