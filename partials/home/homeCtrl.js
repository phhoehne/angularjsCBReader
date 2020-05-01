'use strict';
angular.module('CBRapp.home', [])
    .controller('HomeCtrl', ['$scope', '$state', '$http', '$mdDialog', 'serverPath', function ($scope, $state, $http, $mdDialog, serverPath) {

        $scope.pathToCBRServer = serverPath;
        $scope.thumbPath = $scope.pathToCBRServer + "/thumbs";
        $scope.books = [];
        $scope.search = '';

        $scope.getBookList = function () {
            $http.get($scope.pathToCBRServer + "/api.php/books")
                .then(function (response) {
                    $scope.books = response.data;
                });
        };

        $scope.openBook = function(title) {
            $state.go('book', {'title': title});
        }

        // to focus on input element after it appears
        $scope.$watch(function () {
            return document.querySelector('#search-bar:not(.ng-hide)');
        }, function () {
            document.getElementById('search-input').focus();
        }); 


        $scope.showHelp = function(event) {
            $mdDialog.show ({
               clickOutsideToClose: true,
               scope: $scope,        
               preserveScope: true,           
               templateUrl: "./partials/home/help.html",
               controller: function DialogController($scope, $mdDialog) {
                  $scope.closeDialog = function() {
                     $mdDialog.hide();
                  }
               }
            });
         };        

        $scope.getBookList();

    }]);