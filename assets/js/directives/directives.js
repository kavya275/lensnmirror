angular.module('lensnmirrorApp.directives', [])

.directive('loadingMain', function () {
    return {
        restrict: 'AEC',
        templateUrl: 'directives/loading-main.html'
    };
})
    .directive('subLoader', function () {
    return {
        restrict: 'AEC',
        templateUrl: 'directives/loading-sub.html'
    };
})
 .directive('homenav', function ($timeout) {
        return {
            restrict: 'AEC',
            scope: {
					
            },
            link: function (scope, element, attrs) {
					
            },
            templateUrl: 'directives/homenav.html',
            controller:'headernavController'
        };

    })
 .directive('startupdetailheader', function ($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                    data:'=',
            },
            link: function (scope, element, attrs) {
                    
            },
            templateUrl: 'directives/startupdetailheader.html',
            controller:'startupdetailsCtrl'
        };

    })
    .directive('comment', function () {
        return {
            restrict: 'AEC',
            scope: {
                parentid:'=',
                queryid:'='
            },
            replace:true,
            templateUrl: 'directives/comment.html',
            controller:'conversationCtrl'
        };

    })
    .directive('conversation', function ($compile) {
        return {
            restrict: 'E',
            replace:true,
            scope: {
                conv:'='
            },
            templateUrl: 'directives/conversation.html',
            controller:'conversationCtrl'
        };

    })
 .directive('queryList', function () {
        return {
            restrict: 'AEC',
            scope: {
                    querydata:'=',
                pitchurl:'=',
                gid:'='
            },
            templateUrl: 'directives/queryList.html',
            controller:'queryListCtrl'
        };

    })
 .directive('queryStats', function () {
        return {
            restrict: 'AEC',
            scope: {
                    querystats:'='
            },
            templateUrl: 'directives/queryStats.html',
            controller:'queryStatsCtrl'
        };

    })
 .directive('profileDetailpic', function () {
        return {
            restrict: 'AEC',
            scope: {
                    profdet:'=',
                    creationdate:'=',
                status:'='
            },
            templateUrl: 'directives/profilePic.html',
            controller:'profilePicCtrl'
        };
    })
 /*   .directive('teammembers', function ($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                data:'='
            },
            link: function (scope, element, attrs) {

            },
            templateUrl: 'directives/teammembers.html',

        };

    })*/

    .directive('artifact', function ($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                artifctdata:'='
            },
            link: function (scope, element, attrs) {

            },
            templateUrl: 'directives/artifact.html',
            controller:'startupdetailsCtrl'

        };

    })
    .directive('startupPitchList', function ($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                startupdata:'=',
                href:'='
            },
            templateUrl: 'directives/startupPitchList.html',

        };

    })
    .directive('teammembers', function ($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                data:'='
            },
            templateUrl: 'directives/teammembers.html',
            controller:'startupdetailsCtrl'

        };

    })
    .directive('owlCarousel', function () {
        return {
            restrict: 'A',
            link: function (scope,element) {

                if(scope.$last) {
                    console.log("DESTROY")

                    if(element.parent('').attr('class')=="owl-carousel owl-theme"){
                        console.log("Destroy............")
                        element.parent('').data('owlCarousel').destroy();
                     //   element.parent('#owl-team').owlCarousel(defaultOptions);
                    }
                    var defaultOptions = {
                    };
                    var customOptions =scope.$eval(element.parent('').attr('data-options'));
                    // combine the two options objects
                    console.log("OWL OPTIONS FIRST ")
                    console.log(customOptions);
                    for(var key in customOptions) {
                        defaultOptions[key] = customOptions[key];
                    }
                    console.log("OWL OPTIONS")
                    console.log(defaultOptions);
                    console.log(element.parent('#owl-team').attr('class'));

                    if(element.parent('#owl-team').attr('class')=="owl-carousel owl-theme"){
                        console.log("IF IF IF IF")
                        //element.parent('#owl-team').data('owlCarousel').destroy();
                        element.parent('').owlCarousel(defaultOptions);
                    }else{
                        console.log("ELSE")
                        element.parent('').owlCarousel(defaultOptions);
                    }


                }
            }
        }
    })
	.directive('timeline', function ($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                timelinedata:'='
            },
            link: function (scope, element, attrs) {
                 console.log(attrs)   
            },
            templateUrl: 'directives/timeline.html',
           /* controller:'timeController'*/
        };

    })
    /*.directive('video', function () {
        return {
            restrict: 'AEC',
            scope: {
                Data:'='
            },
            templateUrl: 'directives/video.html',
            controller:'startupdetailsCtrl'
        };

    })*/
    .directive('myYoutube', function($sce) {
        return {
            restrict: 'EA',
            scope: { code:'=' },
            replace: true,
            template: '<div style="height:200px;"><iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
            link: function (scope) {
                console.log('here');
                scope.$watch('code', function (newVal) {
                    if (newVal) {
                        scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
                    }
                });
            }
        };
    })
 .directive('footer', function ($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                    
            },
            link: function (scope, element, attrs) {
                    
            },
            templateUrl: 'directives/footer.html'
        };

    })
    .directive('onError', function() {
        return {
            restrict:'A',
            link: function(scope, element, attr) {
                element.on('error', function() {
                    element.attr('src', attr.onError);
                })
            }
        }
    })
    .directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            console.log(msg);
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
        }])

