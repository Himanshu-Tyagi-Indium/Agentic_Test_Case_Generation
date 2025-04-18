fixture `Bulk Import of Allowlist Entries Tests`
    .page `https://your-enterprise-security-platform.com/allowlist-import`

test('Upload valid CSV file and display success message', async t => {
    // Navigate to the Allowlist import page
    await t
        .click(Selector('a').withText('Allowlist Import'));

    // Upload a valid CSV file
    await t
        .setFilesToUpload(Selector('input[type="file"]'), 'path/to/valid-allowlist.csv')
        .click(Selector('button').withText('Import'));

    // Verify success message is displayed
    await t
        .expect(Selector('.notification').innerText).eql('Import successful! All entries have been imported.');
});

test('Upload CSV file with valid entries and import without errors', async t => {
    await t
        .setFilesToUpload(Selector('input[type="file"]'), 'path/to/valid-entries.csv')
        .click(Selector('button').withText('Import'));

    await t
        .expect(Selector('.notification').innerText).eql('Import successful! All entries have been imported.');
});

test('Upload CSV file with invalid entries and display error message', async t => {
    await t
        .setFilesToUpload(Selector('input[type="file"]'), 'path/to/invalid-entries.csv')
        .click(Selector('button').withText('Import'));

    await t
        .expect(Selector('.notification').innerText).contains('Error: Invalid entries found.');
});

test('Upload empty CSV file and display no valid entries message', async t => {
    await t
        .setFilesToUpload(Selector('input[type="file"]'), 'path/to/empty-file.csv')
        .click(Selector('button').withText('Import'));

    await t
        .expect(Selector('.notification').innerText).eql('No valid entries found in the uploaded file.');
});

test('Access Allowlist import page without permission and display error message', async t => {
    // Simulate user without permissions
    await t
        .navigateTo(`https://your-enterprise-security-platform.com/allowlist-import`);

    await t
        .expect(Selector('.error-message').innerText).eql('You do not have permission to perform this action.');
});

test('Upload CSV file exceeding maximum size limit and display error message', async t => {
    await t
        .setFilesToUpload(Selector('input[type="file"]'), 'path/to/large-file.csv')
        .click(Selector('button').withText('Import'));

    await t
        .expect(Selector('.notification').innerText).eql('The uploaded file exceeds the maximum size limit.');
});

test('Log import activity after uploading CSV file', async t => {
    await t
        .setFilesToUpload(Selector('input[type="file"]'), 'path/to/valid-entries.csv')
        .click(Selector('button').withText('Import'));

    // Check logs for import activity
    await t
        .expect(Selector('.log').innerText).contains('Import activity logged: 5 entries processed.');
});

test('Upload CSV file with duplicates and display warning message', async t => {
    await t
        .setFilesToUpload(Selector('input[type="file"]'), 'path/to/duplicate-entries.csv')
        .click(Selector('button').withText('Import'));

    await t
        .expect(Selector('.notification').innerText).contains('Warning: 2 duplicates found and ignored.');
});