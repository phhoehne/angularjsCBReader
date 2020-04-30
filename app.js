angular.module('CBRapp', [
    'ngMaterial',
    'ui.router',
    'ngAnimate', 
    'ngStorage',
    'mb-adaptive-backgrounds',
    'CBRapp.home',
    'CBRapp.book'
])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix("");

    $stateProvider

            .state('home', {
                url: "/",
                abstract: false,
                templateUrl: "partials/home/home.html",
                controller: 'HomeCtrl'
            })
            .state('book', {
                url: "/book?title",
                abstract: false,
                templateUrl: "partials/book/book.html",
                controller: 'BookCtrl'
            })            ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

}])
.config(function ($mdThemingProvider) {
// Set Theme colors
$mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('pink')
        .dark()
        ;
// Enable browser color
$mdThemingProvider.enableBrowserColor();
})