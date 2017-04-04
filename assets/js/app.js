angular.module('lensnmirrorApp', ['ui.router',
    'toastr',
    'lensnmirrorApp.controllers',
    'lensnmirrorApp.services',
     'lensnmirrorApp.directives',
    'ngStorage',
    'angular-input-stars','naif.base64',
    'ui.materialize',
    'xeditable','uiSwitch' ])

//.constant('BASE_URL_HREF', 'http://lensnmirror.com/demo/mvp1/#/')
.constant('BASE_URL_HREF', 'http://localhost/lens-n-mirror-mvp1/#/')
.constant('BASE_API_URL', 'http://139.59.8.194:8080/')

.run(function(editableOptions, editableThemes) {
    editableOptions.theme = 'default'; // bootstrap3 theme. Can be also 'bs2', 'default'
    editableThemes['default'].submitTpl = '<button type="submit" class="editable_submit"><i class="fa fa-check" aria-hidden="true"></i></button>';
    editableThemes['default'].cancelTpl = '<button type="button" class="editable_cancel" ng-click="$form.$cancel()" title="Cancel" aria-label="Cancel"><i class="fa fa-times" aria-hidden="true"></i></button>';
})
.config(function ($stateProvider, $urlRouterProvider,$locationProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html',
                controller:'homeCtrl'
            })
            .state('loginsignup', {
                url: '/loginsignup',
                templateUrl: 'views/loginsignup.html',
                controller:'loginsignupCtrl'
            })
            .state('forgot', {
                url: '/forgot',
                templateUrl: 'views/forgot.html',
                controller:'forgotpasswordCtrl'

            })
            .state('profileform', {
                url: '/profileform',
                templateUrl: 'views/profileform.html',
                controller:'profileformCrtl'

            })
            .state('changepassword', {
                url: '/changepassword',
                templateUrl: 'views/changepassword.html',
                controller:'changepasswordCtrl'
            })
            /*.state('changepassword', {
                url: '/changepassword',
                templateUrl: 'views/changepassword.html',
                controller:'changepasswordCtrl'
            })*/
            .state('verifyemail', {
                url: '/emailVerify/:userId/:userToken',
                templateUrl: 'views/email_verify.html',
                controller:'verifyEmailCtrl'

            })
            .state('resetpassword', {
                url: '/resetPassword/:userId/:fpToken',
                templateUrl: 'views/resetpassword.html',
                controller:'resetPasswordCtrl'

            })
            .state('startuppitchform', {
                url: '/startuppitchform',
                templateUrl: 'views/startuppitchform.html',
                controller:'startuppitchCtrl'
            })
            .state('adviceboard', {
                url: '/:pitchurl/advicepitch',
                templateUrl: 'views/adviceboard.html',
                controller:'adviceboardCtrl'

            })
            .state('querydetials', {
                url: '/:pitchurl/advicepitch/:queryid',
                templateUrl: 'views/querydetails.html',
                controller:'querydetailCtrl'

            })
            .state('startupdetails', {
                url: '/:pitchurl/pitch',
                templateUrl: 'views/startupdetails.html',
                controller:'startupdetailsCtrl'
            })
            .state('transactionboard', {
                url: '/:pitchurl/transactionpitch',
                templateUrl: 'views/transactionboard.html',
                 controller:'startupdetailsCtrl'
                
            })
            .state('ratingboard', {
                url: '/:pitchurl/ratingpitch',
                templateUrl: 'views/ratingboard.html',
                 controller:'startupdetailsCtrl'
            })
            .state('mentors', {
                url: '/mentors',
                templateUrl: 'views/mentors.html',
                controller:'mentorsCtrl'
                
            })
            .state('mentorsdetails', {
                url: '/mentorsdetails/:mentorUrl',
                templateUrl: 'views/mentorsdetails.html',
                controller:'mentordetailCtrl'
                
            })
            .state('leaderboard', {
                url: '/leaderboard',
                templateUrl: 'views/leaderboard.html'
                
            })
            .state('mypitches', {
                url: '/mypitches',
                templateUrl: 'views/mypitches.html',
                controller:'startuplistCtrl'

            })
             .state('help', {
                url: '/help',
                templateUrl: 'views/help.html'
                
            })
              .state('contact', {
                url: '/contact',
                templateUrl: 'views/contact.html'
                
            })
              .state('about', {
                url: '/about',
                templateUrl: 'views/about.html'
                
            })
            .state('sample', {
                url: '/sample',
                templateUrl: 'views/sample.html'

            })

            .state('startsups', {
                url: '/startsups/:category',
                templateUrl: 'views/startsups.html',
                controller:'startuplistCtrl'
                
            });
 $urlRouterProvider.otherwise('/');
    });

