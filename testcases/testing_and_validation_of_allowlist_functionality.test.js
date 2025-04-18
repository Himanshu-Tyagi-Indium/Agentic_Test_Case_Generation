import { Selector } from 'testcafe';

fixture`Testing and Validation of Allowlist Functionality`
    .page`https://your-enterprise-security-platform-url.com`;

test('User can see a list of existing allowlist entries', async t => {
    // Log in as a user with permission to manage allowlist entries
    await t
        .navigateTo('/login')
        .typeText('#username', 'testuser')
        .typeText('#password', 'testpassword')
        .click('#login-button')
        .navigateTo('/allowlist-management');

    // Verify that the allowlist entries are visible
    const entriesList = Selector('#allowlist-entries');
    await t.expect(entriesList.exists).ok();
});

test('User can successfully add a new allowlist entry', async t => {
    await t
        .navigateTo('/allowlist-management')
        .typeText('#allowlist-entry-field', 'new-entry@example.com')
        .click('#add-entry-button');

    const successMessage = Selector('#success-message');
    await t.expect(successMessage.innerText).eql('Entry added successfully');
});

test('System auto-escapes special characters in allowlist entry fields', async t => {
    await t
        .navigateTo('/allowlist-management')
        .typeText('#allowlist-entry-field', '<script>alert("test")</script>')
        .click('#add-entry-button');

    const entryDetails = Selector('#entry-details');
    await t.expect(entryDetails.innerText).contains('&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;');
});

test('User receives error message when adding an existing allowlist entry', async t => {
    await t
        .navigateTo('/allowlist-management')
        .typeText('#allowlist-entry-field', 'existing-entry@example.com')
        .click('#add-entry-button');

    const errorMessage = Selector('#error-message');
    await t.expect(errorMessage.innerText).eql('Entry already exists');
});

test('User receives validation error messages for required fields', async t => {
    await t
        .navigateTo('/allowlist-management')
        .click('#add-entry-button');

    const validationMessage = Selector('#validation-message');
    await t.expect(validationMessage.innerText).eql('This field is required');
});

test('User can view allowlist entry details including auto-escaped values', async t => {
    await t
        .navigateTo('/allowlist-management')
        .click(Selector('.entry-item').withText('new-entry@example.com'));

    const entryDetails = Selector('#entry-details');
    await t.expect(entryDetails.innerText).contains('new-entry@example.com');
});

test('UI elements for edit and delete are present', async t => {
    await t
        .navigateTo('/allowlist-management');

    const editButton = Selector('.edit-button');
    const deleteButton = Selector('.delete-button');
    await t.expect(editButton.exists).ok();
    await t.expect(deleteButton.exists).ok();
});

test('User is prompted for confirmation before deleting an entry', async t => {
    await t
        .navigateTo('/allowlist-management')
        .click(Selector('.delete-button').withText('existing-entry@example.com'));

    const confirmationDialog = Selector('#confirmation-dialog');
    await t.expect(confirmationDialog.exists).ok();
});

test('New allowlist entry is logged for auditing purposes', async t => {
    await t
        .navigateTo('/allowlist-management')
        .typeText('#allowlist-entry-field', 'audit-entry@example.com')
        .click('#add-entry-button');

    // Check logs or audit trail
    await t.navigateTo('/audit-log');
    const auditEntry = Selector('.audit-entry').withText('audit-entry@example.com');
    await t.expect(auditEntry.exists).ok();
});

test('Allowlist feature works in Splunk environment without conflicts', async t => {
    await t
        .navigateTo('/splunk-allowlist-management');

    const splunkFeature = Selector('#splunk-feature');
    await t.expect(splunkFeature.exists).ok();
});

test('User without permission is denied access to allowlist management page', async t => {
    await t
        .navigateTo('/login')
        .typeText('#username', 'unauthorizedUser')
        .typeText('#password', 'wrongpassword')
        .click('#login-button')
        .navigateTo('/allowlist-management');

    const errorMessage = Selector('#error-message');
    await t.expect(errorMessage.innerText).eql('Access denied');
});

test('System handles very large values gracefully', async t => {
    await t
        .navigateTo('/allowlist-management')
        .typeText('#allowlist-entry-field', 'a'.repeat(10000))
        .click('#add-entry-button');

    const successMessage = Selector('#success-message');
    await t.expect(successMessage.innerText).eql('Entry added successfully');
});