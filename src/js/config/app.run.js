function AppRun(AppConstants, $rootScope) {
    'ngInject';

    console.log('Starting app');
    $rootScope.loadMore = true;

    // change page title based on state
    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
        $rootScope.setPageTitle(toState.title);
    });

    // Helper method for setting the page's title
    $rootScope.setPageTitle = (title) => {
        $rootScope.pageTitle = '';
        $rootScope.title = '';
        if (title) {
            $rootScope.pageTitle += title;
            $rootScope.title = title;
            $rootScope.pageTitle += ' \u2014 ';
        }
        $rootScope.pageTitle += AppConstants.appName;
    };

}

export default AppRun;
