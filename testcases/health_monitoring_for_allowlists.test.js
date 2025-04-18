fixture `Health Monitoring for Allowlists`

test('Allowlist executes successfully and logs status as Healthy', async t => {
    // Simulate allowlist execution
    await t.click(Selector('#execute-allowlist'));
    
    // Assert that the system logs 'Healthy'
    const status = await Selector('#status-log').innerText;
    await t.expect(status).eql('Healthy');
});

test('Allowlist encounters an error during execution and logs status as Error', async t => {
    // Simulate allowlist execution that encounters an error
    await t.click(Selector('#execute-allowlist-error'));
    
    // Assert that the system logs 'Error'
    const status = await Selector('#status-log').innerText;
    await t.expect(status).eql('Error');
});

test('Allowlist in Error state for more than 30 minutes raises health insight notification', async t => {
    // Simulate allowlist in error state for an extended duration
    await t.click(Selector('#simulate-long-error'));
    
    // Check health monitoring after 30 minutes
    await t.wait(1800000); // Wait for 30 minutes (1800000 ms)
    
    // Assert that a health insight notification is raised
    const notification = await Selector('#health-insight-notification').innerText;
    await t.expect(notification).contains('Health insight for allowlist');
});

test('Multiple rule entries fail during execution and logs each failing entry', async t => {
    // Simulate execution with multiple rule entries failing
    await t.click(Selector('#execute-allowlist-multiple-errors'));
    
    // Assert that each failing rule entry is logged
    const errorEntries = await Selector('#error-log').innerText;
    await t.expect(errorEntries).contains('Rule entry failed');
});

test('User with sufficient RBAC permissions views health monitoring dashboard', async t => {
    // Simulate login with sufficient permissions
    await t.click(Selector('#login-sufficient-permissions'));
    
    // Navigate to health monitoring dashboard
    await t.click(Selector('#health-monitoring-dashboard'));
    
    // Assert that the user sees health status summary
    const summary = await Selector('#health-status-summary').innerText;
    await t.expect(summary).contains('Error');
});

test('User with insufficient RBAC permissions is denied access to dashboard', async t => {
    // Simulate login with insufficient permissions
    await t.click(Selector('#login-insufficient-permissions'));
    
    // Attempt to access health monitoring dashboard
    await t.click(Selector('#health-monitoring-dashboard'));
    
    // Assert that access is denied
    const message = await Selector('#access-denied-message').innerText;
    await t.expect(message).eql('Access Denied');
});

test('Allowlist executes without issues for three consecutive executions and logs status as Stable', async t => {
    // Simulate three successful executions
    for (let i = 0; i < 3; i++) {
        await t.click(Selector('#execute-allowlist'));
    }
    
    // Assert that the system logs 'Stable'
    const status = await Selector('#status-log').innerText;
    await t.expect(status).eql('Stable');
});

test('User views details of health insight notification', async t => {
    // Simulate generating a health insight notification
    await t.click(Selector('#generate-health-insight'));
    
    // View notification details
    await t.click(Selector('#view-notification-details'));
    
    // Assert that relevant details are displayed
    const details = await Selector('#notification-details').innerText;
    await t.expect(details).contains('allowlist name');
    await t.expect(details).contains('error details');
    await t.expect(details).contains('timestamp');
});

test('Issue resolved and allowlist executes successfully clearing the health insight notification', async t => {
    // Simulate resolving the issue
    await t.click(Selector('#resolve-issue'));
    
    // Simulate successful execution
    await t.click(Selector('#execute-allowlist'));
    
    // Assert that the health insight notification is cleared
    const notification = await Selector('#health-insight-notification').innerText;
    await t.expect(notification).eql('');
});

test('Health monitoring feature disabled in global settings ceases logging', async t => {
    // Disable health monitoring feature
    await t.click(Selector('#disable-health-monitoring'));
    
    // Simulate allowlist execution
    await t.click(Selector('#execute-allowlist'));
    
    // Assert that no health status or insights are logged
    const status = await Selector('#status-log').innerText;
    await t.expect(status).eql('');
});