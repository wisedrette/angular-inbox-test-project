class AppFooterCtrl {
    constructor($scope, $rootScope, AppConstants) {
        'ngInject';

        $rootScope.signedIn = false;

        // When callback is received, we need to process authentication.
        $scope.signInCallback = function (authResult) {
            if (authResult['error'] != 'user_signed_out')
                $scope.$apply(function () {
                    if (authResult['access_token']) {
                        $rootScope.signedIn = true;
                    } else if (authResult['error']) {
                        $rootScope.signedIn = false;
                    }
                });
        };

        // Render the sign in button.
        $scope.renderSignInButton = function () {
            gapi.signin.render('signInButton',
                {
                    'callback': $scope.signInCallback,
                    'clientid': AppConstants.googleApiClientID,
                    'requestvisibleactions': 'http://schemas.google.com/AddActivity',
                    'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/gmail.readonly',
                    'cookiepolicy': 'single_host_origin'
                }
            );
        };

        $scope.renderSignInButton();
    }
}

let AppFooter = {
    controller: AppFooterCtrl,
    templateUrl: 'components/footer.html'
};

export default AppFooter;
