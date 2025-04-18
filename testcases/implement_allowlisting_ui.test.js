fixture `Allowlisting UI Tests`
    .page `https://your-anvilogic-platform-url.com`;

test('Verify Allowlists is visible in the Detect section', async t => {
    // Ensure user is logged in (this step can be an existing function or a test step)
    await t
        .useRole(loggedInUserRole) // Assuming a role for logged-in user
        .navigateTo('https://your-anvilogic-platform-url.com');

    // Check if 'Allowlists' is present under 'Detect' section
    const allowlistsMenuItem = Selector('nav').find('li').withText('Allowlists');
    await t
        .expect(allowlistsMenuItem.exists).ok('Allowlists menu item is not visible under Detect section');
});

test('Verify Allowlist icon matches Splunk app allowlisting', async t => {
    const allowlistsMenuItem = Selector('nav').find('li').withText('Allowlists');
    await t
        .hover(allowlistsMenuItem) // Hover to reveal icon
        .expect(allowlistsMenuItem.find('img').hasAttribute('src', 'expected_icon_path')).ok('Icon does not match the expected Splunk app allowlisting icon');
});

test('Redirect to Allowlisting UI page on clicking Allowlists menu', async t => {
    const allowlistsMenuItem = Selector('nav').find('li').withText('Allowlists');
    await t
        .click(allowlistsMenuItem)
        .expect(Selector('h1').innerText).eql('Allowlisting UI', 'Did not redirect to Allowlisting UI page');
});

test('Check presence of Rule Allowlists and Global Allowlists selectors', async t => {
    await t
        .expect(Selector('#rule-allowlists-selector').exists).ok('Rule Allowlists selector is not present')
        .expect(Selector('#global-allowlists-selector').exists).ok('Global Allowlists selector is not present');
});

test('Display relevant entries for Rule Allowlists', async t => {
    await t
        .click(Selector('#rule-allowlists-selector'))
        .expect(Selector('#rule-entries').child('li').count).gt(0, 'No entries displayed for Rule Allowlists');
});

test('Display relevant entries for Global Allowlists', async t => {
    await t
        .click(Selector('#global-allowlists-selector'))
        .expect(Selector('#global-entries').child('li').count).gt(0, 'No entries displayed for Global Allowlists');
});

test('Redirect to Allowlist History page on button click', async t => {
    await t
        .click(Selector('#allowlist-history-button'))
        .expect(Selector('h1').innerText).eql('Allowlist History', 'Did not redirect to Allowlist History page');
});

test('Display error message on failed loading of allowlist entries', async t => {
    // Simulating server error by mocking or adjusting application state
    await t
        .navigateTo('https://your-anvilogic-platform-url.com/allowlisting-ui?simulateError=true')
        .expect(Selector('.error-message').innerText).eql('Unable to load allowlist entries. Please try again later.', 'Error message not displayed correctly');
});

test('Display 403 Forbidden error for unauthorized access', async t => {
    await t
        .navigateTo('https://your-anvilogic-platform-url.com/allowlisting-ui')
        .expect(Selector('.error-message').innerText).eql('403 Forbidden', 'Did not see 403 Forbidden error message');
});

test('Display no entries available message when no entries exist', async t => {
    await t
        .click(Selector('#rule-allowlists-selector')) // Assume this selector is already present
        .expect(Selector('.no-entries-message').innerText).eql('No allowlist entries available.', 'No entries message not displayed correctly');
});