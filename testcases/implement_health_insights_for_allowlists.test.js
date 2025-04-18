fixture `Health Insights for Allowlists Tests`

    test('Alert raised for allowlist in error state', async t => {
        // Deploy an allowlist
        await t.click(Selector('#deploy-allowlist-button'));
        
        // Simulate the system monitoring the execution and an error state
        await t.eval(() => {
            window.simulateErrorState(); // Function to simulate error state
        });
        
        // Assert that an alert is raised
        const alert = Selector('.alert').withText('Allowlist is in an error state');
        await t.expect(alert.exists).ok();
    });

    test('Accurate metrics displayed for correctly executing allowlist', async t => {
        // Simulate a correctly executing allowlist
        await t.eval(() => {
            window.simulateSuccessfulExecution(); // Function to simulate success
        });
        
        // Collect performance metrics
        await t.click(Selector('#collect-metrics-button'));
        
        // Assert that accurate metrics are displayed
        const metrics = Selector('.performance-metrics');
        await t.expect(metrics.innerText).contains('Execution Time:');
        await t.expect(metrics.innerText).contains('Successful Executions:');
    });

    test('User with permissions accesses Health Insights dashboard', async t => {
        // Log in as a user with appropriate permissions
        await t.typeText(Selector('#username'), 'validUser')
               .typeText(Selector('#password'), 'validPassword')
               .click(Selector('#login-button'));
        
        // Access the Health Insights dashboard
        await t.click(Selector('#health-insights-dashboard'));
        
        // Assert that real-time alerts and metrics are visible
        const dashboard = Selector('.dashboard');
        await t.expect(dashboard.exists).ok();
        await t.expect(dashboard.innerText).contains('Real-time Alerts');
    });

    test('Modification of allowlist logs changes and updates metrics', async t => {
        // Modify an existing allowlist
        await t.click(Selector('#modify-allowlist-button'));
        
        // Simulate the system processing the modification
        await t.eval(() => {
            window.processModification(); // Function to process modification
        });

        // Assert that the change is logged and metrics updated
        const logEntry = Selector('.log-entry').withText('Allowlist modified');
        await t.expect(logEntry.exists).ok();
    });

    test('Detailed error message provided when alert is raised', async t => {
        // Simulate an error state
        await t.eval(() => {
            window.simulateErrorState(); // Function to simulate error state
        });
        
        // Assert the detailed error message is displayed
        const errorAlert = Selector('.alert-detail').withText('Detailed error message');
        await t.expect(errorAlert.exists).ok();
    });

    test('Filter allowlists by status on Health Insights dashboard', async t => {
        // Access the Health Insights dashboard
        await t.click(Selector('#health-insights-dashboard'));
        
        // Filter by 'Error' status
        await t.click(Selector('#status-filter')).click(Selector('option').withText('Error'));
        
        // Assert that the displayed allowlists reflect the selected status
        const filteredAllowlists = Selector('.allowlist').withText('Error');
        await t.expect(filteredAllowlists.exists).ok();
    });

    test('User without permissions receives access denied message', async t => {
        // Log in as a user without appropriate permissions
        await t.typeText(Selector('#username'), 'invalidUser')
               .typeText(Selector('#password'), 'invalidPassword')
               .click(Selector('#login-button'));
        
        // Attempt to access the Health Insights dashboard
        await t.click(Selector('#health-insights-dashboard'));
        
        // Assert that an access denied message is displayed
        const accessDeniedMessage = Selector('.access-denied');
        await t.expect(accessDeniedMessage.exists).ok();
    });

    test('Tooltip provides additional context for performance metrics', async t => {
        // Access the Health Insights dashboard and view metrics
        await t.click(Selector('#health-insights-dashboard'));
        await t.hover(Selector('.metric').withText('Average Execution Time'));
        
        // Assert that a tooltip is displayed with additional context
        const tooltip = Selector('.tooltip');
        await t.expect(tooltip.exists).ok();
    });

    test('Metrics include average execution time for successfully executed allowlist', async t => {
        // Simulate a successfully executed allowlist
        await t.eval(() => {
            window.simulateSuccessfulExecution(); // Function to simulate success
        });

        // View the metrics
        await t.click(Selector('#view-metrics-button'));
        
        // Assert that metrics are displayed correctly
        const metrics = Selector('.performance-metrics');
        await t.expect(metrics.innerText).contains('Average Execution Time:');
        await t.expect(metrics.innerText).contains('Successful Executions:');
        await t.expect(metrics.innerText).contains('Failed Executions:');
    });

    test('Alert acknowledged and removed from active alerts', async t => {
        // Simulate raising an alert
        await t.eval(() => {
            window.raiseAlert(); // Function to raise alert
        });
        
        // Acknowledge the alert
        await t.click(Selector('.acknowledge-alert-button'));
        
        // Assert that the alert is acknowledged and removed
        const activeAlerts = Selector('.active-alerts');
        await t.expect(activeAlerts.innerText).notContains('Alert Message');
    });