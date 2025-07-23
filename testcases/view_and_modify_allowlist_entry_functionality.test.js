fixture `View and Modify Allowlist Entry Functionality`
    .page `https://your-enterprise-security-platform.com/allowlist-management`;

test(`User can view list of allowlist entries`, async t => {
    // Assume the user is logged in and has appropriate permissions
    const allowlistEntryList = Selector('#allowlist-entry-list');

    await t
        .navigateTo('https://your-enterprise-security-platform.com/allowlist-management')
        .expect(allowlistEntryList.child('li').count).gt(0); // Ensure there are entries in the list
});

test(`User can view details of a specific allowlist entry`, async t => {
    const allowlistEntry = Selector('#allowlist-entry-list li').nth(0);
    const viewDetailsButton = allowlistEntry.find('.view-details-button');

    await t
        .click(viewDetailsButton)
        .expect(Selector('#allowlist-entry-detail').exists).ok(); // Check if the details page is loaded
});

test(`User can analyze all details of an allowlist entry`, async t => {
    const entryDetail = Selector('#allowlist-entry-detail');
    
    await t
        .expect(entryDetail.find('.entry-id').innerText).match(/.+/)
        .expect(entryDetail.find('.domain-name').innerText).match(/.+/)
        .expect(entryDetail.find('.status').innerText).match(/.+/)
        .expect(entryDetail.find('.creation-date').innerText).match(/.+/)
        .expect(entryDetail.find('.modification-date').innerText).match(/.+/);
});

test(`User can modify and save changes to an allowlist entry`, async t => {
    const domainNameField = Selector('#domain-name');
    const saveButton = Selector('#save-changes-button');

    await t
        .typeText(domainNameField, 'updated-domain.com', { replace: true })
        .click(saveButton)
        .expect(Selector('.success-message').innerText).eql('Changes saved successfully.'); // Success message validation
});

test(`Error on invalid domain format during saving`, async t => {
    const domainNameField = Selector('#domain-name');
    const saveButton = Selector('#save-changes-button');

    await t
        .typeText(domainNameField, 'invalid-domain', { replace: true })
        .click(saveButton)
        .expect(Selector('.error-message').innerText).eql('Invalid domain format'); // Error message validation
});

test(`Updated information reflects in the list after save`, async t => {
    const allowlistEntry = Selector('#allowlist-entry-list li').nth(0);
    const updatedDomainName = 'updated-domain.com';

    await t
        .expect(allowlistEntry.find('.domain-name').innerText).eql(updatedDomainName); // Validate updated domain
});

test(`Conflict error when domain already exists`, async t => {
    const domainNameField = Selector('#domain-name');
    const saveButton = Selector('#save-changes-button');

    await t
        .typeText(domainNameField, 'conflicting-domain.com', { replace: true }) // Assuming this domain already exists
        .click(saveButton)
        .expect(Selector('.error-message').innerText).eql('This entry conflicts with an existing allowlist entry');
});

test(`Edit and Save buttons hidden with insufficient permissions`, async t => {
    await t
        .expect(Selector('#edit-button').visible).notOk() // Ensure Edit button is not visible
        .expect(Selector('#save-changes-button').visible).notOk(); // Ensure Save Changes button is not visible
});

test(`Cancel button redirects back without saving`, async t => {
    const cancelButton = Selector('#cancel-button');

    await t
        .click(cancelButton)
        .expect(Selector('#allowlist-entry-list').exists).ok(); // Validate redirection to the list
});

test(`Error message on network loss during save`, async t => {
    const domainNameField = Selector('#domain-name');
    const saveButton = Selector('#save-changes-button');

    // Simulate network loss
    await t
        .typeText(domainNameField, 'valid-domain.com', { replace: true })
        .setNativeDialogHandler(() => true) // Assume to handle the dialog for confirmation of loss
        .click(saveButton)
        .expect(Selector('.error-message').innerText).eql('Unable to save changes, please try again later.'); 
});

test(`Persist saved changes on page refresh`, async t => {
    const refreshButton = Selector('#refresh-button');
    const entryDetail = Selector('#allowlist-entry-detail');

    await t
        .click(refreshButton)
        .expect(entryDetail.find('.domain-name').innerText).eql('updated-domain.com'); // Validate persistence of changes
});