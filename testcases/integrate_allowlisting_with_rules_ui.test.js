fixture`Integrate Allowlisting with Rules UI`
    .page`http://example.com/rules-ui`;

test('User should see a list of all allowlist entries applied to the rules', async t => {
    // Navigate to the allowlist section
    await t
        .click(Selector('a').withText('Allowlist Section'))
        .expect(Selector('.allowlist-entry').count).gt(0); // Check if there are allowlist entries displayed
});

test('State of each entry should be displayed with corresponding link', async t => {
    // Ensure we are in the allowlist section
    await t
        .click(Selector('a').withText('Allowlist Section'));
    
    // Check that the states are displayed properly
    const states = ['Deployed', 'Errors', 'Disabled'];
    for (const state of states) {
        await t
            .expect(Selector('.allowlist-entry').withText(state).exists).ok(`State ${state} is not displayed`);
    }
});

test('Add Entry button should display a form for creating a new rule allowlist entry', async t => {
    // Click the Add Entry button
    await t
        .click(Selector('button').withText('Add Entry'))
        .expect(Selector('#add-entry-form').visible).ok(); // Check if the form is displayed
});

test('User should be able to add a new allowlist entry with valid data', async t => {
    await t
        .click(Selector('button').withText('Add Entry'))
        .typeText(Selector('#entry-name'), 'New Entry') // Fill the entry name
        .click(Selector('button').withText('Submit')) // Submit the form
        .expect(Selector('.allowlist-entry').withText('New Entry').exists).ok(); // Check if the new entry is displayed
});

test('Error message should be displayed on invalid data submission', async t => {
    await t
        .click(Selector('button').withText('Add Entry'))
        .click(Selector('button').withText('Submit')) // Submit without filling required fields
        .expect(Selector('.error-message').visible).ok(); // Check for error message
});

test('New allowlist entry should persist after refreshing the Rules UI', async t => {
    await t
        .click(Selector('button').withText('Add Entry'))
        .typeText(Selector('#entry-name'), 'Persistent Entry')
        .click(Selector('button').withText('Submit'));

    // Refresh the page
    await t.eval(() => location.reload());

    // Check if the entry is still visible
    await t.expect(Selector('.allowlist-entry').withText('Persistent Entry').exists).ok();
});

test('User should be able to view, add, and manage allowlist entries with appropriate role', async t => {
    // Assume user has appropriate role
    await t
        .click(Selector('a').withText('Allowlist Section'))
        .expect(Selector('button').withText('Add Entry').visible).ok(); // Check if Add Entry button is visible
});

test('Error message should be displayed for insufficient permissions', async t => {
    // Assume user does not have permission
    await t
        .click(Selector('a').withText('Allowlist Section'))
        .expect(Selector('.permission-error').visible).ok(); // Check for error message
});

test('User should be redirected to detailed view of errors when clicking a state link', async t => {
    await t
        .click(Selector('a').withText('Allowlist Section'))
        .click(Selector('.allowlist-entry').withText('Errors')) // Click the Errors link
        .expect(Selector('#error-detail-view').visible).ok(); // Check if redirected to error detail view
});

test('Additional information about an entry should be displayed in a tooltip on hover', async t => {
    await t
        .hover(Selector('.allowlist-entry').nth(0)) // Hover over the first entry
        .expect(Selector('.tooltip').visible).ok(); // Check if the tooltip is displayed
});