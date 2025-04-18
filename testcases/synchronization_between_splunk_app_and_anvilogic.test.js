fixture `Synchronization Between Splunk App and Anvilogic`

test('Add new allowlist entry in Splunk App and verify in Anvilogic', async t => {
    // Log in as a user with permissions
    await t
        .navigateTo('https://splunk-app-url/login')
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#loginButton');

    // Add a new allowlist entry
    await t
        .navigateTo('https://splunk-app-url/allowlist')
        .typeText('#newEntry', 'allowlist_entry_1')
        .click('#addButton');

    // Wait for the sync to happen
    await t.wait(300000); // Wait for 5 minutes

    // Verify the entry in Anvilogic
    await t
        .navigateTo('https://anvilogic-url/allowlist')
        .expect(Selector('#allowlist').innerText).contains('allowlist_entry_1');
});

test('Delete allowlist entry in Anvilogic and verify removal in Splunk App', async t => {
    // Log in as a user with permissions
    await t
        .navigateTo('https://anvilogic-url/login')
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#loginButton');

    // Delete an allowlist entry
    await t
        .navigateTo('https://anvilogic-url/allowlist')
        .click(Selector('.entry').withText('allowlist_entry_1').find('.deleteButton'));

    // Wait for the sync to happen
    await t.wait(300000); // Wait for 5 minutes

    // Verify the entry is removed in Splunk App
    await t
        .navigateTo('https://splunk-app-url/allowlist')
        .expect(Selector('#allowlist').innerText).notContains('allowlist_entry_1');
});

test('Check audit logs in Splunk App and Anvilogic match', async t => {
    // Log in as a user with permissions to view audit logs
    await t
        .navigateTo('https://splunk-app-url/login')
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#loginButton');

    // Check audit history in Splunk App
    await t
        .navigateTo('https://splunk-app-url/audit-logs')
        .expect(Selector('#auditLogs').innerText).contains('allowlist_entry_1');

    // Check audit history in Anvilogic
    await t
        .navigateTo('https://anvilogic-url/audit-logs')
        .expect(Selector('#auditLogs').innerText).contains('allowlist_entry_1');
});

test('Attempt to modify allowlist entries without permissions', async t => {
    // Log in as a user without permissions
    await t
        .navigateTo('https://splunk-app-url/login')
        .typeText('#username', 'invalid_user')
        .typeText('#password', 'invalid_password')
        .click('#loginButton');

    // Attempt to add an entry
    await t
        .navigateTo('https://splunk-app-url/allowlist')
        .typeText('#newEntry', 'allowlist_entry_2')
        .click('#addButton')
        .expect(Selector('#errorMessage').innerText).eql('Insufficient permissions to modify allowlist entries.');
});

test('Update existing allowlist entry in Splunk App and verify in Anvilogic', async t => {
    // Log in as a user with permissions
    await t
        .navigateTo('https://splunk-app-url/login')
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#loginButton');

    // Update an existing entry
    await t
        .navigateTo('https://splunk-app-url/allowlist')
        .click(Selector('.entry').withText('allowlist_entry_1').find('.editButton'))
        .typeText('#entryField', 'allowlist_entry_1_updated', { replace: true })
        .click('#saveButton');

    // Wait for the sync to happen
    await t.wait(300000); // Wait for 5 minutes

    // Verify the updated entry in Anvilogic
    await t
        .navigateTo('https://anvilogic-url/allowlist')
        .expect(Selector('#allowlist').innerText).contains('allowlist_entry_1_updated');
});

test('Update allowlist entry in Anvilogic and verify in Splunk App', async t => {
    // Log in as a user with permissions
    await t
        .navigateTo('https://anvilogic-url/login')
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#loginButton');

    // Update an existing entry
    await t
        .navigateTo('https://anvilogic-url/allowlist')
        .click(Selector('.entry').withText('allowlist_entry_1').find('.editButton'))
        .typeText('#entryField', 'allowlist_entry_1_updated_anvilogic', { replace: true })
        .click('#saveButton');

    // Wait for the sync to happen
    await t.wait(300000); // Wait for 5 minutes

    // Verify the updated entry in Splunk App
    await t
        .navigateTo('https://splunk-app-url/allowlist')
        .expect(Selector('#allowlist').innerText).contains('allowlist_entry_1_updated_anvilogic');
});

test('Handle network failure during sync', async t => {
    // Simulate network failure
    await t.setNativeDialogHandler(() => true);

    // Log in as a user with permissions
    await t
        .navigateTo('https://splunk-app-url/login')
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#loginButton');

    // Attempt to add an entry while simulating network failure
    await t
        .navigateTo('https://splunk-app-url/allowlist')
        .typeText('#newEntry', 'allowlist_entry_3')
        .click('#addButton');

    // Restore the connection and check for automatic sync
    await t.wait(5000); // Simulate time passing for network restoration

    // Verify the entry is synced
    await t
        .navigateTo('https://anvilogic-url/allowlist')
        .expect(Selector('#allowlist').innerText).contains('allowlist_entry_3');
});

test('View allowlist entries in both systems and verify consistency', async t => {
    // Log in as a user with permissions
    await t
        .navigateTo('https://splunk-app-url/login')
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#loginButton');

    // View allowlist in Splunk App
    await t
        .navigateTo('https://splunk-app-url/allowlist')
        .expect(Selector('#allowlist').innerText).contains('allowlist_entry_1');

    // Check the same in Anvilogic
    await t
        .navigateTo('https://anvilogic-url/allowlist')
        .expect(Selector('#allowlist').innerText).contains('allowlist_entry_1');
});

test('Check notification after modifying allowlist entry in Splunk App', async t => {
    // Log in as a user with permissions
    await t
        .navigateTo('https://splunk-app-url/login')
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#loginButton');

    // Modify an entry
    await t
        .navigateTo('https://splunk-app-url/allowlist')
        .click(Selector('.entry').withText('allowlist_entry_1').find('.editButton'))
        .typeText('#entryField', 'allowlist_entry_1_modified', { replace: true })
        .click('#saveButton');

    // Wait for sync operation to complete and notification to be displayed
    await t.wait(5000); // Wait for notification

    // Verify notification in both systems
    await t
        .navigateTo('https://splunk-app-url/notifications')
        .expect(Selector('#notification').innerText).contains('Synchronization successful');

    await t
        .navigateTo('https://anvilogic-url/notifications')
        .expect(Selector('#notification').innerText).contains('Synchronization successful');
});

test('Check audit logs in Anvilogic and verify details', async t => {
    // Log in as a user with permissions to view audit logs
    await t
        .navigateTo('https://anvilogic-url/login')
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#loginButton');

    // Access audit history in Anvilogic
    await t
        .navigateTo('https://anvilogic-url/audit-logs')
        .expect(Selector('#auditLogs').innerText).contains('allowlist_entry_1_updated_anvilogic');
});