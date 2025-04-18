fixture `Audit History Functionality Tests`
    .page `http://your-enterprise-security-platform-url.com`;

test('Log action when an authorized user performs an allowlist action', async t => {
    // Log in as an authorized user
    await t
        .typeText('#username', 'authorizedUser')
        .typeText('#password', 'securePassword')
        .click('#loginButton');

    // Perform an action (Add) on an allowlist entry
    await t
        .click('#addAllowlistEntry')
        .typeText('#entryName', 'testEntry')
        .click('#submitButton');

    // Check if the action has been logged in the audit history
    await t
        .navigateTo('/audit-history')
        .expect(Selector('#logEntry').withText('Add').exists).ok();
});

test('View audit history as an authorized user', async t => {
    // Log in as an authorized user
    await t
        .typeText('#username', 'authorizedUser')
        .typeText('#password', 'securePassword')
        .click('#loginButton');

    // Navigate to audit history
    await t
        .navigateTo('/audit-history')
        .expect(Selector('#auditHistoryList').child('li').count).gt(0);
});

test('Request audit logs and check details as an authorized user', async t => {
    // Log in as an authorized user
    await t
        .typeText('#username', 'authorizedUser')
        .typeText('#password', 'securePassword')
        .click('#loginButton');

    // Request audit logs
    await t
        .navigateTo('/audit-history')
        .expect(Selector('#logDetails').withText('User ID').exists).ok()
        .expect(Selector('#logDetails').withText('Action Type').exists).ok()
        .expect(Selector('#logDetails').withText('Timestamp').exists).ok();
});

test('Search audit logs by date range', async t => {
    // Log in as an authorized user
    await t
        .typeText('#username', 'authorizedUser')
        .typeText('#password', 'securePassword')
        .click('#loginButton');

    // Search for logs within a date range
    await t
        .navigateTo('/audit-history')
        .typeText('#startDate', '2022-01-01')
        .typeText('#endDate', '2022-12-31')
        .click('#searchButton')
        .expect(Selector('#auditHistoryList').child('li').count).gt(0);
});

test('Unauthorized user access to audit history returns 403 error', async t => {
    // Log in as an unauthorized user
    await t
        .typeText('#username', 'unauthorizedUser')
        .typeText('#password', 'wrongPassword')
        .click('#loginButton');

    // Attempt to access audit history
    await t
        .navigateTo('/audit-history')
        .expect(Selector('#errorMessage').withText('403 Forbidden').exists).ok();
});

test('Old logs are deleted after retention period exceeds one year', async t => {
    // Simulate log retention check
    await t
        .navigateTo('/audit-history')
        .expect(Selector('#oldLogsCheck').withText('Old logs deleted').exists).ok();
});

test('Log error message on failure in logging mechanism', async t => {
    // Perform an action that triggers a logging failure
    await t
        .navigateTo('/allowlist-management')
        .click('#causeLoggingErrorButton') // This simulates an error in the logging mechanism
        .expect(Selector('#errorNotification').withText('Logging failed').exists).ok();
});

test('Display validation message for disallowed actions', async t => {
    // Log in as an authorized user
    await t
        .typeText('#username', 'authorizedUser')
        .typeText('#password', 'securePassword')
        .click('#loginButton');

    // Attempt to delete a non-existent entry
    await t
        .navigateTo('/allowlist-management')
        .click('#deleteNonExistentEntryButton')
        .expect(Selector('#validationMessage').withText('Action not allowed').exists).ok();
});

test('View detailed log entry information', async t => {
    // Log in as an authorized user
    await t
        .typeText('#username', 'authorizedUser')
        .typeText('#password', 'securePassword')
        .click('#loginButton');

    // Navigate to audit history and click on a log entry
    await t
        .navigateTo('/audit-history')
        .click(Selector('#auditHistoryList').child('li').nth(0))
        .expect(Selector('#logDetailUserId').exists).ok()
        .expect(Selector('#logDetailAction').exists).ok()
        .expect(Selector('#logDetailTimestamp').exists).ok();
});

test('Apply filters and refresh UI to show matching logs', async t => {
    // Log in as an authorized user
    await t
        .typeText('#username', 'authorizedUser')
        .typeText('#password', 'securePassword')
        .click('#loginButton');

    // Apply filters on audit history
    await t
        .navigateTo('/audit-history')
        .click('#filterButton')
        .typeText('#filterActionType', 'Add')
        .click('#applyFiltersButton')
        .expect(Selector('#auditHistoryList').child('li').withText('Add').count).gt(0);
});