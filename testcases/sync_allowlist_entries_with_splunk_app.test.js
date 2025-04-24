fixture `Sync Allowlist Entries with Splunk App` {
    // Setting up the fixture for tests related to syncing allowlist entries
}

test('Add a new allowlist entry and verify creation in Splunk App', async t => {
    // Given a user with the necessary permissions
    await t
        .loginAsUserWithPermissions() // Custom function to log in with appropriate permissions
        .navigateToAllowlistPage() // Navigate to the allowlist management page

    // When they add a new allowlist entry
    const newEntry = 'test-entry';
    await t
        .typeText('#allowlist-entry-input', newEntry) // Input new entry
        .click('#add-entry-button'); // Click the add button

    // Then the entry should be created in the Splunk App within 5 seconds
    await t
        .expect(Selector('#splunk-app-entries').innerText).contains(newEntry, { timeout: 5000 });
});

test('Delete an allowlist entry and verify removal in Splunk App', async t => {
    // Given a user with the necessary permissions
    await t
        .loginAsUserWithPermissions()
        .navigateToAllowlistPage();

    // When they delete an allowlist entry
    const entryToDelete = 'test-entry';
    await t
        .click(Selector('.allowlist-entry').withText(entryToDelete).find('.delete-button')); // Click delete button for the entry

    // Then the entry should be removed from the Splunk App within 5 seconds
    await t
        .expect(Selector('#splunk-app-entries').innerText).notContains(entryToDelete, { timeout: 5000 });
});

test('Update an existing allowlist entry and verify changes in Splunk App', async t => {
    // Given a user with the necessary permissions
    await t
        .loginAsUserWithPermissions()
        .navigateToAllowlistPage();

    // When they update an existing allowlist entry
    const oldEntry = 'old-entry';
    const updatedEntry = 'updated-entry';
    await t
        .click(Selector('.allowlist-entry').withText(oldEntry).find('.edit-button')) // Click edit button
        .typeText('#allowlist-entry-input', updatedEntry, { replace: true }) // Input updated entry
        .click('#save-entry-button'); // Click save button

    // Then the changes should be reflected in the Splunk App within 5 seconds
    await t
        .expect(Selector('#splunk-app-entries').innerText).contains(updatedEntry, { timeout: 5000 });
});

test('Attempt to add or delete an allowlist entry without permissions', async t => {
    // Given a user without the necessary permissions
    await t
        .loginAsUserWithoutPermissions()
        .navigateToAllowlistPage();

    // When they attempt to add an allowlist entry
    await t
        .typeText('#allowlist-entry-input', 'unauthorized-entry')
        .click('#add-entry-button');

    // Then they should receive an error message indicating insufficient permissions
    await t
        .expect(Selector('#error-message').innerText).eql('Insufficient permissions to add entry.');

    // When they attempt to delete an allowlist entry
    await t
        .click(Selector('.allowlist-entry').withText('some-entry').find('.delete-button'));

    // Then they should receive an error message indicating insufficient permissions
    await t
        .expect(Selector('#error-message').innerText).eql('Insufficient permissions to delete entry.');
});

test('View allowlist entries and see latest synced data from Splunk App', async t => {
    // Given a user with the necessary permissions
    await t
        .loginAsUserWithPermissions()
        .navigateToAllowlistPage();

    // When they view the allowlist entries
    await t
        .click('#view-allowlist-button');

    // Then they should see the latest synced data from the Splunk App
    await t
        .expect(Selector('#allowlist-entries').innerText).eql(Selector('#splunk-app-entries').innerText);
});

test('Ensure audit logs reflect actions with timestamps', async t => {
    // Given an allowlist entry is successfully synced
    await t
        .loginAsUserWithPermissions()
        .navigateToAllowlistPage();

    const newEntry = 'audit-entry';
    await t
        .typeText('#allowlist-entry-input', newEntry)
        .click('#add-entry-button');

    // When the user views the audit logs
    await t
        .navigateToAuditLogs();

    // Then the logs should accurately reflect the action performed with timestamps
    await t
        .expect(Selector('#audit-logs').innerText).contains(`Added entry: ${newEntry}`);
});

test('Check status of sync process after an error occurs', async t => {
    // Given an error occurs during the sync process
    await t
        .simulateNetworkFailure(); // Custom function to simulate failure

    // When the user checks the status of the sync
    await t
        .navigateToSyncStatus();

    // Then they should see an error message indicating the sync failed
    await t
        .expect(Selector('#sync-status').innerText).eql('Sync failed due to network failure.');
});

test('Request a manual sync and verify operation feedback', async t => {
    // Given a user with the necessary permissions
    await t
        .loginAsUserWithPermissions()
        .navigateToSyncPage();

    // When they request a manual sync
    await t
        .click('#manual-sync-button');

    // Then the system should indicate success or failure of the operation
    await t
        .expect(Selector('#sync-feedback').innerText).eql('Sync operation successful.');
});

test('Verify modifications from Splunk App are reflected in Anvilogic platform', async t => {
    // Given an allowlist entry is modified in the Splunk App
    await t
        .loginAsUserWithPermissions()
        .modifyEntryInSplunkApp('splunk-entry', 'new-splunk-entry'); // Custom function for modification

    // When the sync process runs
    await t
        .runSyncProcess(); // Custom function to trigger sync

    // Then the corresponding entry in the Anvilogic platform should be updated
    await t
        .expect(Selector('#allowlist-entries').innerText).contains('new-splunk-entry');
});

test('Verify deletion from Splunk App is reflected in Anvilogic platform', async t => {
    // Given an allowlist entry is deleted in the Splunk App
    await t
        .loginAsUserWithPermissions()
        .deleteEntryInSplunkApp('splunk-entry'); // Custom function for deletion

    // When the sync process runs
    await t
        .runSyncProcess(); // Custom function to trigger sync

    // Then the corresponding entry in the Anvilogic platform should be removed
    await t
        .expect(Selector('#allowlist-entries').innerText).notContains('splunk-entry');
});