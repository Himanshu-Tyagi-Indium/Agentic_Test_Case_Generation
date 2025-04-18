fixture `Integration with Tuning Insights`
    .page `https://your-enterprise-security-platform-url.com`

test('User with appropriate permissions accepts tuning insight and generates allowlist entry', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#login-button');

    // Navigate to Tuning Insights
    await t
        .click('#tuning-insights-menu');

    // Accept a tuning insight
    await t
        .click(Selector('.tuning-insight').withText('Some Tuning Insight').sibling('.accept-button'));

    // Verify notification for allowlist entry creation
    await t
        .expect(Selector('.notification').innerText).eql('Allowlist entry created successfully');
});

test('User views tuning insights list with Accept button', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#login-button');

    // Navigate to Tuning Insights
    await t
        .click('#tuning-insights-menu');

    // Verify that each tuning insight has an Accept button
    const insights = Selector('.tuning-insight');
    const count = await insights.count;

    for (let i = 0; i < count; i++) {
        await t
            .expect(insights.nth(i).find('.accept-button').exists).ok();
    }
});

test('Accepted tuning insight creates allowlist entry with correct parameters', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#login-button');

    // Accept a tuning insight
    await t
        .click('#tuning-insights-menu')
        .click(Selector('.tuning-insight').withText('Some Tuning Insight').sibling('.accept-button'));

    // Check the allowlist for the new entry
    await t
        .click('#allowlist-menu');

    await t
        .expect(Selector('.allowlist-entry').withText('Some Tuning Insight Source IP').exists).ok();
});

test('User without permissions receives error message when accepting tuning insight', async t => {
    // Log in as a user without permissions
    await t
        .typeText('#username', 'invalid_user')
        .typeText('#password', 'invalid_password')
        .click('#login-button');

    // Attempt to accept a tuning insight
    await t
        .click('#tuning-insights-menu')
        .click(Selector('.tuning-insight').withText('Some Tuning Insight').sibling('.accept-button'));

    // Verify error message
    await t
        .expect(Selector('.error-message').innerText).eql('You do not have permission to accept tuning insights');
});

test('System displays error message when allowlist entry creation fails', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#login-button');

    // Accept a tuning insight (simulate failure)
    await t
        .click('#tuning-insights-menu')
        .click(Selector('.tuning-insight').withText('Some Tuning Insight').sibling('.accept-button'));

    // Simulate a failure in allowlist creation
    await t
        .expect(Selector('.error-message').innerText).eql('Failed to create allowlist entry. Please try again later.');
});

test('New allowlist entry appears in allowlist management section', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#login-button');

    // Accept a tuning insight
    await t
        .click('#tuning-insights-menu')
        .click(Selector('.tuning-insight').withText('Some Tuning Insight').sibling('.accept-button'));

    // Navigate to the allowlist management section
    await t
        .click('#allowlist-menu');

    // Verify the new entry is listed
    await t
        .expect(Selector('.allowlist-entry').withText('Some Tuning Insight Source IP').exists).ok();
});

test('Duplicate acceptance of tuning insight is handled correctly', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#login-button');

    // Accept a tuning insight
    await t
        .click('#tuning-insights-menu')
        .click(Selector('.tuning-insight').withText('Some Tuning Insight').sibling('.accept-button'));

    // Attempt to accept the same tuning insight again
    await t
        .click(Selector('.tuning-insight').withText('Some Tuning Insight').sibling('.accept-button'));

    // Verify notification for duplicate entry
    await t
        .expect(Selector('.notification').innerText).eql('This insight has already been added to the allowlist.');
});

test('Action of accepting tuning insight is logged appropriately', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#login-button');

    // Accept a tuning insight
    await t
        .click('#tuning-insights-menu')
        .click(Selector('.tuning-insight').withText('Some Tuning Insight').sibling('.accept-button'));

    // Verify action is logged correctly
    await t
        .expect(Selector('.log-entry').withText('valid_user accepted Some Tuning Insight').exists).ok();
});

test('Allowlist entry conforms to validation rules', async t => {
    // Log in as a user with appropriate permissions
    await t
        .typeText('#username', 'valid_user')
        .typeText('#password', 'valid_password')
        .click('#login-button');

    // Accept a tuning insight
    await t
        .click('#tuning-insights-menu')
        .click(Selector('.tuning-insight').withText('Some Tuning Insight').sibling('.accept-button'));

    // Verify the entry in the allowlist meets validation criteria
    await t
        .expect(Selector('.allowlist-entry').withText('Some Tuning Insight Source IP').hasClass('valid-ip')).ok();
});