'use strict';
angular.module('CBRapp.book', [])
    .controller('BookCtrl', ['$scope', '$state', '$stateParams', '$http', '$window', 'serverPath', function ($scope, $state, $stateParams, $http, $window, serverPath) {
        $scope.currentBook = $stateParams.title;

        $scope.pathToCBRServer = serverPath;
        var url = $scope.pathToCBRServer + "/api.php/pages/" + $scope.currentBook;

        var pageImageUrlBase = $scope.pathToCBRServer + "/api.php/page/";
        var placeholderPageUrl = "images/pixel.png";
        $scope.numberOfPages = 0;
        $scope.currentPage = 1;
        $scope.jumpTarget = 1;
        $scope.pageImageUrl = "";
        $scope.preloadedImageURL = placeholderPageUrl;
        $scope.showControls = false;
        $scope.showControlsDuration = "10";
        $scope.showLoader = false;
        $scope.pageHeight = $window.innerHeight + "px";

        var preloadNextPage = function () {
            if (($scope.currentPage + 1) < $scope.numberOfPages) {
                $scope.preloadedImageURL = pageImageUrlBase + $scope.currentBook + "/" + ($scope.currentPage + 1);
            }
        };

        var getLastPageRead = function () {
            var cacheEntry = localStorage.getItem($scope.currentBook);
            if (cacheEntry !== null) {
                return cacheEntry;
            } else {
                return 1;
            }
        };

        var setCurrentPageURL = function () {
            $scope.showLoader = true;
            $scope.pageImageUrl = pageImageUrlBase + $scope.currentBook + "/" + $scope.currentPage;
            preloadNextPage();
            localStorage.setItem($scope.currentBook, $scope.currentPage);
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.numberOfPages) {
                $scope.goToPage(++$scope.currentPage);
            }
        };

        $scope.previousPage = function () {
            if ($scope.currentPage > 1) {
                $scope.goToPage(--$scope.currentPage);
            }
        };

        $scope.lastPage = function () {
            if ($scope.currentPage < $scope.numberOfPages) {
                $scope.goToPage($scope.numberOfPages);
            }
        };

        $scope.firstPage = function () {
            if ($scope.currentPage > 1) {
                $scope.goToPage(1);
            }
        };

        $scope.goToPage = function (page) {
            if (Number.isInteger(page) && page > 0 && page <= $scope.numberOfPages) {
                $scope.currentPage = page;
                $scope.jumpTarget = page;
                setCurrentPageURL();
            } else {
                $scope.jumpTarget = $scope.currentPage;
            }
        };

        $scope.goHome = function () {
            $state.go('home');
        };

        var handleKeyEvents = function (event) {
            switch (event.key) {
                case 'ArrowLeft':
                    $scope.previousPage();
                    break;
                case 'ArrowRight':
                    $scope.nextPage();
                    break;
                case 'ArrowUp':
                    $scope.goHome()
                    break;
                case 'ArrowDown':
                    $scope.showControls = true;
                    break;
                case 'Home':
                    $scope.goHome();
                    break;
            }
            $scope.$apply();
        };

        $window.addEventListener("keydown", handleKeyEvents, false);
        $window.addEventListener("keypressed", handleKeyEvents, false);

        $window.addEventListener('mousemove', function () {
            if ($scope.showDetail && !$scope.showControls) {
                $scope.showControls = true;
                $scope.$apply();
            }
        });

        $window.addEventListener('resize', function () {
            $scope.pageHeight = $window.innerHeight + "px";
            $scope.$apply();
        });

        $window.addEventListener('orientationchange', function () {
            $scope.pageHeight = $window.innerHeight + "px";
            $scope.$apply();
        });

        $http.get(url)
            .then(function (response) {
                $scope.currentPage = getLastPageRead();
                $scope.jumpTarget = $scope.currentPage;
                $scope.numberOfPages = response.data.numberOfPages;
                setCurrentPageURL();
            });
    }])
    .directive('ngShowTimed', function ($timeout, $parse) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.trigger);
                scope.$watch(model, function (value) {
                    if (value === true) {
                        element.css('display', '');
                        $timeout(function () {
                            scope.$apply(model.assign(scope, false));
                        }, (attrs.duration * 1000));
                    } else {
                        element.css('display', 'none');
                    }
                });
            }
        };
    })
    .directive('imageonload', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.toggle);
                element.bind('load', function () {
                    scope.$apply(model.assign(scope, false));
                });
            }
        };
    })
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })
    .directive('onImageLoadError', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on('error', function () {
                    element.attr('src', attr.onImageLoadError);
                })
            }
        }
    });    