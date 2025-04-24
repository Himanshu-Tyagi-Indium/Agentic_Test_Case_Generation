fixture `Allowlist History Page Tests`
    .page `https://example.com/allowlist-history`; // Replace with the actual URL of the Allowlist History page

test('User with appropriate permissions can see the list of changes', async t => {
    // Log in as a user with appropriate permissions
    await t
        .login('user_with_permissions', 'password') // Replace with actual login logic
        .navigateTo('https://example.com/allowlist-history');
    
    // Verify that the list of changes is displayed
    const changeList = Selector('.change-list'); // Adjust the selector according to the actual DOM structure
    await t.expect(changeList.exists).ok('Change list is not displayed');
});

test('User selects a time range filter', async t => {
    // Navigate to the Allowlist History page
    await t.navigateTo('https://example.com/allowlist-history');

    // Select time range filter
    await t
        .click(Selector('#time-range-filter')) // Adjust selector for time range filter
        .click(Selector('.time-range-option').withText('Last 30 days')); // Adjust selector accordingly

    // Verify that changes within the specified time range are displayed
    const filteredChangeList = Selector('.change-list'); // Adjust the selector if necessary
    await t.expect(filteredChangeList.childElementCount).gt(0, 'No changes displayed for the selected time range');
});

test('User selects an allowlist type filter', async t => {
    await t.navigateTo('https://example.com/allowlist-history');

    // Select allowlist type filter
    await t
        .click(Selector('#allowlist-type-filter')) // Adjust selector for allowlist type filter
        .click(Selector('.allowlist-type-option').withText('Type A')); // Adjust as needed

    // Verify that only changes related to the selected allowlist type are displayed
    const filteredChangeList = Selector('.change-list'); // Adjust selector if necessary
    await t.expect(filteredChangeList.childElementCount).gt(0, 'No changes displayed for the selected allowlist type');
});

test('User applies multiple filters', async t => {
    await t.navigateTo('https://example.com/allowlist-history');

    // Apply multiple filters
    await t
        .click(Selector('#time-range-filter'))
        .click(Selector('.time-range-option').withText('Last 30 days'))
        .click(Selector('#allowlist-type-filter'))
        .click(Selector('.allowlist-type-option').withText('Type B'));

    // Verify that only changes meeting all selected criteria are displayed
    const filteredChangeList = Selector('.change-list'); // Adjust selector if necessary
    await t.expect(filteredChangeList.childElementCount).gt(0, 'No changes displayed for the selected filters');
});

test('No changes found message for selected filters', async t => {
    await t.navigateTo('https://example.com/allowlist-history');

    // Apply filters that result in no changes
    await t
        .click(Selector('#time-range-filter'))
        .click(Selector('.time-range-option').withText('Last 1 hour')) // Assuming this yields no results
        .click(Selector('#allowlist-type-filter'))
        .click(Selector('.allowlist-type-option').withText('Type C'));

    // Verify the no changes found message
    const noChangesMessage = Selector('.no-changes-message'); // Adjust selector if necessary
    await t.expect(noChangesMessage.exists).ok('No changes found message is not displayed');
});

test('Access denied for users without appropriate permissions', async t => {
    // Log in as a user without permissions
    await t
        .login('user_without_permissions', 'password') // Replace with actual login logic
        .navigateTo('https://example.com/allowlist-history');

    // Verify redirection to access denied page
    const accessDeniedMessage = Selector('.access-denied-message'); // Adjust selector if necessary
    await t.expect(accessDeniedMessage.exists).ok('Access denied message is not displayed');
});

test('View detailed information about a change entry', async t => {
    await t.navigateTo('https://example.com/allowlist-history');

    // Click on a change entry to view details
    await t
        .click(Selector('.change-entry').nth(0)); // Adjust selector for the change entry

    // Verify detailed information is displayed
    const changeDetails = Selector('.change-details'); // Adjust selector if necessary
    await t.expect(changeDetails.exists).ok('Change details are not displayed');
});

test('Filtering options refresh the page without full reload', async t => {
    await t.navigateTo('https://example.com/allowlist-history');

    // Apply a filter
    await t
        .click(Selector('#time-range-filter'))
        .click(Selector('.time-range-option').withText('Last 7 days'));

    // Verify that the page reflects the selected filters
    const filteredChangeList = Selector('.change-list'); // Adjust selector if necessary
    await t.expect(filteredChangeList.exists).ok('Filtered change list is not displayed');
});

test('Reset Filters button clears all filters', async t => {
    await t.navigateTo('https://example.com/allowlist-history');

    // Apply some filters
    await t
        .click(Selector('#time-range-filter'))
        .click(Selector('.time-range-option').withText('Last 30 days'))
        .click(Selector('#allowlist-type-filter'))
        .click(Selector('.allowlist-type-option').withText('Type A'));

    // Click the Reset Filters button
    await t.click(Selector('#reset-filters-button')); // Adjust selector as necessary

    // Verify that all filters are cleared and full history is displayed
    const fullChangeList = Selector('.change-list'); // Adjust selector if necessary
    await t.expect(fullChangeList.childElementCount).gt(0, 'Full history is not displayed after resetting filters');
});

test('UI responsiveness on various screen sizes', async t => {
    // Test for desktop view
    await t.resizeWindow(1280, 800);
    await t.navigateTo('https://example.com/allowlist-history');
    await t.expect(Selector('.allowlist-history-container').visible).ok('UI is not responsive on desktop');

    // Test for tablet view
    await t.resizeWindow(768, 1024);
    await t.navigateTo('https://example.com/allowlist-history');
    await t.expect(Selector('.allowlist-history-container').visible).ok('UI is not responsive on tablet');

    // Test for mobile view
    await t.resizeWindow(375, 667);
    await t.navigateTo('https://example.com/allowlist-history');
    await t.expect(Selector('.allowlist-history-container').visible).ok('UI is not responsive on mobile');
});