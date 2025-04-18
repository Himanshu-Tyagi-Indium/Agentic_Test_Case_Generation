fixture `Allowlist Entry Import/Export Functionality`
    .page `http://your-enterprise-security-platform.com/allowlist-management`;

test('Check presence of CSV upload option for users with permission', async t => {
    // Assuming user has permission, navigate to allowlist management page
    await t
        .navigateTo('/allowlist-management')
        .expect(Selector('#csv-upload').exists).ok('CSV upload option is not visible');
});

test('Import valid CSV file without errors', async t => {
    // Upload a valid CSV file
    await t
        .setFilesToUpload(Selector('#csv-upload'), 'path/to/valid-allowlist.csv')
        .click(Selector('#upload-button'))
        .expect(Selector('#success-message').innerText).eql('Entries imported successfully');
});

test('Show error message for incorrectly formatted CSV file', async t => {
    // Upload a CSV file with incorrect formatting
    await t
        .setFilesToUpload(Selector('#csv-upload'), 'path/to/invalid-format-allowlist.csv')
        .click(Selector('#upload-button'))
        .expect(Selector('#error-message').innerText).contains('Formatting issue detected');
});

test('Show error message for duplicate entries in CSV file', async t => {
    // Upload a CSV file with duplicates
    await t
        .setFilesToUpload(Selector('#csv-upload'), 'path/to/duplicate-allowlist.csv')
        .click(Selector('#upload-button'))
        .expect(Selector('#error-message').innerText).contains('Duplicates are not allowed');
});

test('Show error message for missing required fields in CSV file', async t => {
    // Upload a CSV file with missing required fields
    await t
        .setFilesToUpload(Selector('#csv-upload'), 'path/to/missing-fields-allowlist.csv')
        .click(Selector('#upload-button'))
        .expect(Selector('#error-message').innerText).contains('Missing required fields');
});

test('Download current allowlist entries as CSV', async t => {
    // Click the download button for the current allowlist entries
    await t
        .click(Selector('#download-button'))
        .expect(Selector('#download-success-message').innerText).eql('CSV file downloaded successfully');
});

test('Verify downloaded CSV contains correct fields', async t => {
    // Open the downloaded CSV file and check its contents
    await t
        .expect(Selector('#downloaded-csv').exists).ok('Downloaded CSV does not exist')
        .expect(Selector('#downloaded-csv').innerText).contains('Entry ID')
        .expect(Selector('#downloaded-csv').innerText).contains('IP Address')
        .expect(Selector('#downloaded-csv').innerText).contains('Description')
        .expect(Selector('#downloaded-csv').innerText).contains('Date Added');
});

test('Access denied for users without permission', async t => {
    // Attempt to access upload or download functionality without permission
    await t
        .navigateTo('/allowlist-management')
        .expect(Selector('#access-denied-message').innerText).eql('Access Denied');
});

test('Imported entries are reflected immediately in allowlist', async t => {
    // Upload a valid CSV file and check the allowlist
    await t
        .setFilesToUpload(Selector('#csv-upload'), 'path/to/valid-allowlist.csv')
        .click(Selector('#upload-button'))
        .expect(Selector('#allowlist').innerText).contains('New Entry');
});

test('Imported entries persist after navigating away and returning', async t => {
    // Ensure entries are still present after navigating away and back
    await t
        .navigateTo('/other-page')
        .navigateTo('/allowlist-management')
        .expect(Selector('#allowlist').innerText).contains('New Entry');
});