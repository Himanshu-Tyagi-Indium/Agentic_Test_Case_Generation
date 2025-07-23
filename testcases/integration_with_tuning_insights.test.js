fixture `Integration with Tuning Insights`
    .page `https://your-enterprise-security-platform-url.com`

test(`User sees option to create allowlist entry from accepted recommendations`, async t => {
    // Log in to the application
    await t
        .typeText('#username', 'validUser')
        .typeText('#password', 'validPassword')
        .click('#loginButton');

    // Navigate to Tuning Insights feature
    await t.click('#tuningInsightsTab');
    
    // Check if the user sees the option to create an allowlist entry
    const createAllowlistButton = Selector('#createAllowlistButton');
    await t.expect(createAllowlistButton.exists).ok('Create Allowlist Entry button not found');
});

test(`User clicks 'Create Allowlist Entry' button and sees the entry form`, async t => {
    await t.click(Selector('#acceptedRecommendation').nth(0));
    await t.click(Selector('#createAllowlistButton'));

    // Check if the allowlist entry form is displayed
    const allowlistForm = Selector('#allowlistEntryForm');
    await t.expect(allowlistForm.visible).ok('Allowlist entry form not displayed');
});

test(`User fills in valid information and sees confirmation message`, async t => {
    await t
        .typeText('#entryName', 'Valid Entry')
        .typeText('#entryDescription', 'Description for valid entry')
        .click('#saveButton');

    // Check for confirmation message
    const confirmationMessage = Selector('#confirmationMessage');
    await t.expect(confirmationMessage.innerText).eql('Allowlist entry created successfully');
});

test(`User sees error message for required field`, async t => {
    await t.click('#saveButton');

    // Check for error message indicating required field
    const errorMessage = Selector('#errorMessage');
    await t.expect(errorMessage.innerText).contains('This field is required');
});

test(`New entry is visible in the allowlist`, async t => {
    await t
        .click("#viewAllowlistButton")
        .expect(Selector('#allowlist').innerText).contains('Valid Entry');
});

test(`API endpoint is called when creating an allowlist entry`, async t => {
    // This would typically be verified in a mock environment
    await t.expect(Selector('#apiCallStatus').innerText).eql('API called successfully for allowlist entry');
});

test(`User without permissions sees authorization error message`, async t => {
    // Assume logging in with a user without permissions
    await t
        .typeText('#username', 'userWithoutPermissions')
        .typeText('#password', 'password123')
        .click('#loginButton')
        .click(Selector('#createAllowlistButton'));

    const authorizationErrorMessage = Selector('#authorizationErrorMessage');
    await t.expect(authorizationErrorMessage.innerText).eql('You do not have permission to perform this action');
});

test(`Allowlisting UI maintains consistency across devices`, async t => {
    // Resize the browser window to simulate different devices
    await t.resizeWindow(320, 480);
    await t.expect(Selector('#allowlistEntryForm').getStyleProperty('width')).eql('100%');

    await t.resizeWindow(1280, 800);
    await t.expect(Selector('#allowlistEntryForm').getStyleProperty('width')).eql('80%');
});

test(`No recommendations message when none accepted`, async t => {
    await t.click('#viewAllowlistingInterface');

    const noRecommendationsMessage = Selector('#noRecommendationsMessage');
    await t.expect(noRecommendationsMessage.innerText).eql('No recommendations available to create an allowlist entry');
});

test(`User can edit or delete allowlist entries`, async t => {
    await t
        .click(Selector('#allowlist').child('#validEntry'))
        .click('#editButton')
        .typeText('#entryDescription', 'Updated description')
        .click('#saveButton');

    // Verify that the update has been reflected
    await t.expect(Selector('#validEntryDescription').innerText).eql('Updated description');

    await t.click('#deleteButton');
    
    // Confirm deletion
    await t.expect(Selector('#validEntry').exists).notOk('Entry should be deleted');
});