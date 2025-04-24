fixture `Allowlist Entry Bulk Import Functionality`
    .page `https://example.com/bulk-import`;

test('User with permissions can see CSV upload option', async t => {
    // Log in as a user with permissions
    await t
        .typeText('#username', 'user_with_permissions')
        .typeText('#password', 'password')
        .click('#login-button');
    
    // Navigate to the bulk import page
    await t
        .click('#allowlist-management')
        .click('#bulk-import');

    // Assert that the upload option is visible
    const uploadOption = Selector('#csv-upload');
    await t.expect(uploadOption.visible).ok();
});

test('Valid CSV file is successfully imported', async t => {
    // Prepare a valid CSV file for upload
    const validCsvFilePath = './data/valid_allowlist.csv';

    await t
        .click('#bulk-import')
        .setFilesToUpload('#csv-upload', validCsvFilePath)
        .click('#import-button');

    // Assert that the success message is displayed
    const successMessage = Selector('#success-message');
    await t.expect(successMessage.innerText).eql('Import successful!');
});

test('CSV file with missing required fields shows error', async t => {
    const invalidCsvFilePath = './data/missing_fields.csv';

    await t
        .click('#bulk-import')
        .setFilesToUpload('#csv-upload', invalidCsvFilePath)
        .click('#import-button');

    const errorMessage = Selector('#error-message');
    await t.expect(errorMessage.innerText).contains('Missing required fields: domain, description');
});

test('CSV file with incorrectly formatted fields shows error', async t => {
    const invalidFormatCsvFilePath = './data/invalid_format.csv';

    await t
        .click('#bulk-import')
        .setFilesToUpload('#csv-upload', invalidFormatCsvFilePath)
        .click('#import-button');

    const errorMessage = Selector('#error-message');
    await t.expect(errorMessage.innerText).contains('Incorrect format for fields: domain');
});

test('CSV file with duplicate entries shows warning', async t => {
    const duplicateCsvFilePath = './data/duplicate_entries.csv';

    await t
        .click('#bulk-import')
        .setFilesToUpload('#csv-upload', duplicateCsvFilePath)
        .click('#import-button');

    const warningMessage = Selector('#warning-message');
    await t.expect(warningMessage.innerText).contains('Duplicate entries found, only unique entries will be imported.');
});

test('User without permissions is denied access', async t => {
    // Log in as a user without permissions
    await t
        .typeText('#username', 'user_without_permissions')
        .typeText('#password', 'password')
        .click('#login-button');

    // Attempt to navigate to the bulk import page
    await t
        .navigateTo('https://example.com/bulk-import');

    // Assert that the user is redirected to an error page
    const errorPage = Selector('#error-page');
    await t.expect(errorPage.visible).ok();
});

test('Imported entries should be visible in allowlist management', async t => {
    const validCsvFilePath = './data/valid_allowlist.csv';

    await t
        .click('#bulk-import')
        .setFilesToUpload('#csv-upload', validCsvFilePath)
        .click('#import-button');

    await t
        .navigateTo('https://example.com/allowlist-management');

    // Assert that the entries are visible in the allowlist
    const entry = Selector('.allowlist-entry').withText('example.com');
    await t.expect(entry.visible).ok();
});

test('File size limit error is displayed for oversized files', async t => {
    const oversizedCsvFilePath = './data/oversized_file.csv';

    await t
        .click('#bulk-import')
        .setFilesToUpload('#csv-upload', oversizedCsvFilePath)
        .click('#import-button');

    const errorMessage = Selector('#error-message');
    await t.expect(errorMessage.innerText).contains('File size exceeds the allowed limit.');
});

test('Unsupported file type error is displayed', async t => {
    const unsupportedFilePath = './data/unsupported_file.txt';

    await t
        .click('#bulk-import')
        .setFilesToUpload('#csv-upload', unsupportedFilePath)
        .click('#import-button');

    const errorMessage = Selector('#error-message');
    await t.expect(errorMessage.innerText).contains('Only CSV files are accepted.');
});

test('Offline upload attempt shows internet connection error', async t => {
    // Simulate offline mode (Note: TestCafe doesn't support real offline simulation)
    await t
        .setNativeDialogHandler(() => true) // Accept the prompt
        .click('#bulk-import')
        .setFilesToUpload('#csv-upload', './data/valid_allowlist.csv')
        .click('#import-button');

    const errorMessage = Selector('#error-message');
    await t.expect(errorMessage.innerText).contains('You need to be connected to the internet to perform the upload.');
});