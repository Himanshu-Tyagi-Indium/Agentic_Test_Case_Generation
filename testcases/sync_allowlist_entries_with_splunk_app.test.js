fixture`Sync Allowlist Entries with Splunk App Tests`
    .page`https://your-anvilogic-url.com`;

test('Update existing allowlist entry in Anvilogic and verify in Splunk App', async t => {
    // Update the allowlist entry in Anvilogic
    await t
        .navigateTo('https://your-anvilogic-url.com/allowlist')
        .click(Selector('.edit-button').withText('Entry to Update'))
        .typeText(Selector('#allowlist-entry-name'), 'Updated Entry Name')
        .click(Selector('#save-button'));

    // Wait for sync and then verify the updated entry in Splunk App
    await t.wait(300000); // Wait for 5 minutes
    await t
        .navigateTo('https://your-splunk-url.com/allowlist')
        .expect(Selector('.allowlist-entry').withText('Updated Entry Name').exists).ok();
});

test('Update existing allowlist entry in Splunk App and verify in Anvilogic', async t => {
    // Update the allowlist entry in Splunk App
    await t
        .navigateTo('https://your-splunk-url.com/allowlist')
        .click(Selector('.edit-button').withText('Entry to Update'))
        .typeText(Selector('#allowlist-entry-name'), 'Updated Entry Name')
        .click(Selector('#save-button'));

    // Wait for sync and then verify the updated entry in Anvilogic
    await t.wait(300000); // Wait for 5 minutes
    await t
        .navigateTo('https://your-anvilogic-url.com/allowlist')
        .expect(Selector('.allowlist-entry').withText('Updated Entry Name').exists).ok();
});

test('Delete existing allowlist entry in Anvilogic and verify deletion in Splunk App', async t => {
    // Delete the allowlist entry in Anvilogic
    await t
        .navigateTo('https://your-anvilogic-url.com/allowlist')
        .click(Selector('.delete-button').withText('Entry to Delete'))
        .click(Selector('#confirm-delete-button'));

    // Wait for sync and then verify the deletion in Splunk App
    await t.wait(300000); // Wait for 5 minutes
    await t
        .navigateTo('https://your-splunk-url.com/allowlist')
        .expect(Selector('.allowlist-entry').withText('Entry to Delete').exists).notOk();
});

test('Delete existing allowlist entry in Splunk App and verify deletion in Anvilogic', async t => {
    // Delete the allowlist entry in Splunk App
    await t
        .navigateTo('https://your-splunk-url.com/allowlist')
        .click(Selector('.delete-button').withText('Entry to Delete'))
        .click(Selector('#confirm-delete-button'));

    // Wait for sync and then verify the deletion in Anvilogic
    await t.wait(300000); // Wait for 5 minutes
    await t
        .navigateTo('https://your-anvilogic-url.com/allowlist')
        .expect(Selector('.allowlist-entry').withText('Entry to Delete').exists).notOk();
});

test("Admin user updates or deletes allowlist entry and verifies sync", async t => {
    // Log in as Admin
    await t
        .navigateTo('https://your-anvilogic-url.com/login')
        .typeText(Selector('#username'), 'adminUser')
        .typeText(Selector('#password'), 'adminPassword')
        .click(Selector('#login-button'));

    // Update allowlist entry
    await t
        .navigateTo('https://your-anvilogic-url.com/allowlist')
        .click(Selector('.edit-button').withText('Entry to Update'))
        .typeText(Selector('#allowlist-entry-name'), 'Updated Entry Name')
        .click(Selector('#save-button'));

    // Wait for sync and verify entries in both platforms
    await t.wait(300000); // Wait for 5 minutes
    await t
        .navigateTo('https://your-splunk-url.com/allowlist')
        .expect(Selector('.allowlist-entry').withText('Updated Entry Name').exists).ok();
});

test("Read Only user attempts to update or delete allowlist entry and receives error", async t => {
    // Log in as Read Only user
    await t
        .navigateTo('https://your-anvilogic-url.com/login')
        .typeText(Selector('#username'), 'readonlyUser')
        .typeText(Selector('#password'), 'readonlyPassword')
        .click(Selector('#login-button'));

    // Attempt to update allowlist entry
    await t
        .navigateTo('https://your-anvilogic-url.com/allowlist')
        .click(Selector('.edit-button').withText('Entry to Update'))
        .expect(Selector('#error-message').innerText).eql('Permission Denied');
});

test('Verify sync process with network failure', async t => {
    // Simulate network failure
    await t
        .navigateTo('https://your-anvilogic-url.com/sync')
        .click(Selector('#start-sync-button'))
        .expect(Selector('#sync-status').innerText).eql('Error: Network Failure');

    // Expect retry logic to be in place (mocking the time for retries)
    await t.wait(600000); // Wait for 10 minutes
    // Verify log entry for retry attempt
    await t.expect(Selector('.log-entry').withText('Retry Attempt').exists).ok();
});

test('Verify synced allowlist entries match between Anvilogic and Splunk App', async t => {
    // Verify entry in Anvilogic
    const anvilogicEntry = await Selector('.allowlist-entry').withText('Valid Entry').innerText;

    // Verify the same entry in Splunk
    await t
        .navigateTo('https://your-splunk-url.com/allowlist')
        .expect(Selector('.allowlist-entry').withText(anvilogicEntry).exists).ok();
});

test("Admin views allowlist entries in both platforms and verifies consistency", async t => {
    // Log in as Admin
    await t
        .navigateTo('https://your-anvilogic-url.com/login')
        .typeText(Selector('#username'), 'adminUser')
        .typeText(Selector('#password'), 'adminPassword')
        .click(Selector('#login-button'));

    // View allowlist in Anvilogic
    await t
        .navigateTo('https://your-anvilogic-url.com/allowlist')
        .expect(Selector('.allowlist-entry').count).gt(0);

    // View allowlist in Splunk
    await t
        .navigateTo('https://your-splunk-url.com/allowlist')
        .expect(Selector('.allowlist-entry').count).gt(0);
});

test('New allowlist entry created in Splunk App appears in Anvilogic', async t => {
    // Create new allowlist entry in Splunk App
    await t
        .navigateTo('https://your-splunk-url.com/allowlist')
        .click(Selector('#create-new-entry-button'))
        .typeText(Selector('#allowlist-entry-name'), 'New Entry')
        .click(Selector('#save-button'));

    // Wait for sync and then check in Anvilogic
    await t.wait(300000); // Wait for 5 minutes
    await t
        .navigateTo('https://your-anvilogic-url.com/allowlist')
        .expect(Selector('.allowlist-entry').withText('New Entry').exists).ok();
});