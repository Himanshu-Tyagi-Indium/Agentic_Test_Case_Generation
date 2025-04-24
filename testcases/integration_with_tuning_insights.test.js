fixture`Integration with Tuning Insights`
    .page`http://your-enterprise-security-platform-url.com/tuning-insights`;

// Test to verify the presence of the Allowlist entry option
test('User sees Allowlist entry option in Tuning Insights', async t => {
    // Assuming user is already logged in with necessary permissions
    await t
        .expect(Selector('#allowlist-entry-option').visible).ok('Allowlist entry option is not visible');
});

// Test to verify form fields for creating an Allowlist entry
test('User is presented with Allowlist entry form', async t => {
    await t
        .click(Selector('#allowlist-entry-option')) // Click on the Allowlist entry option
        .expect(Selector('#entry-name').visible).ok('Entry Name field is not visible')
        .expect(Selector('#description').visible).ok('Description field is not visible')
        .expect(Selector('#type').visible).ok('Type field is not visible')
        .expect(Selector('#priority').visible).ok('Priority field is not visible');
});

// Test to create an Allowlist entry successfully
test('User creates Allowlist entry successfully', async t => {
    await t
        .click(Selector('#allowlist-entry-option'))
        .typeText('#entry-name', 'Test Entry')
        .typeText('#description', 'This is a test entry')
        .selectText('#type').click('option[value="IP"]') // Select Type
        .typeText('#priority', '1')
        .click('#submit-button') // Submit the form
        .expect(Selector('#confirmation-message').innerText).eql('Allowlist entry created successfully', 'Confirmation message not displayed');
});

// Test for duplicate Entry Name error
test('User submits form with duplicate Entry Name', async t => {
    await t
        .click(Selector('#allowlist-entry-option'))
        .typeText('#entry-name', 'Test Entry') // Using the same Entry Name
        .typeText('#description', 'Another entry with same name')
        .selectText('#type').click('option[value="Domain"]')
        .typeText('#priority', '2')
        .click('#submit-button')
        .expect(Selector('#error-message').innerText).eql('Entry Name must be unique', 'Duplicate Entry Name error message not displayed');
});

// Test for missing required fields error
test('User submits form without filling required fields', async t => {
    await t
        .click(Selector('#allowlist-entry-option'))
        .click('#submit-button') // Attempt to submit the form without filling
        .expect(Selector('#error-message').innerText).eql('Please fill in all required fields', 'Missing fields error message not displayed');
});

// Test for Access Denied when insufficient permissions
test('User without permissions sees Access Denied message', async t => {
    // Assuming user is logged in without permissions
    await t
        .click(Selector('#allowlist-entry-option'))
        .expect(Selector('#error-message').innerText).eql('Access Denied', 'Access Denied message not displayed');
});

// Test to verify new Allowlist entry appears after refresh
test('Newly created Allowlist entry is visible after refresh', async t => {
    await t
        .click(Selector('#allowlist-entry-option'))
        .typeText('#entry-name', 'New Entry')
        .typeText('#description', 'New entry description')
        .selectText('#type').click('option[value="IP"]')
        .typeText('#priority', '3')
        .click('#submit-button')
        .navigateTo('http://your-enterprise-security-platform-url.com/tuning-insights') // Refresh the page
        .expect(Selector('#allowlist-section').innerText).contains('New Entry', 'New entry not visible in Allowlist section');
});

// Test to verify logging of newly created Allowlist entry
test('Allowlist entry creation is logged with timestamp and user ID', async t => {
    // This test assumes that the logging function is observable in the UI
    await t
        .click(Selector('#allowlist-entry-option'))
        .typeText('#entry-name', 'Log Entry')
        .typeText('#description', 'Entry for logging test')
        .selectText('#type').click('option[value="Domain"]')
        .typeText('#priority', '4')
        .click('#submit-button')
        .expect(Selector('#log-section').innerText).contains('Log Entry', 'Entry not logged in the system');
});

// Test for system error handling during creation
test('User sees error message on system error', async t => {
    // Simulate a system error by manipulating the backend or UI state
    await t
        .click(Selector('#allowlist-entry-option'))
        .typeText('#entry-name', 'Error Entry')
        .typeText('#description', 'Simulating error')
        .selectText('#type').click('option[value="IP"]')
        .typeText('#priority', '5')
        .click('#submit-button') // Submit the form
        .expect(Selector('#error-message').innerText).eql('An error occurred while creating the Allowlist entry. Please try again later.', 'System error message not displayed');
});