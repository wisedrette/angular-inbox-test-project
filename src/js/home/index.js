import angular from 'angular';

let homeModule = angular.module('app.home', []);

// Include UI-Router config settings
import HomeConfig from './home.config';
homeModule.config(HomeConfig);


// Controllers
import HomeCtrl from './home.controller';
homeModule.controller('HomeCtrl', HomeCtrl);

// Scroll directive
homeModule.directive("scroll", function ($rootScope) {
    return function(scope, element, attrs) {
        let offset = 50;
        angular.element(element).bind("scroll", function(e) {
            if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight - offset && !$rootScope.loadMore) {
                $rootScope.loadMore = true;
                scope.$apply();
            }
        });
    };
});

export default homeModule;
