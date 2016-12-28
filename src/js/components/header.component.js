class AppHeaderCtrl {
    constructor($scope, $rootScope) {
        'ngInject';

        $scope.signOut = function(){
            $rootScope.signedIn = false;
            gapi.auth.signOut();
        }
    }
}

let AppHeader = {
    controller: AppHeaderCtrl,
    templateUrl: 'components/header.html'
};

export default AppHeader;
