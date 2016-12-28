import angular from 'angular';

let componentsModule = angular.module('app.components', []);


// Components
import AppHeader from './header.component';
componentsModule.component('appHeader', AppHeader);

import AppFooter from './footer.component';
componentsModule.component('appFooter', AppFooter);


export default componentsModule;
