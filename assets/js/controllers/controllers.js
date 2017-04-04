angular.module('lensnmirrorApp.controllers', [
    'lensnmirrorApp.services',
    'lensnmirrorApp.directives'
])
/*.controller('timeController', function($scope, $stateParams, $state,urls,$http) {
    console.log('hai...........');
    console.clear()
    $scope.statename=$state.current.name;
   console.log($state.current.name);

})*/

.controller('commonCtrl', function ($scope, $stateParams, urls, $http, $state, $rootScope) {

    $scope.href = urls.apiHref;
    /* 	LOADING Function */
    //$rootScope.myApp.showPleaseWait();
    //$rootScope.myApp.hidePleaseWait();
//TODO make this Global function
    $rootScope.myApp = $rootScope.myApp || (function () {
            var pleaseWaitDiv = $('#pleaseWaitDiv');
            var loadingSub = $('#loadingSub');
            return {
                showPleaseWait: function () {
                    pleaseWaitDiv.show();
                },
                hidePleaseWait: function () {
                    pleaseWaitDiv.hide();
                },
                showloadingSub: function () {
                    loadingSub.show();
                },
                hideloadingSub: function () {
                    loadingSub.hide();
                }

            };
        })();

    //$rootScope.myApp.hidePleaseWait();
    /* 	LOADING Function */
})

/*----------------------headernav controller--------------------------*/
    .controller('headernavController', function($scope,$localStorage, $stateParams, $state,toastr,urls,userAuth,$http,userDetail,globalFunc) {
        $scope.href = urls.href;
        console.log("---------------============");
        if($localStorage.userDetail!=undefined)
        {
            $scope.role=$localStorage.userDetail.role;
            $scope.userrole= $scope.role;
            console.log($scope.role);
        }
        var usrDetail=userDetail.getData('name');
        //$scope.role= usrDetail.role
        globalFunc.mainLoader('no');
        $scope.emailVerify=userDetail.getData('emailVerify');
       if(usrDetail!=false){
           $scope.username=usrDetail;

       }
        $scope.loginStatus=userAuth.checkLogin();
            $scope.logout = function () {
            userDetail.unsetData();
            toastr.success('logout sucessfully ');
            $state.go('home');
        }

        $scope.resendVerification=function(){
            $scope.emailVerify='yes';
            globalFunc.subLoader('yes')
            var usrDetail=userDetail.getData();
            console.log(usrDetail)
            var requestMessage={
                "requestMessage": "resendverifylink",
                "requestId": "108",
                "apiKey": "",
                "requestData": [
                    {
                        "email": usrDetail.email,
                        "session_id": usrDetail.sessionId,
                        "role": usrDetail.role
                    }
                ]
            }

            $http.post(urls.apiUrl+'users/resendVerifyLink', requestMessage)
                .success(function (data, status, headers, config) {
                console.log("Resend result ");
                console.log(data);
                globalFunc.subLoader('no')
                if (data.result == 'yes') {
                    userDetail.setData('emailVerify','yes');
                    $scope.sucessMessage = data.resultData[0].message;
                    toastr.success($scope.sucessMessage)
                } else {
                    $scope.failureMessage = data.resultData[0].message;
                    toastr.error($scope.failureMessage)

                }

            })
                .error(function (data, status, headers, config) {
                    globalFunc.subLoader('no')
                    console.log("error");
                    toastr.error("Error in resending email.")
                });


        } // END of resendVerification

    })
 /*----------------------changepassword controller-------------*/
    .controller('changepasswordCtrl', function($scope, $rootScope,$stateParams,$http, $state,toastr,urls,userAuth,$localStorage) {
        $scope.href = urls.href;
        console.log("changepasswordCtrl");
        $scope.changepassword = function (user) {
            console.log(user)
            $scope.seesionid=$localStorage.userDetail.sessionId;
            $scope.email=$localStorage.userDetail.email;
            $scope.userid=$localStorage.userDetail.userId;
            $scope.role=$localStorage.userDetail.role;
            $scope.oldpassword = user.oldpassword;
            $scope.newpassword = user.newpassword;
            var changePasswordReq={
                "requestMessage": "userchangepassword",
                "requestId": "110",
                "apiKey": "",
                "requestData": [
                    {
                        "email":  $scope.email,
                        "session_id": $scope.seesionid,
                        "role":  $scope.role,
                        "old_password":$scope.oldpassword,
                        "new_password": $scope.newpassword
                    }
                ]
            }
            console.log(changePasswordReq);
            $rootScope.myApp.showPleaseWait();
            $http.post(urls.apiUrl+'users/changePassword', changePasswordReq).success(function (data, status, headers, config) {
                console.log("login result");
                console.log(data);
                if (data.result == 'yes') {
                    $rootScope.myApp.hidePleaseWait();
                    $localStorage.userDetail = "";
                    $scope.sucessMessage = data.resultData[0].message;
                    toastr.success($scope.sucessMessage)
                    $state.go('loginsignup')
                } else {
                    $rootScope.myApp.hidePleaseWait();
                    $scope.failureMessage = data.resultData[0].message;
                    toastr.error($scope.failureMessage)

                }
            })
                .error(function (data, status, headers, config) {
                    $rootScope.myApp.hidePleaseWait();
                console.log("error");

            });

        }


    })

    /*----------------------forgotpassword controller-------------*/
    .controller('forgotpasswordCtrl', function($scope, $rootScope, $stateParams,$http, $state,toastr,urls,userAuth,$localStorage) {
        $scope.href = urls.href;
        console.log("forgotpasswordCtrl");
        $scope.ForgotPassword = function (password) {

            var request={
                "requestMessage": "userforgotpassword",
                "requestId": "111",
                "apiKey": "",
                "requestData": [
                    {
                        "email": password.email,
                        "role": password.role
                    }
                ]
            }
            $rootScope.myApp.showPleaseWait();
            $http.post(urls.apiUrl+'users/forgotPassword', request).success(function (data, status, headers, config) {

                console.log(data);
                if (data.result == "yes") {
                    $rootScope.myApp.hidePleaseWait()
                    var message= data.resultData[0].message;
                    $state.go('loginsignup')
                    toastr.success(message)
                } else {
                    $rootScope.myApp.hidePleaseWait()
                    $scope.failureMessage = data.resultData[0].message;

                }
            }).
            error(function (data, status, headers, config) {
                $rootScope.myApp.hidePleaseWait()
                console.log("error");

            });

            console.log(password);
        }
    })

    /*----------------------resetPasswordCtrl controller-------------*/
    .controller('resetPasswordCtrl', function($scope, $rootScope, $stateParams,$http, $state,toastr,urls,userAuth,$localStorage) {
        $scope.href = urls.href;
        console.log("resetPasswordCtrl");
        $scope.resetPassword = function (password) {
console.log(password,"==========")
            var userId=$stateParams.userId;
            var fpToken=$stateParams.fpToken;
            var request={
                "requestMessage": "userresetpassword",
                "requestId": "113",
                "apiKey": "",
                "requestData": [
                    {
                        "user_id": userId,
                        "fp_token": fpToken,
                        "new_password":password.confirmPassword
                    }
                ]
            }
            $rootScope.myApp.showPleaseWait();
            $http.post(urls.apiUrl+'users/resetPassword', request).success(function (data) {

                console.log(data);
                if (data.result == "yes") {
                    $rootScope.myApp.hidePleaseWait()
                    var message= data.resultData[0].message;
                    $state.go('loginsignup')
                    toastr.success(message)
                } else {
                    $rootScope.myApp.hidePleaseWait()
                    $scope.failureMessage = data.resultData[0].message;

                }
            }).
            error(function (data, status, headers, config) {
                $rootScope.myApp.hidePleaseWait()
                console.log("error");
            });
            console.log(password);
        }
    })

    /*----------------------Verify Email controller-------------*/
    .controller('verifyEmailCtrl', function($scope,$rootScope, $stateParams,$http, $state,toastr,urls,userAuth,$localStorage) {
        $scope.href = urls.href;
        var userId=$stateParams.userId;
        var userToken=$stateParams.userToken;
        console.log(userToken+"------"+userId);
            var emailVerify={
                "requestMessage": "userverifyemail",
                "requestId": "112",
                "apiKey": "",
                "requestData": [
                    {
                        "user_id": userId,
                        "token": userToken
                    }
                ]
            }
        $rootScope.myApp.showPleaseWait();
        $http.post(urls.apiUrl+'users/emailVerify', emailVerify).success(function (data, status, headers, config) {
            console.log("login result");
            console.log(data);
            if (data.result == 'yes') {
                $rootScope.myApp.hidePleaseWait()
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage)
            } else {
                $rootScope.myApp.hidePleaseWait()
                $state.go("loginsignup")
                toastr.error(data.resultData[0].message)
            }
        }) .
            error(function (data, status, headers, config) {
                $rootScope.myApp.hidePleaseWait()
                console.log("error");
            });
    })
    /*----------------------startuppitch controller-------------*/
    .controller('startuppitchCtrl', function($scope,$rootScope, $stateParams,$http, $state,toastr,urls,userAuth,$localStorage) {
        $scope.href = urls.href;
        console.log("startuppitchCtrl");
        console.log("categorylist++++++++++++++++++");
        $scope.seesionid=$localStorage.userDetail.sessionId;
        $scope.email=$localStorage.userDetail.email;
        $scope.userid=$localStorage.userDetail.userId;
        $scope.role=$localStorage.userDetail.role;
        var categorylistReq={
            "requestMessage": "getstartupcategories",
            "requestId": "120",
            "apiKey": "",
            "requestData": [
                {
                    "email":$scope.email,
                    "session_id": $scope.seesionid,
                    "role": $scope.role,
                }
            ]
        }
        console.log(categorylistReq);
        $rootScope.myApp.showPleaseWait();
        $http.get(urls.apiUrl+'startups/getCategories').success(function (data, status, headers, config) {
            console.log("categorylist result");
            console.log(data);
               if (data.response == "success") {
                   $rootScope.myApp.hidePleaseWait()
             $scope.categories = data.resultData[0].categories;
                   console.log( $scope.categories)
                   console.log(JSON.stringify($scope.categories))
             } else {
                   $rootScope.myApp.hidePleaseWait()
             $scope.failureMessage = data.resultData[0].message;

             }
        }).
        error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");
        });
        $scope.startuppitch = function (startup) {
            console.log(startup)
            var i =startup.pitchcategory;
            var values=i.split(',');
            console.log(values, "values---", values[0] ,values[1])
            $scope.seesionid=$localStorage.userDetail.sessionId;
             $scope.email=$localStorage.userDetail.email;
            $scope.userid=$localStorage.userDetail.userId;
            $scope.role=$localStorage.userDetail.role;
            var startuppitchReq ={
                "requestMessage": "createstartuppitch",
                "requestId": "121",
                "apiKey": "",
                "requestCategory": "crud_startup",
                "requestData": [
                    {
                        "user_id":$scope.userid,
                        "email": $scope.email,
                        "session_id": $scope.seesionid,
                        "role": $scope.role,
                        "startup_name": startup.pitchname,
                        "tag_line": startup.pitchtagline,
                        "category_name": values[0],
                        "category_seo_url": values[1],
                        "brief_description": startup.pitchdescription
                    }
                ]
            }
            console.log(JSON.stringify(startuppitchReq));
            console.log(urls.apiUrl+'startups/createStartUp')
            $rootScope.myApp.showPleaseWait();
            $http.post(urls.apiUrl+'startups/createStartUp', startuppitchReq).success(function (data, status, headers, config) {
                console.log("login result");
                console.log(data);
                if (data.result == "yes") {
                    $rootScope.myApp.hidePleaseWait()
                    $scope.seo_url = data.resultData[0].startup_seo_url;
                    /*toastr.success($scope.sucessMessage)*/
                    console.log("gghhgjhghj",$scope.seo_url)
                    $state.go('startupdetails',{pitchurl:$scope.seo_url})
                } else {
                    $rootScope.myApp.hidePleaseWait()
                    $scope.failureMessage = data.resultData[0].message;
                    toastr.error($scope.failureMessage)
                   // $state.go('startuppitchform')
                }
            }).
            error(function (data, status, headers, config) {
                $rootScope.myApp.hidePleaseWait()
                console.log("error");

            });




        }

    })
    /*----------------------profileedit controller-------------*/
    .controller('profileformCrtl', function($scope,$rootScope,  $stateParams,$http,$window, $state,toastr,urls,userAuth,userDetail,globalFunc,$localStorage) {
        $scope.href = urls.href;
        if (userAuth.checkLogin() == false) {
            $state.go('loginsignup')
        }
        console.log("profileformCrtl");
            console.log("getdetails");
            $scope.seesionid=$localStorage.userDetail.sessionId;
            $scope.email=$localStorage.userDetail.email;
            $scope.userid=$localStorage.userDetail.userId;
            $scope.role=$localStorage.userDetail.role;
            var getprofileReq={
                "requestMessage": "getprofileupdate",
                "requestId": "109",
                "apiKey": "",
                "requestData": [
                    {
                        "user_id": $scope.userid,
                        "name":  $scope.username,
                        "email":   $scope.email,
                        "role": $scope.role,
                        "session_id":$scope.seesionid
                    }
                ]
            }

            console.log(JSON.stringify(getprofileReq))
            console.log(urls.apiUrl+'users/getUserProfile')
            $rootScope.myApp.showPleaseWait();
            $http.post(urls.apiUrl+'users/getUserProfile', getprofileReq).success(function (data) {
                console.log("userprofileupdate");
                console.log(data);
                if(data.result=="yes"){
                    $rootScope.myApp.hidePleaseWait()
                    $scope.user=data.resultData[0];
                    console.log($scope.user)
                }else {
                   // $rootScope.myApp.hidePleaseWait()
                    $scope.failureMessage = data.resultData[0].message;
                    toastr.error($scope.failureMessage);
                }
            }).
                error(function (data, status, headers, config) {
                    $rootScope.myApp.hidePleaseWait()
                    console.log("error");

                });
        $scope.profileemailform = function (user) {
            $scope.openModal=false;
            console.log(user);
            $scope.userid=$localStorage.userDetail.userId;
            $scope.seesionid=$localStorage.userDetail.sessionId;
            $scope.email=$localStorage.userDetail.email;
            $scope.role=$localStorage.userDetail.role;
            $scope.newemail=user.email;
            console.log($scope.newemail)
           var profileemailReq={
               "requestMessage": "userupdateemail",
               "requestId": "115",
               "apiKey": "",
               "requestData": [
                   {
                       "email": $scope.email,
                       "new_email": $scope.newemail,
                       "session_id":$scope.seesionid,
                       "role": $scope.role

                   }
               ]
           }
            console.log(JSON.stringify(profileemailReq))
            console.log(urls.apiUrl+'users/updateEmail')
            $http.post(urls.apiUrl+'users/updateEmail', profileemailReq).success(function (data, status, headers, config) {
                console.log("profileemailReq");
                console.log(data);
                if (data.result == "yes")
                {
                    $rootScope.myApp.hidePleaseWait()
                    $scope.sucessMessage = data.resultData[0].message;
                    $localStorage.userDetail="";

                    $state.go("loginsignup")
                    toastr.success($scope.sucessMessage)
                } else {
                    $scope.failureMessage = data.resultData[0].message;
                    toastr.error($scope.failureMessage)
                }
                $rootScope.myApp.hidePleaseWait()
            }).
            error(function (data, status, headers, config) {
                $rootScope.myApp.hidePleaseWait()
                console.log("error");

            });

        }
        $scope.imageUrl=urls.imageUrl;
        $scope.profileform = function (user) {
            /*alert("**********************")*/
            $scope.imageUrl=urls.imageUrl;
            if(user.upload!=undefined)
                $scope.profilepic="data:image/png;base64,"+user.upload[0].base64;
            else
                $scope.profilepic="";
            console.log($scope.imageUploadType);
            $scope.checkimg={
                "fileName": "",
                "fileExtension": "",
                "fileBaseCode": "",
                "kavya":""
            };
            $scope.$watch('user.upload',function (newvalue) {
                if(newvalue){
                    console.log(newvalue);
                    var content=newvalue[0].base64;
                    $scope.checkimg.fileName=newvalue[0].filename;
                    var ext=$scope.checkimg.fileName.split(".");
                    $scope.checkimg.fileExtension=ext[ext.length-1];
                    $scope.checkimg.fileBaseCode=content;
                    console.log($scope.checkimg);
                }
            });
            var usrDetail=userDetail.getData();
            console.log(usrDetail);
            console.log(user);
            $scope.username = user.name;
            $scope.role = user.role;
            $scope.designation = user.designation;
            $scope.about = user.about_user;
            $scope.profilphoto = $scope.profilepic;
            $scope.mobile = user.mobile;
           $scope.updatedrole = user.role;
            console.log($scope.profilphoto);
            var profileformReq ={
                "requestMessage": "userprofileupdate",
                "requestId": "105",
                "apiKey": "",
                "requestData": [
                    {

                        "user_id": usrDetail.userId,
                        "name":$scope.username,
                        "email": usrDetail.email,
                        "session_id": usrDetail.sessionId,
                        "role": usrDetail.role,
                        "updated_role":$scope.updatedrole,
                        "mobile":  $scope.mobile,
                        "profile_pic":  $scope.profilphoto,
                        "designation":   $scope.designation,
                        "about_user":  $scope.about
                    }
                ]


            }
            console.log(JSON.stringify(profileformReq))
            console.log(urls.apiUrl+'users/updateProfile')
            $rootScope.myApp.showPleaseWait();
            $http.post(urls.apiUrl+'users/updateProfile', profileformReq).success(function (data, status, headers, config) {
                console.log("userprofileupdate");
                console.log(data);
                if (data.result == "yes")
                {
                    $rootScope.myApp.hidePleaseWait()
                    $scope.sucessMessage = data.resultData[0].message;
                    if($scope.updatedrole!=$scope.role){
                        $localStorage.userDetail = "";
                        $state.go('loginsignup')
                          $window.location.reload();
                    }else{

                        toastr.success($scope.sucessMessage)
                        $window.location.reload();
                        $state.go('profileform')
                    }

                } else {
                    $rootScope.myApp.hidePleaseWait()
                    $scope.failureMessage = data.resultData[0].message;
                    toastr.error($scope.failureMessage)
                }
            }).
            error(function (data, status, headers, config) {
                $rootScope.myApp.hidePleaseWait()
                console.log("error");

            });
        }

    })
/*----------------------signup controller--------------------*/
    .controller('loginsignupCtrl',
        function ($scope,$stateParams, $rootScope,$http, urls,$state,toastr,$localStorage,userAuth) {
            $scope.href = urls.href;
            console.log("--------------");
            console.log($scope.href);
            console.log($scope.loginStatus);
            if (userAuth.checkLogin() == true) {
                $state.go('startsups')
            }
            console.log("IM in loginsignupCtrl");
            /*alert("IM in loginsignupCtrl");*/
            console.log("bbbbbbbbbbbbbbbbbbbbb");
            $scope.registerUser = function (user) {
                console.log("user fnt");
                console.log(user);
                console.log(user.username);
                console.log(user.mobile);
                console.log(user.password);
                console.log(user.confim_password);
                console.log(user.email);
                $scope.username = user.username;
                $scope.email = user.email;
                $scope.password = user.password;
                $scope.mobile = user.mobile;
                $scope.role = user.role;
                $scope.confim_password = user.confim_password;
                var UsersignupReq = {
                    "requestMessage": "usersignup",
                    "requestId": "102",
                    "apiKey": "",
                    "requestData": [
                        {
                            /*"name": "Vijay Kumar",
                            "email": "test@creatise.in",
                            "password": "vijay123456",
                            "role": "mentor",
                            "mobile": "9632124578"*/
                             "name":$scope.username,
                             "email": $scope.email,
                             "password":$scope.password,
                             "role":$scope.role,
                             "mobile":$scope.mobile


                        }
                    ]
                }
                console.log(JSON.stringify(UsersignupReq))
                $rootScope.myApp.showPleaseWait();
                $http.post(urls.apiUrl+'users/signUp', UsersignupReq).success(function (data, status, headers, config) {
                    console.log("login result");
                    console.log(data);
                    $rootScope.myApp.hidePleaseWait()
                    if (data.resultCode == 'Unsuccess') {
                        $scope.message = data.resultData[0].message;
                        toastr.success("User Signup unsuccessful.. Please try again..");
                     /*   alert($scope.message);*/


                    } else {

                        var details = data.resultData[0];
                        toastr.success("User Signup successful..");
                        console.log(details);
                        $localStorage.userDetail = {
                            userId: details.user_id,
                            sessionId: details.session_id,
                           email: details.email,
                            role: details.role,
                            emailVerify:details.email_verified,
                            name:details.name
                        };
                        console.log($localStorage.userDetail);
                       $state.go('startsups');
                    }
                }).error(function (data, status, headers, config) {
                    $rootScope.myApp.hidePleaseWait()
                    console.log("error =====");
                });
            }
            $scope.login = function (user) {
                /*alert("login function");*/
                console.log(user)
                $scope.email = user.name;
                $scope.password = user.password;
                $scope.mobile = user.mobile;
              /*  $scope.role = user.role;*/
                var UserloginReq = {
                    "requestMessage": "userlogin",
                    "requestId": "103",
                    "apiKey": "",
                    "requestData": [
                        {
                            /*"email": "test@mail.com",
                            "password": "jndkvbskdb4562",
                            "role": "startup"*/
                            "email": $scope.email,
                            "password":$scope.password,
                           /* "role":$scope.role*/
                        }
                    ]
                }
                console.log(JSON.stringify(UserloginReq));
                $rootScope.myApp.showPleaseWait();
                $http.post(urls.apiUrl+'users/login', UserloginReq).success(function (data, status, headers, config) {
                    console.log("login data");
                    console.log(data);
                    var details = data.resultData[0];
                    if (data.result == 'no') {
                        $scope.message = data.resultData[0].message;
                        toastr.error("User login unsuccessful.. Please try again..");
                        /*alert($scope.message);*/
                        $state.reload()
                        console.log("hkjhkjhkjh")
                        toastr.success("User login unsuccessful.. Please try again..");
                    } else {
                        $localStorage.userDetail = {
                            userId: details.user_id,
                            sessionId: details.session_id,
                            email: details.email,
                            role: details.role,
                            emailVerify:details.email_verified,
                            name:details.name
                        };
                        $state.go('startsups');
                        toastr.success("User login successful..");
                    }
                    $rootScope.myApp.hidePleaseWait()
                }).error(function (data, status, headers, config) {
                    //$rootScope.myApp.hidePleaseWait()
                    console.log("error");

                });

            }


    })


.controller('stateController', function($scope, $stateParams, $state,urls) {
	  console.log('oyeeeee...........');
	   $scope.apiHref = urls.apiHref;
	  $scope.currState = $state;
       $scope.$watch('currState.current.name', function (newValue, oldValue) {
       console.log(newValue);
           $scope.currentstate = newValue;
       });
       	$scope.tabparms=$stateParams.startupId;
         console.log($stateParams.startupId);

})
.controller('startuplistCtrl', function ($scope, $stateParams, $state, $http, urls,userDetail,globalFunc) {
    $scope.href = urls.href;
    $scope.urls=urls;

    globalFunc.subLoader('yes');
    console.log("startups");
    var userData=userDetail.getData();
    var email="";
    var userId="";
    var sessionId="";
    var role="";
var category=$stateParams.category;
    if(category=="" || category==undefined)
        category="";
    console.log();

    /* GET CATEGORIES */
    $http.get(urls.apiUrl+'startups/getCategories').success(function (data, status, headers, config) {
        console.log("categorylist result");
        console.log(data);
        if (data.response == "success") {
            $scope.categories = data.resultData[0].categories;
            console.log(JSON.stringify($scope.categories))
        } else {

            $scope.failureMessage = data.resultData[0].message;

        }
    }).
    error(function (data, status, headers, config) {
        $rootScope.myApp.hidePleaseWait()
        console.log("error");
    });

if(userData!=false){
    userId=userData.userId;
    sessionId=userData.sessionId;
    email=userData.email;
    role=userData.role;
}
       var startupReq={
           "requestMessage": "getstartuppitch",
           "requestId": "121",
           "requestCategory": "read_startup",
           "apiKey": "",
           "requestData": [
               {
                   "user_id": userId,
                   "email": email,
                   "session_id": sessionId,
                   "role": role,
                   "category_seo_url": category,
                   "page_number": 1,
                   "limit_number": 10
               }
           ]
       }
	  console.log(JSON.stringify(startupReq));
  $http.post(urls.apiUrl+'startups/getStartUps', startupReq).
            success(function (data, status, headers, config) {
      globalFunc.subLoader('no');
                console.log("start Up List");
                console.log(JSON.stringify(data));
           if(data.result=='yes'){
              $scope.startups=data.resultData[0].startup_list;
              console.log($scope.startups);

           } else{
               $scope.failureMessage=data.resultData[0].message;
               
           }   
            }).
            error(function (data, status, headers, config) {
                console.log("error");
      globalFunc.subLoader('no');
            });
    /*--------------GET USERS STARTUPLIST API-----------------------*/
    var userData=userDetail.getData();
    var userstartuplistReq={
        "requestMessage": "getuserstartupslist",
        "requestId": "190",
        "apiKey": "",
        "requestCategory": "crud_startup",
        "requestData": [
            {
                "user_id": userId,
                "email": email,
                "session_id": sessionId,
                "role": role,
                "startup_status": "active",
                "publish_status": "yes",
                "page_number": 1,
                "limit_number": 10
            }
        ]
    }
    console.log(JSON.stringify(userstartuplistReq));
    console.log(urls.apiUrl+'startups/getUserStartUps');
    $http.post(urls.apiUrl+'startups/getUserStartUps', userstartuplistReq).
    success(function (data, status, headers, config) {
        globalFunc.subLoader('no');
        console.log("start Up List");
        console.log(JSON.stringify(data));
        if(data.result=='yes'){
            $scope.mystartups=data.resultData[0].startup_list;
            console.log($scope.startups);

        } else{
            $scope.failureMessage=data.resultData[0].message;

        }
    }).
    error(function (data, status, headers, config) {
        console.log("error");
        globalFunc.subLoader('no');
    });

    $scope.startupsearch = function(user) {
       /* alert("searchstartups")*/
         $scope.startupsearch=user.title
     var searchstartupReq= {
              "requestMessage": "searchstartups",
              "requestId": "180",
              "requestCategory": "read_startup",
              "apiKey": "",
              "requestData": [
                {
                  "user_id": userId,
                "email": email,
                "session_id": sessionId,
                "role": role,
                  "startup_search_text": $scope.startupsearch,
                  "page_number": 1,
                  "limit_number": 10
                }
              ]
            } 
         console.log(JSON.stringify(searchstartupReq));
         console.log(urls.apiUrl+'startups/searchStartUps');
           $http.post(urls.apiUrl+'startups/searchStartUps',searchstartupReq).success(function (data, status, headers, config) {
            console.log(data);
            if(data.result=='yes')
            {
                $scope.startups=data.resultData[0].startup_list;
                console.log($scope.startups);
             } 
             else
             {
                $scope.failureMessage=data.resultData[0].message;
            }
        }).
        error(function (data, status, headers, config) {
            console.log("error");
        });

     }


    })
	
.controller('startupdetailsCtrl', function ($scope, $rootScope, $window,$stateParams, $state, $http,toastr, urls,$localStorage,globalFunc,userAuth,userDetail) {
    console.log("startupdetailsCtrl");
    $scope.href = urls.href;
    console.log("category line++++++++++++++++++")
    console.log("****************************************");
    $scope.pitchurl=$stateParams.pitchurl
    var usrDetail=userDetail.getData();
    console.log(usrDetail);
    $scope.permission='no';
    var requestData=
    {
        "requestMessage": "getstartuppitch",
        "requestId": "121",
        "apiKey": "",
        "requestCategory": "read_startup",
        "requestData": [

            {
                "user_id": usrDetail.userId,
                "email": usrDetail.email,
                "session_id": usrDetail.sessionId,
                "role": usrDetail.role,
                "startup_seo_url":$stateParams.pitchurl
            }
        ]
    }

console.log(JSON.stringify(requestData))
    console.log(urls.apiUrl+'startups/getStartUpPitch')
    $rootScope.myApp.showPleaseWait();
    $scope.imageUrl=urls.imageUrl;
  	  $http.post(urls.apiUrl+'startups/getStartUpPitch',requestData).success(function (data, status, headers, config) {
          console.log("list");
          console.log(JSON.stringify(data));
          if (data.result == "yes") {
              $rootScope.myApp.hidePleaseWait()
              $scope.startupdetail=data.resultData[0].startup_details;
              $scope.startupdetailpitch=$scope.startupdetail.pitch_videos;
              console.log($scope.startupdetail,"6666666")
              if($scope.startupdetail.startup_publish=='yes'){
                  $scope.switch = {'enable':true};
              }else{
                  $scope.switch = {'enable':false};
              }
             $scope.startupdetailteam=$scope.startupdetail.startup_team;
              $scope.startupdetailartifcat=$scope.startupdetail.startup_artifacts;
              $scope.profileImage=$scope.startupdetail.startup_logo;
              if(usrDetail.role=='incubator'){
                  $scope.permission='yes';
              }else{
                  $scope.permission=data.resultData[0].editable;
              }

              console.log($scope.permission);
              console.log( $scope.startupdetailteam)
          } else {
              $rootScope.myApp.hidePleaseWait()
              $scope.failureMessage = data.resultData[0].message;
              toastr.error($scope.failureMessage)
             $state.go('startuppitchform')
          }
    }).
    error(function (data, status, headers, config) {
          $rootScope.myApp.hidePleaseWait()
        console.log("error");

    });
    // if($scope.startupdetail.startup_publish=='yes'){
    //     $scope.switch = {'enable':true};
    // }else{
    //     $scope.switch = {'enable':false};
    // }
    /*--------------published---------------------*/
    $scope.switch = {'enable':true};

    $scope.changeCallback = function() {
        var usrDetail=userDetail.getData();
        console.log(usrDetail)
       /* console.log(pbswitch)*/
        /*$scope.startuppublish=pbswitch*/
        console.log( $scope.switch.enable)
        $scope.varswt=$scope.switch.enable
        console.log($scope.varswt)
        var x='no';
        if($scope.switch.enable==true)
            x='yes';
        else
            x='no';
        startuppublishReq={
            "requestMessage": "updatestartuppitch",
            "requestId": "134",
            "apiKey": "",
            "requestCategory": "crud_startup",
            "requestData": [
                {
                    "user_id": usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_seo_url":$stateParams.pitchurl,
                    "field_key": "startup_publish",
                    "field_value": x
                }
            ]
        }
       /* console.log('This is the state of my model ' + $scope.switch.enable);*/
        globalFunc.subLoader("yes")
        console.log(JSON.stringify(startuppublishReq))
        console.log(urls.apiUrl+'startups/updateStartUpPitch')
        $http.post(urls.apiUrl+'startups/updateStartUpPitch',startuppublishReq).success(function (data, status, headers, config) {
            console.log(data);

            if (data.result == "yes") {
                $scope.uploadimages=data.resultData[0];
                console.log($scope.data);
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage);
               /* $window.location.reload();*/
            } else
            {

                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage);

            }
        }).
        error(function (data, status, headers, config) {
            console.log("error");
        });
    };



        /************** LOAD CATEGORIES *********************/
        $scope.loadCategories=function () {
    $http.get(urls.apiUrl+'startups/getCategories').success(function (data, status, headers, config) {
        console.log("categorylist result");
        console.log(data);
        if (data.response == "success") {
            $scope.categoriesList = data.resultData[0].categories;
        } else {
            $scope.failureMessage = data.resultData[0].message;
        }
    }).
    error(function (data, status, headers, config) {
        console.log("error");
    });



}
    /*---------------------- Upload API--------------------*/
    /* OPEN IMAGE UPLOAD MODAL */
    $scope.imageUploadType="";
    $scope.permission='no';
    $scope.openImageUpload=function (type) {
        $scope.modalimgUpload=true;
        $scope.imageUploadType=type;
    }
    $scope.user={'uploadimg':""}
    $scope.uploadimg=function (user) {
        console.log(user);
       /* alert("fileupload");*/
        var usrDetail=userDetail.getData();
        console.log(usrDetail);
        if(user.uploadimg!=undefined)
            $scope.coverprofilepic="data:image/png;base64,"+user.uploadimg[0].base64;
        else
            $scope.coverprofilepic="";
        console.log($scope.imageUploadType);

        $scope.checkimg={
            "fileName": "",
            "fileExtension": "",
            "fileBaseCode": "",
            "kavya":""
        };
        $scope.$watch('user.uploadimg',function (newvalue) {
            if(newvalue){
                console.log(newvalue);
                var content=newvalue[0].base64;
                $scope.checkimg.fileName=newvalue[0].filename;
                var ext=$scope.checkimg.fileName.split(".");
                $scope.checkimg.fileExtension=ext[ext.length-1];
                $scope.checkimg.fileBaseCode=content;
                console.log($scope.checkimg);
            }
        });
        var coverprofileReq={
            "requestMessage": "uploadstartuppic",
            "requestId": "131",
            "apiKey": "",
            "requestCategory": "crud_startup",
            "requestData": [
                {
                    "user_id":usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_seo_url": $stateParams.pitchurl,
                    "image_for":$scope.imageUploadType,
                    "base64_image": $scope.coverprofilepic
                }
            ]
        }
        console.log(JSON.stringify(coverprofileReq))
        console.log(urls.apiUrl+'startups/uploadPic')
        $http.post(urls.apiUrl+'startups/uploadPic',coverprofileReq).success(function (data, status, headers, config) {
            console.log(data);
            globalFunc.subLoader("no")
            if (data.result == "yes") {
                $scope.uploadimages=data.resultData[0];
                console.log($scope.data);
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage);
            } else
                {

                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage);

            }
        }).
        error(function (data, status, headers, config) {
            console.log("error");
        });

    }

    /*----------------------TeamForm API--------------------*/

    $scope.checkextension=function(){
        console.log("only png and jpg image")
        var file = document.querySelector("#fUpload");
        if ( /\.(jpe?g|png)$/i.test(file.files[0].name) === false ) {
            $scope.fileerror="Please upload jpg/png images";
        }else{
            $scope.fileerror=false;
        }
    }
    $scope.teamForm=function (user) {
        console.log(user);
        globalFunc.subLoader("yes")
        var usrDetail=userDetail.getData();
        console.log(usrDetail);
        $scope.membername=user.tmname;
        $scope.memberdesignation=user.tmdesignation;
        $scope.aboutmember=user.tmdescription;
        console.log(user.checkscreen)
        if(user.checkscreen!=''){
            if(user.checkscreen!=undefined)
                $scope.memberprofilepic="data:image/png/jpg;base64,"+user.checkscreen[0].base64;
            else
                $scope.memberprofilepic="";
        }
        else
        {
            $scope.memberprofilepic="";
        }
        $scope.checkimg={
            "fileName": "",
            "fileExtension": "",
            "fileBaseCode": "",
            "kavya":""
        };
        $scope.$watch('user.checkscreen',function (newvalue) {
            if(newvalue){
                console.log(newvalue);
                var content=newvalue[0].base64;
                $scope.checkimg.fileName=newvalue[0].filename;
                var ext=$scope.checkimg.fileName.split(".");
                $scope.checkimg.fileExtension=ext[ext.length-1];
                $scope.checkimg.fileBaseCode=content;
                console.log($scope.checkimg);
            }
        });
        $scope.memberemailid=user.member_email_id;
        var startupteamReq=/* {
            "requestMessage": "addstartupteammember",
            "requestId": "136",
            "apiKey": "",
            "requestData": [
               {
                    "user_id":usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_seo_url":  $stateParams.pitchurl,
                    "member_name": $scope.membername,
                    "member_designation":  $scope.memberdesignation,
                    "about_member": $scope.aboutmember,
                    "member_profile_pic": $scope.memberprofilepic

                }

            ]
        }*/
        {
            "requestMessage": "addstartupteammember",
            "requestId": "136",
            "apiKey": "",
            "requestCategory": "crud_startup",
            "requestData": [
            {
                "user_id":usrDetail.userId,
                "email": usrDetail.email,
                "session_id": usrDetail.sessionId,
                "role": usrDetail.role,
                "startup_seo_url":  $stateParams.pitchurl,
                "member_email_id":  $scope.memberemailid
            }
        ]
        }
        console.log(JSON.stringify(startupteamReq))
        console.log(urls.apiUrl+'startups/addTeamMember')
        $http.post(urls.apiUrl+'startups/addTeamMember',startupteamReq)
       /* $http.post('json/team.json',startupteamReq)*/ .success(function (data, status, headers, config) {
            console.log(data);
            globalFunc.subLoader("no")
            if (data.result == "yes") {
                $scope.teammember=data.resultData;
                console.log($scope.teammember);
                $scope.startupdetailteam.push(data.resultData[0]);
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage);
               $window.location.reload();
            }
            else
            {

                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage);

            }
        }).
        error(function (data, status, headers, config) {
            console.log("error");
        });
    }
   /* $scope.member_id={'+++++++++++++++++':""}*/
    $scope.deleteEvent = function(_id,index) {
       /* alert('yes deleted')*/
        var usrDetail=userDetail.getData();
        console.log(_id);
        console.log(index);
       console.log("delet+++++++++++++++++++++++++++")
        $scope.memberid = _id;
        console.log( $scope.memberid)
        var teamdeleteReq = {
            "requestMessage": "deletestartupteammember",
            "requestId": "137",
            "apiKey": "",
            "requestCategory": "crud_startup",
            "requestData": [
                {
                    "user_id":usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_seo_url":  $stateParams.pitchurl,
                    "member_id": $scope.memberid,
                    "profile_pic_format": "png"
                }
            ]
        }
        console.log(teamdeleteReq);
        console.log("++++++++++++++++++++++++++++++++++++++")
        console.log(JSON.stringify(teamdeleteReq))
        console.log(urls.apiUrl + 'startups/deleteTeamMember')
        $http.post(urls.apiUrl + 'startups/deleteTeamMember', teamdeleteReq).success(function (data, status, headers, config) {
            globalFunc.subLoader('no')
            console.log(data);
            if (data.result == "yes") {
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage)
                 $window.location.reload();

            } else {
                $rootScope.myApp.hidePleaseWait()
                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)

            }
        }).error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        })


    }
    /*--------------------artifact API----------------------*/
    /* $scope.member_id={'+++++++++++++++++':""}*/

    /*----------------------viedo API--------------------*/
   // $scope.code = 'oHg5SJYRHA0';
    /*$scope.regex = '\\d+';*/
    $scope.regex = RegExp('^((https?|ftp)://)?([A-Za-z]+\\.)?[A-Za-z0-9-]+(\\.[a-zA-Z]{1,4}){1,2}(/.*\\?.*)?$', 'i');
     /* $scope.regex =RegExp('/^(https?:\/\/)?[a-z0-9-]*\.?[a-z0-9-]+\.[a-z0-9-]+(\/[^<>]*)?$/');*/
        console.log( $scope.regex +"**********************");
         $scope.viedourl = function (user) {
             /*alert("PLSSSSSSSSSSSSSSSSSSSSSSSSSSS")*/
        console.log(user);
        $scope.youtubeid=user.youtubeid;
        var youtubeId= $scope.youtubeid.split('v=')[1].split('&')[0];
        console.log( $scope.website);
        $scope.seesionid = $localStorage.userDetail.sessionId;
        $scope.email = $localStorage.userDetail.email;
        $scope.userid = $localStorage.userDetail.userId;
        $scope.role = $localStorage.userDetail.role;
        var storyboardReq = {
            "requestMessage": "addstartuppitchurl",
            "requestId": "133",
            "apiKey": "",
            "requestCategory": "crud_startup",
            "requestData": [
                {
                    "user_id": $scope.userid,
                    "email": $scope.email,
                    "session_id": $scope.seesionid,
                    "role": $scope.role,
                    "startup_seo_url": $stateParams.pitchurl,
                    "startup_pitch_url":  $scope.youtubeid
                }
            ]
          /*  "requestData": [
                {
                    "user_id": $scope.userid,
                    "email": $scope.email,
                    "session_id": $scope.seesionid,
                    "role": $scope.role,
                    "startup_seo_url": $stateParams.pitchurl,
                    "startup_pitch_vdo_id": youtubeId,
                    "vdo_source": "youtube"
                }
            ]*/
        }
        globalFunc.mainLoader('yes');
        console.log("++++++++++++++++++++++++++++++++++++++")
        console.log(JSON.stringify(storyboardReq))
        console.log(urls.apiUrl + 'startups/addPitchUrl')
        $http.post(urls.apiUrl + 'startups/addPitchUrl', storyboardReq).success(function (data, status, headers, config) {
            console.log(data);
            if (data.result == "yes") {
                $scope.openModal=false;
               /* $rootScope.myApp.hidePleaseWait()*/
                $scope.startupurldetail=data.resultData[0];
                $scope.newyoutubeId={'videoId':$scope.startupurldetail.startup_pitch_vdo_id};
               // $('#youtubeFrame').attr('src',"//www.youtube.com/embed/"+$scope.newyoutubeId+"?rel=0");
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage)
                 $window.location.reload();
            } else
            {
                $rootScope.myApp.hidePleaseWait()
                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)

            }
        }).error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        })
    }

    /*--------------------viedoedelet API----------------------*/
    /* $scope.member_id={'+++++++++++++++++':""}*/
    $scope.deletevideo = function(user) {
       /* alert("vvvvvvvvvvvvvvvvvvvvvvvvvvvv")*/
        var usrDetail=userDetail.getData();
        console.log(user)
        console.log("delet+++++++++++++++++++++++++++")
        $scope.pitchid = user;
        var videodeleteReq = {
            "requestMessage": "removestartuppitchurl",
            "requestId": "139",
            "apiKey": "",
            "requestCategory": "crud_startup",
            "requestData": [
                {
                    "user_id":usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_seo_url":  $stateParams.pitchurl,
                    "pitch_id":$scope.pitchid
                }
            ]
        }
        globalFunc.mainLoader('yes');
        console.log(videodeleteReq);
        console.log("++++++++++++++++++++++++++++++++++++++")
        console.log(JSON.stringify(videodeleteReq))
        console.log(urls.apiUrl + 'startups/deletePitchUrl')
        $http.post(urls.apiUrl + 'startups/deletePitchUrl', videodeleteReq).success(function (data, status, headers, config) {
            console.log(data);
            if (data.result == "yes") {

                $rootScope.myApp.hidePleaseWait()
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage)
                 $window.location.reload();

            } else {
                $rootScope.myApp.hidePleaseWait()
                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)

            }
        }).error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        })

    }
    /*----------------Artifact API------------------------*/
    $scope.users={'artifacturl':""}
    $scope.regex = RegExp('^((https?|ftp)://)?([a-z]+[.])?[a-z0-9-]+([.][a-z]{1,4}){1,2}(/.*[?].*)?$', 'i');
    $scope.artifact = function (users) {
        console.log(users);
            console.log("Arifcat form-----------+++++++");
        var usrDetail=userDetail.getData();
        $scope.artifacturl = users.artifacturl;
        var arifactReq ={
            "requestMessage": "addstartupartifact",
            "requestId": "140",
            "apiKey": "",
            "requestCategory": "crud_startup",
            "requestData": [
                {
                    "user_id":usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_seo_url": $stateParams.pitchurl,
                   "artifact_title": "",
                    "artifact_link":  $scope.artifacturl,
                    "artifact_desc": "I am a very simple card I am good at containing small bits of information I am convenient because I require little markup to use effectively",
                    "artifact_img_url":""
                }
            ]

        }
        globalFunc.mainLoader('yes');
        console.log("++++++++++++++++++++++++++++++++++++++")
        console.log(JSON.stringify(arifactReq))
        console.log(urls.apiUrl + 'startups/addArtifact')
        $http.post(urls.apiUrl + 'startups/addArtifact', arifactReq)
            .success(function (data, status, headers, config) {
            console.log(data);
            if (data.result == "yes") {
                console.log(data);
                    $scope.artifactdetail=data.resultData[0];
                    $window.location.reload();
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage)

            } else {
                $rootScope.myApp.hidePleaseWait()
                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)


            }
        }).error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        })
        }
        
        //TO SAVE DETAILS

    $scope.saveDetail=function (data,key,id) {
        globalFunc.subLoader('yes');
        console.log(data+"==="+key);
        var url="";
if(id==undefined){
    url='startups/updateStartUpPitch';
    var request={
        "requestMessage": "updatestartuppitch",
        "requestId": "134",
        "apiKey": "",
        "requestCategory": "crud_startup",
        "requestData": [
            {
                "user_id": usrDetail.userId,
                "email": usrDetail.email,
                "session_id": usrDetail.sessionId,
                "role": usrDetail.role,
                "startup_seo_url": $stateParams.pitchurl,
                "field_key": key,
                "field_value": data
            }
        ]
    }
}else{
url='startups/updateStartUpSummary';
    console.log(url+"----"+id);
    var request={
        "requestMessage": "updatestartupsummary",
        "requestId": "134",
        "apiKey": "",
        "requestCategory": "crud_startup",
        "requestData": [
            {
                "user_id": usrDetail.userId,
                "email": usrDetail.email,
                "session_id": usrDetail.sessionId,
                "role": usrDetail.role,
                "startup_seo_url": $stateParams.pitchurl,
                "field_key": key,
                "root_key": key,
                "sub_key": id,
                "data": data
            }
        ]
    }
}

console.log(JSON.stringify(request))
console.log(url)

       return globalFunc.updateFields(request,url)
            .then(function (data, status, headers, config) {
                console.log("KEYYYYYY",key);
                if(key=='startup_name'){
                    var startup_url=data.resultData[0].startup_seo_url;
                    console.log(startup_url+"----- PITCH URL")
                    $state.go('startupdetails',{'pitchurl':startup_url})
                }
                console.log("ddddddd",data);
                globalFunc.subLoader('no');
                return data;
            },function (err) {
                globalFunc.subLoader('no');
                console.log("------------");
                return data;

            });
    }

    $scope.users={'artifacturl':"",'artifactId':""}
    console.log($scope.users)
    $scope.modalArtifactFun=function (artifact,artifactid) {
        $scope.modalArtifactedit=true;
        console.log("OPENING")
        console.log(artifactid+"00000000000000000000")
        $scope.users={'artifacturl':artifact.artifact_link,'artifactId':artifact.artifact_id}
        var usrDetail=userDetail.getData();
        console.log(artifactid)
        console.log("delet+++++++++++++++++++++++++++")
        $scope.artifactid = artifactid;
        console.log()



    }
    $scope.modalvFun=function (pitchid,pitch_url) {
        $scope.vpitchid=pitchid
        $scope.vpitchurl=pitch_url
        $scope.modalvedit = true;
        console.log("please open")
    }
    $scope.saveviedo = function(pitchid,pitchurl) {
        var usrDetail=userDetail.getData();
        console.log(pitchurl+'*************8888888888888')
        console.log(pitchid+'*************999999999')
        var startupviedoeditReq={
            "requestMessage": "editstartuppitchurl",
            "requestId": "138",
            "requestCategory": "crud_startup",
            "apiKey": "",
            "requestData": [
                {
                    "user_id": usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_seo_url": $stateParams.pitchurl,
                    "pitch_id":pitchid,
                    "startup_pitch_url":pitchurl
                }
            ]
        }
        globalFunc.mainLoader('yes');
        console.log(startupviedoeditReq);
        console.log(JSON.stringify(startupviedoeditReq))
        console.log(urls.apiUrl + 'startups/editPitchUrl')
        $http.post(urls.apiUrl + 'startups/editPitchUrl', startupviedoeditReq).success(function (data, status, headers, config) {
            console.log(".........................................................");
            console.log(data);
            if (data.result == "yes") {

                $rootScope.myApp.hidePleaseWait()
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success("Startup Pitch updated successfully")
                $scope.startupdetailpitch=[data.resultData[0]];
                //$window.location.reload();
                $scope.modalvedit = false;

            } else {
                $rootScope.myApp.hidePleaseWait()
                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)

            }
        }).error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        })
    }

    $scope.deleteArtifact = function(artifact) {
        var artifactdeleteReq = {
            "requestMessage": "deletestartupartifact",
            "requestId": "139",
            "apiKey": "",
            "requestCategory": "crud_startup",
            "requestData": [
                {
                    "user_id": usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_seo_url": $stateParams.pitchurl,
                    "artifact_id": $scope.artifactid
                }
            ]
        }
        globalFunc.mainLoader('yes');
        console.log(artifactdeleteReq);
        console.log("++++++++++++++++++++++++++++++++++++++")
        console.log(JSON.stringify(artifactdeleteReq))
        console.log(urls.apiUrl + 'startups/deleteArtifact')
        $http.post(urls.apiUrl + 'startups/deleteArtifact', artifactdeleteReq).success(function (data, status, headers, config) {
            console.log(data);
            if (data.result == "yes") {

                $rootScope.myApp.hidePleaseWait()
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage)
                $window.location.reload();

            } else {
                $rootScope.myApp.hidePleaseWait()
                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)

            }
        }).error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        })
    }
    $scope.saveArtifact=function (user) {
        console.log(user);
        var saveArtifactReq={
            "requestMessage": "editstartupartifact",
                "requestId": "141",
                "apiKey": "",
            "requestCategory": "crud_startup",
                "requestData": [
                {
                    "user_id": usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_seo_url": $stateParams.pitchurl,
                    "artifact_id": user.artifactId,
                    "artifact_title":"",
                    "artifact_link":  user.artifacturl,
                    "artifact_desc": "I am a very simple card I am good at containing small bits of information I am convenient because I require little markup to use effectively",
                    "artifact_img_url": "sdfsdf"
                }
            ]
        }
        console.log(saveArtifactReq);
        globalFunc.mainLoader('yes');
        console.log(urls.apiUrl + 'startups/editArtifact')
        $http.post(urls.apiUrl + 'startups/editArtifact', saveArtifactReq)
            .success(function (data, status, headers, config) {
                console.log(data);
                if (data.result == "yes") {
                    console.log(data);
                    $scope.artifactdetail=data.resultData[0];
                    $scope.sucessMessage = data.resultData[0].message;
                    toastr.success($scope.sucessMessage)
                     $window.location.reload();
                } else {
                    $rootScope.myApp.hidePleaseWait()
                    $scope.failureMessage = data.resultData[0].message;
                    toastr.error($scope.failureMessage)

                }
            }).error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        })

    }

    $scope.user={'tmname':"",'tmdesignation':"",'tmdescription':"",'checkscreen':"",'memberId':""}
    $scope.modalTeamFun=function (user) {
        $scope.modalTeamtedit=true;
        console.log("OPENING")
        $scope.user={'tmname':user.member_name,'tmdesignation':user.member_designation,'tmdescription':user.about_member,'checkscreen':"",'memberId':user.member_id}
        console.log($scope.user)
    }
    $scope.editteamForm=function (user) {
        console.log(user);
        var usrDetail=userDetail.getData();
        $scope.modalTeamtedit=false;
        console.log(usrDetail);
       /* $scope.membername=user.tmname;
        $scope.memberdesignation=user.tmdesignation;
        $scope.aboutmember=user.tmdescription;*/
        var memberprofilepic="";
        $scope.checkimg={
            "fileName": "",
            "fileExtension": "",
            "fileBaseCode": "",
            "kavya":""
        };
        console.log($scope.checkimg)
        $scope.$watch('user.checkscreen',function (newvalue) {
            if(newvalue){
                console.log(newvalue);
                var content=newvalue[0].base64;
                $scope.checkimg.fileName=newvalue[0].filename;
                if($scope.checkimg.fileName!=""){
                    var ext=$scope.checkimg.fileName.split(".");
                    $scope.checkimg.fileExtension=ext[ext.length-1];
                    memberprofilepic="data:image/png;base64,"+content;
                }
                console.log($scope.checkimg);
            }
        });
        var editteamformReq={
            "requestMessage": "editstartupteammember",
            "requestId": "137",
            "apiKey": "",
            "requestData": [
                {
                    "user_id":usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_seo_url":  $stateParams.pitchurl,
                    "member_id": user.memberId,
                    "member_name": user.tmname,
                    "member_designation":  user.tmdesignation,
                    "about_member": user.tmdescription,
                    "member_profile_pic": memberprofilepic
                }
            ]
        }
        globalFunc.mainLoader('yes');
        console.log(editteamformReq)
        console.log(urls.apiUrl + 'startups/editTeamMember')
        $http.post(urls.apiUrl + 'startups/editTeamMember', editteamformReq)
            .success(function (data, status, headers, config) {
                console.log(data);
                if (data.result == "yes") {
                    console.log(data);
                    $scope.sucessMessage = data.resultData[0].message;
                    toastr.success($scope.sucessMessage)
                } else {
                    $rootScope.myApp.hidePleaseWait()
                    $scope.failureMessage = data.resultData[0].message;
                    toastr.error($scope.failureMessage)

                }
            }).error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        })
    }
    $scope.deletstartup=function () {
        /*alert("delete startup****************")*/
        var usrDetail=userDetail.getData();
        var deletstartupReq=
        {
            "requestMessage": "updatestartuppitch",
            "requestId": "134",
            "requestCategory": "crud_startup",
            "apiKey": "",
            "requestData": [
                {
                    "user_id":usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_seo_url":  $stateParams.pitchurl,
                    "field_key": "startup_status",
                    "field_value": "deleted"
                }
            ]
        }
        globalFunc.mainLoader('yes');
        console.log(JSON.stringify(deletstartupReq))
        console.log(urls.apiUrl+'startups/updateStartUpPitch')
        $http.post(urls.apiUrl+'startups/updateStartUpPitch',deletstartupReq).success(function (data, status, headers, config) {
            if (data.result == "yes") {
                $rootScope.myApp.hidePleaseWait()
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage)
                $state.go('startuppitchform')
            } else {
                $rootScope.myApp.hidePleaseWait()
                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)

            }
        }).
        error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        });
    }

    $scope.emailsearch=function (user) {
       /* alert("AAAAAAAAAAAAAAAAAAAAAA")*/
        $scope.searchemail=user
        console.log($scope.searchemail)
        var usrDetail=userDetail.getData();
        var emailsearchReq={
            "requestMessage": "searchusersbyemail",
            "requestId": "208",
            "apiKey": "",
            "requestData": [
                {
                    "user_id": usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "search_email": $scope.searchemail
                }
            ]
        }
        console.log(emailsearchReq)
        console.log(JSON.stringify(emailsearchReq))
        console.log(urls.apiUrl+'users/searchByEmail')
        $http.post(urls.apiUrl+'users/searchByEmail',emailsearchReq).success(function (data, status, headers, config) {
            console.log(data)
            if (data.result == "yes") {
                $rootScope.myApp.hidePleaseWait()
                $scope.serachemailteam = data.resultData[0];
              /*  toastr.success($scope.sucessMessage)*/
            } else {
                $rootScope.myApp.hidePleaseWait()
                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)

            }
        }).
        error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        });
    }

})

.controller('adviceboardCtrl', function($scope, $rootScope,$window, $stateParams, $state, $http,toastr, urls,$localStorage,userAuth,globalFunc,userDetail) {
    console.log('adviceboardCtrl...........');
    var usrDetail=userDetail.getData();
    $scope.checklogindata=function(){
        console.log("((((((((((((((")
           if (userAuth.checkLogin() == true) {
            $('#creatquryModal').openModal()
        }else
        {
            $state.go('loginsignup')
        }
    }
    $scope.fourfive=function (querystatus) {
        var status='';
        if(querystatus==2)
            status='closed'
        if(querystatus==3)
            status='pending'
        console.log(usrDetail);
        var listqueryReq=
        {
            "requestMessage": "liststartupqueries",
            "requestId": "152",
            "apiKey": "",
            "requestCategory": "crud_query",
            "requestData": [
                {
                    "user_id": usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_seo_url":$stateParams.pitchurl,
                    "page_number": 1,
                    "query_status":status,
                    "limit_number": 10
                }
            ]
        }
        globalFunc.subLoader('yes');
        console.log(JSON.stringify(listqueryReq))
        console.log(urls.apiUrl+'startups/insightBoard/listQueries')
        $scope.imageUrl=urls.imageUrl;
        $http.post(urls.apiUrl+'startups/insightBoard/listQueries',listqueryReq).success(function (data, status, headers, config) {
            globalFunc.subLoader('no');
            if (data.result == "yes") {

                $scope.listquestion= data.resultData[0].startup_queries;
                console.log($scope.listquestion);
                $scope.querynum= $scope.listquestion[0].query_number
                console.log( $scope.querynum);
            } else {
                $scope.failureMessage = data.resultData[0].message;
                $scope.listquestion=[];
                toastr.error($scope.failureMessage)

            }
        }).
        error(function (data, status, headers, config) {
            globalFunc.subLoader('no');
            console.log("error");

        });
    }

    $scope.href = urls.href;
    $scope.pitchurl=$stateParams.pitchurl
    console.log( $scope.pitchurl)
    var usrDetail=userDetail.getData();
    $scope.userId=usrDetail.userId;
    console.log(usrDetail);
    $scope.permission='no';
    console.log($scope.permission)
    var requestData=
    {
        "requestMessage": "getstartuppitch",
        "requestId": "121",
        "apiKey": "",
        "requestCategory": "read_startup",
        "requestData": [

            {
                "user_id": usrDetail.userId,
                "email": usrDetail.email,
                "session_id": usrDetail.seesionId,
                "role": usrDetail.role,
                "startup_seo_url":$stateParams.pitchurl
            }
        ]
    }
    globalFunc.mainLoader('yes');
    console.log(JSON.stringify(requestData))
    console.log(urls.apiUrl+'startups/getStartUpPitch')
    $rootScope.myApp.showPleaseWait();
    $scope.imageUrl=urls.imageUrl;
    $http.post(urls.apiUrl+'startups/getStartUpPitch',requestData).success(function (data, status, headers, config) {
        console.log("list");
        console.log(JSON.stringify(data));
        if (data.result == "yes") {
            $rootScope.myApp.hidePleaseWait()
            $scope.startupdetail=data.resultData[0].startup_details;
            $scope.startupdetailpitch=$scope.startupdetail.pitch_videos;
            $scope.startupdetailteam=$scope.startupdetail.startup_team;
            $scope.startupdetailartifcat=$scope.startupdetail.startup_artifacts;
            $scope.profileImage=$scope.startupdetail.startup_logo;
            $scope.permission=data.resultData[0].editable;
            console.log($scope.permission);
            console.log( $scope.startupdetailteam)
        } else {
            $rootScope.myApp.hidePleaseWait()
            $scope.failureMessage = data.resultData[0].message;
            toastr.error($scope.failureMessage)
            $state.go('startuppitchform')
        }
    }).
    error(function (data, status, headers, config) {
        $rootScope.myApp.hidePleaseWait()
        console.log("error");

    });
    /*-----------------Create Query API---------------------*/
    $scope.createquery=function (query) {
        /*alert("adviceboard............")*/
     globalFunc.subLoader("yes")
        var usrDetail=userDetail.getData();
        console.log(usrDetail);
        $scope.query=query.question;
        console.log($scope.query);
        var creatqueryReq=
        {
            "requestMessage": "addstartupquery",
            "requestId": "151",
            "apiKey": "",
            "requestCategory": "crud_query",
            "requestData": [
                {
                    "user_id": usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_seo_url":$stateParams.pitchurl,
                    "startup_query": $scope.query
                }
            ]
        }
        globalFunc.mainLoader('yes');
        console.log(JSON.stringify(creatqueryReq))
        console.log(urls.apiUrl+'startups/insightBoard/addQuery')
        $scope.imageUrl=urls.imageUrl;
        $http.post(urls.apiUrl+'startups/insightBoard/addQuery',creatqueryReq).success(function (data, status, headers, config) {
            globalFunc.mainLoader('no');
            if (data.result == "yes") {

                if($scope.listquestion==undefined)
                    $scope.listquestion=data.resultData[0].query_details[0];
                else
                    $scope.listquestion.push(data.resultData[0].query_details[0]);

                $scope.quserid=$scope.listquestion[0].created_by._id,
                $scope.userid=usrDetail.userId
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage)

            } else {

                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)

            }

        }).
        error(function (data, status, headers, config) {
            globalFunc.subLoader("no")
            console.log("error");
            $scope.listquestion=[];

        });
        
    }


})
.controller('querydetailCtrl', function($scope, $rootScope,$window, $stateParams, $state, $http,toastr, urls,$localStorage,userAuth,userDetail,globalFunc) {
 console.log('hai...........');
    $scope.queryid=$stateParams.queryid
    console.log($scope.queryid,"queryNum")
    $scope.href = urls.href;
    $scope.pitchurl=$stateParams.pitchurl
    console.log( $scope.pitchurl)
    var usrDetail=userDetail.getData();
    $scope.userId=usrDetail.userId;
    console.log(usrDetail);
    $scope.permission='no';
    console.log($scope.permission)
    var requestData=
    {
        "requestMessage": "getstartuppitch",
        "requestId": "121",
        "apiKey": "",
        "requestCategory": "read_startup",
        "requestData": [

            {
                "user_id": usrDetail.userId,
                "email": usrDetail.email,
                "session_id": usrDetail.seesionId,
                "role": usrDetail.role,
                "startup_seo_url":$stateParams.pitchurl
            }
        ]
    }
    globalFunc.mainLoader('yes');
    console.log(JSON.stringify(requestData))
    console.log(urls.apiUrl+'startups/getStartUpPitch')
    $rootScope.myApp.showPleaseWait();
    $scope.imageUrl=urls.imageUrl;
    $http.post(urls.apiUrl+'startups/getStartUpPitch',requestData).success(function (data, status, headers, config) {
        console.log("list");
        console.log(JSON.stringify(data));
        if (data.result == "yes") {
            $rootScope.myApp.hidePleaseWait()
            $scope.startupdetail=data.resultData[0].startup_details;
            $scope.startupdetailpitch=$scope.startupdetail.pitch_videos;
            $scope.startupdetailteam=$scope.startupdetail.startup_team;
            $scope.startupdetailartifcat=$scope.startupdetail.startup_artifacts;
            $scope.profileImage=$scope.startupdetail.startup_logo;
            $scope.permission=data.resultData[0].editable;
            console.log($scope.permission);
            console.log( $scope.startupdetailteam)
        } else {
            $rootScope.myApp.hidePleaseWait()
            $scope.failureMessage = data.resultData[0].message;
            toastr.error($scope.failureMessage)
            $state.go('startuppitchform')
        }
    }).
    error(function (data, status, headers, config) {
        $rootScope.myApp.hidePleaseWait()
        console.log("error");

    });

    var querydetail=
    {
        "requestMessage": "getstartupquerydetails",
        "requestId": "158",
        "apiKey": "",
        "requestCategory": "crud_query",
        "requestData": [
            {
                "user_id": usrDetail.userId,
                "email": usrDetail.email,
                "session_id": usrDetail.seesionId,
                "role": usrDetail.role,
                "startup_seo_url":$stateParams.pitchurl,
                "query_number":$scope.queryid
            }
        ]
    }
    globalFunc.mainLoader('yes');
    console.log(JSON.stringify(querydetail))
    console.log(urls.apiUrl+'startups/insightBoard/getQuery')
    $http.post(urls.apiUrl+'startups/insightBoard/getQuery',querydetail).success(function (data, status, headers, config) {
        if (data.result == "yes") {
            $rootScope.myApp.hidePleaseWait()
            console.log(data);
            $scope.inqdetails=data.resultData[0].query_details;
            console.log($scope.inqdetails);
        } else {
            $rootScope.myApp.hidePleaseWait()
            $scope.failureMessage = data.resultData[0].message;
            toastr.error($scope.failureMessage)

        }
    }).
    error(function (data, status, headers, config) {
        $rootScope.myApp.hidePleaseWait()
        console.log("error");

    });


})
.controller('queryListCtrl',function ($scope, $rootScope,urls,toastr, $window,userDetail,globalFunc,$http,$state,$stateParams) {
        var data=$scope.querydata;
    $scope.currentstate=$state.current.name;
    var userData=userDetail.getData();
    $scope.userId=userData.userId;
    $scope.href=urls.href;
    $scope.permission='no';
    console.log($scope.permission)
    if($scope.querydata.created_by['_id']==$scope.userId){
        $scope.permission='yes';
    }
    if(userData.role=='incubator'){
        $scope.permission='yes';
    }
    console.log("kkkkkkkkkkkkkkk",data)
       if(data.query_status=='pending')
        {
            $scope.switch={'enable':false}

        }
        else
        {
            $scope.switch={'enable':true}
        }

    $scope.conversationList=[];
$scope.conversationList=data.conversations;
console.log("SCOPE OF CONVERSATIONS ")
console.log($scope.conversationList)

       $scope.queryStats={
                   startupId:data.startup_id['_id'],
                insightId:data._id,
                 conversations_count:data.conversations_count,
                likes_count:data.likes_count,
                kudos_count:data.kudos_count,
                insights_count:data.insights_count,
                user_like:data.user_like,
                user_kudos:data.user_kudos,
                user_insight:data.user_insight
               }
    $scope.showHideQueryDetail=false;
       if($stateParams.queryid!=undefined){
           $scope.showHideQueryDetail=true;
       }
       $scope.$watch('$parent.queryStats',function (oldVal,newVal) {
           console.log("INSIDE QUERY LIST")
       })

    /*$scope.switch = {'enable':true};*/
    $scope.changestatus = function(stid,insid,status) {
        globalFunc.subLoader('yes')
        /*alert("*****************")*/
        var usrDetail = userDetail.getData();
        console.log(insid)
        if(status==true)
        {
            var x='closed';
            console.log(x)
        }
        else
            {
           var x='pending';
                console.log(x)
            }

        var updatequerystusReq={
            "requestMessage": "updatequerystatus",
            "requestId": "155",
            "requestCategory": "crud_query",
            "apiKey": "",
            "requestData": [
            {
                "user_id": usrDetail.userId,
                "email": usrDetail.email,
                "session_id": usrDetail.sessionId,
                "role": usrDetail.role,
                "startup_id": stid,
                "insight_id": insid,
                "query_status": x
            }
         ]
        }
        console.log(JSON.stringify(updatequerystusReq))
        console.log(urls.apiUrl+'startups/insightBoard/updateQueryStatus')
        $http.post(urls.apiUrl+'startups/insightBoard/updateQueryStatus',updatequerystusReq).success(function (data, status, headers, config) {
            if (data.result == "yes") {
               globalFunc.subLoader('no')
                console.log(data);
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage)
            } else {
                $rootScope.myApp.hidePleaseWait()
                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)

            }
        }).
        error(function (data, status, headers, config) {
            globalFunc.subLoader('no')
            console.log("error");

        });


    }
    /*-------------------------Edit Query API-------------------------*/
    $scope.queryEdit=["123"]
    $scope.modaleditFun=function (query) {
        $scope.editQury=true;
        console.log("OPENING")
        console.log(query);
        $scope.queryEdit=query;//{'startupid':query.startup_id._id,'insightquery':query._id,'startupstatus':query.query,'queryquestion':query.query}
        console.log( $scope.queryEdit)

        $scope.$watch('queryEdit',function(newVal,oldVal){
            $scope.queryEdit2=newVal;
            console.log(newVal)
        })

    }
    $scope.query={'startupid':""}
    $scope.query={'insightid':""}
    $scope.editquery=function (qstupid,qinid,query) {
        console.log("***************************")
        console.log(query,qstupid,qinid);
        var usrDetail=userDetail.getData();
        console.log(usrDetail);
        var editqueryReq=
        {
            "requestMessage": "editstartupquery",
            "requestId": "156",
            "apiKey": "",
            "requestCategory": "crud_query",
            "requestData": [
                {
                    "user_id": usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_id":  qstupid,
                    "insight_id":  qinid,
                    "query": query
                }
            ]
        }/*{
         "requestMessage": "updatequerystatus",
         "requestId": "155",
         "apiKey": "",
         "requestData": [
         { "user_id": usrDetail.userId,
         "email": usrDetail.email,
         "session_id": usrDetail.sessionId,
         "role": usrDetail.role,
         "startup_id":  queryEdit.startupid,
         "insight_id":  queryEdit.insightquery,
         "query_status": queryEdit.startupstatus
         }
         ]
         }*/
        console.log(JSON.stringify(editqueryReq))
        console.log(urls.apiUrl+'startups/insightBoard/editQuery')
        $http.post(urls.apiUrl+'startups/insightBoard/editQuery',editqueryReq).success(function (data, status, headers, config) {
            if (data.result == "yes") {
                $rootScope.myApp.hidePleaseWait()
                console.log(data);
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage)
                $window.location.reload();
            } else {
                $rootScope.myApp.hidePleaseWait()
                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)

            }
        }).
        error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        });

    }

    /*-------------------------Delete Query API-------------------------*/
    $scope.query={'startupid':""}
    $scope.query={'insightid':""}
    $scope.deletquery=function (query) {
        console.log("OPENING")
        console.log(query);
        console.log(query.startup_id._id+"***********************");
        var usrDetail=userDetail.getData();
        console.log(usrDetail);
        $scope.startupid = query.startup_id._id ;
        $scope.insightid =query._id;
        var deletqueryReq=
        {
            "requestMessage": "deletestartupquery",
            "requestId": "157",
            "apiKey": "",
            "requestCategory": "crud_query",
            "requestData": [
                {
                    "user_id": usrDetail.userId,
                    "email": usrDetail.email,
                    "session_id": usrDetail.sessionId,
                    "role": usrDetail.role,
                    "startup_id":  $scope.startupid,
                    "insight_id":  $scope.insightid
                }
            ]
        }
        console.log(JSON.stringify(deletqueryReq))
        console.log(urls.apiUrl+'startups/insightBoard/deleteQuery')
        $rootScope.myApp.showPleaseWait();
        $scope.imageUrl=urls.imageUrl;
        $http.post(urls.apiUrl+'startups/insightBoard/deleteQuery',deletqueryReq).success(function (data, status, headers, config) {
            if (data.result == "yes") {
                $rootScope.myApp.hidePleaseWait()
                $scope.sucessMessage = data.resultData[0].message;
                toastr.success($scope.sucessMessage)
                $window.location.reload();
            } else {
                $rootScope.myApp.hidePleaseWait()
                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)

            }
        }).
        error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        });

    }


})
    .controller('queryStatsCtrl',function ($scope,urls,userDetail,globalFunc,$http,toastr) {
        var data=$scope.querystats;
        var userData=userDetail.getData();
        $scope.userId=userData.userId;
       // $scope.conversations_count=$scope.querystats.conversations_count;
        $scope.likes_count=$scope.querystats.likes_count;
        $scope.kudos_count=$scope.querystats.kudos_count;
        $scope.insights_count=$scope.querystats.insights_count;

        $scope.user_like=$scope.querystats.user_like;
        $scope.user_kudos=$scope.querystats.user_kudos;
        $scope.user_insight=$scope.querystats.user_insight;
        console.log("-------------------------PARENT")

        var startupId=$scope.querystats.startupId;
        var insightId=$scope.querystats.insightId;
        $scope.updateStats=function (rootKey,userStatus) {
            var request={
                "requestMessage": "updatequerystats",
                "requestId": "155",
                "apiKey": "",
                "requestCategory": "crud_query",
                "requestData": [
                    {
                        "user_id": userData.userId,
                        "email": userData.email,
                        "session_id": userData.sessionId,
                        "role": userData.role,
                        "startup_id": startupId,
                        "insight_id": insightId,
                        "root_key": rootKey
                    }
                ]
            }
            console.log(request)
            globalFunc.subLoader('yes');
            $http.post(urls.apiUrl+'startups/insightBoard/updateQueryStats',request).success(function (data, status, headers, config) {
                if (data.result == "yes") {
                    console.log("SUCCESSSSS")
                    console.log(data)
                    $scope.likes_count=data.resultData[0].likes_count;
                    $scope.kudos_count=data.resultData[0].kudos_count;
                    $scope.insights_count=data.resultData[0].insights_count;
                    if(rootKey=='likes_count')
                        (userStatus=='yes') ? $scope.user_like='no' : $scope.user_like='yes';
                    if(rootKey=='kudos_count')
                        (userStatus=='yes') ? $scope.user_kudos='no' : $scope.user_kudos='yes';
                    if(rootKey=='insights_count')
                        (userStatus=='yes') ? $scope.user_insight='no' : $scope.user_insight='yes';


                } else {
                    $scope.failureMessage = data.resultData[0].message;
                    toastr.error($scope.failureMessage)

                }
                globalFunc.subLoader('no');
            }).
            error(function (data, status, headers, config) {
                globalFunc.subLoader('no');
                console.log("error");

            });


        }

    })
    /*----------------------headernav controller--------------------------*/
    .controller('homeCtrl', function($scope, $rootScope, $stateParams, $state,toastr,urls,userAuth,$http,userDetail,globalFunc) {
        console.log("homeCtrl********************");
        $scope.href = urls.apiHref;
        $scope.imageUrl=urls.imageUrl;
        /*--------------GET USERS STARTUPLIST API-----------------------*/
        /*var userData=userDetail.getData();
        $scope.userId=userData.userId;*/
        var startupReq={
            "requestMessage": "getstartupslist",
            "requestId": "135",
            "apiKey": "",
            "requestCategory": "read_startup",
            "requestData": [
                {
                    "user_id": "",
                    "email": "",
                    "session_id": "",
                    "role": "",
                    "category_seo_url": "",
                    "page_number": 1,
                    "limit_number": 10
                }
            ]
        }
        console.log(JSON.stringify(startupReq));

        $http.post(urls.apiUrl+'startups/getStartUps', startupReq).
        success(function (data, status, headers, config) {
            globalFunc.subLoader('no');
            console.log("start Up List");
            console.log(JSON.stringify(data));
            if(data.result=='yes'){
                $scope.startups=data.resultData[0].startup_list;
                console.log($scope.startups);

            } else{
                $scope.failureMessage=data.resultData[0].message;

            }
        }).
        error(function (data, status, headers, config) {
            console.log("error");
            globalFunc.subLoader('no');
        });



    })

    .controller('conversationCtrl',function ($scope,$element, $window,$compile ,urls,userDetail,globalFunc,$http,toastr,$stateParams) {
        $scope.showReply=false;
        $scope.showHideReply=function () {
            $scope.$emit('eventName', { message: 'testing' });

            if($scope.showReply==false)
                $scope.showReply=true;
            else
                $scope.showReply=false;
        }

        $scope.$on('eventName', function (event, args) {
            $scope.message = args.message;
            $scope.showReply=false;
            console.log("***********-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-");
            console.log($scope.message);
        });
        $scope.showHideQueryDetail=false;
        if($stateParams.queryid!=undefined){
            $scope.showHideQueryDetail=true;
        }
        var userData=userDetail.getData();
        $scope.page=1;
        $scope.limit=10;
        $scope.total=0;

        $scope.loadConversations=function (insightId,convId) {
            if(convId=='' || convId==undefined)
                convId=0;
            var request={
                "requestMessage": "getqueryconversations",
                "requestId": "159",
                "apiKey": "",
                "requestCategory": "crud_conversations",
                "requestData": [
                    {
                        "user_id": userData.userId,
                        "email": userData.email,
                        "session_id": userData.sessionId,
                        "role": userData.role,
                        "insight_id": insightId,
                        "conversation_id": convId,
                        "page_number": $scope.page,
                        "limit_number": $scope.limit
                    }
                ]
            }
            console.log(JSON.stringify(request))
            globalFunc.subLoader('yes');
            $http.post(urls.apiUrl+'startups/insightBoard/listConversations', request).
            success(function (data, status, headers, config) {
                globalFunc.subLoader('no');
                console.log("CONVERSATION LIST");
                console.log(JSON.stringify(data));
                if(data.result=='yes'){
                    $scope.total=data.resultData[0].list_details[0].totalCount;
                    $scope.page++;

                    if($scope.conversationList==undefined){
                        var el = $compile( "<conversation ng-repeat='conversation in conversationList' conv='conversation'></conversation>" )( $scope );
                        console.log("compile")
                        $element.find('.spl_class_test').append(el)
                        $scope.conversationList=data.resultData[0].conversations_list;
                    }else{
                        $scope.conversationList=$scope.conversationList.concat(data.resultData[0].conversations_list);
                    }

                    console.log(JSON.stringify($scope.conversationList))

                } else{
                    $scope.failureMessage=data.resultData[0].message;

                }
            }).
            error(function (data, status, headers, config) {
                console.log("error");
                globalFunc.subLoader('no');
            });
        }

        $scope.comment={'textarea':''};
        //SEND COMMENT
        $scope.createcomment=function (comment,replyto,qid) {
            globalFunc.subLoader("yes")
            var usrDetail=userDetail.getData();
            console.log(comment);
            console.log(qid+"QQQQQQQQQQQQQQQQQQQQQQQQQ")
            var createcommentReq={
                "requestMessage": "addnewconversation",
                "requestId": "157",
                "apiKey": "",
                "requestCategory": "crud_conversations",
                "requestData": [
                    {
                        "user_id": usrDetail.userId,
                        "email": usrDetail.email,
                        "session_id": usrDetail.sessionId,
                        "role": usrDetail.role,
                        "insight_id": qid,
                        "conversation_text":comment.textarea,
                        "reply_to": replyto
                    }
                ]
            }
            $scope.comment={'textarea':''};
            console.log(createcommentReq)
            console.log(JSON.stringify(createcommentReq))
            console.log(urls.apiUrl+'startups/insightBoard/addConversation')
            $http.post(urls.apiUrl+'startups/insightBoard/addConversation',createcommentReq).success(function (data, status, headers, config) {
                if (data.result == "yes") {
                    $scope.showReply=false;
                    console.log(data)
                    $scope.comments=data.resultData[0];
                    console.log(JSON.stringify($scope.comments))
                    console.log("OLD COMMENTS ")
                    console.log($scope.conversationList)
//TODO Profile pic is not visible
                    console.log("REPLY TO "+replyto)
                    if(replyto!=0){
                        if($scope.conversationList==undefined){
                            var el = $compile( "<conversation ng-repeat='conversation in conversationList' conv='conversation'></conversation>" )( $scope );
                            console.log("compile")
                            $element.find('.spl_class_test').append(el)
                            $scope.conversationList=[$scope.comments];
                        }else{
                                $scope.conversationList.push($scope.comments)
                        }
                        $scope.conv.replies_count++;
                    }else{
                        if($scope.$parent.conversationList==undefined)
                            $scope.$parent.conversationList=[$scope.comments];
                        else
                            $scope.$parent.conversationList.push($scope.comments)
                        $scope.$parent.queryStats.conversations_count++;

                    }


                    $scope.sucessMessage = data.resultData[0].message;
                    toastr.success($scope.sucessMessage)
                } else {
                    $scope.failureMessage = data.resultData[0].message;
                    toastr.error($scope.failureMessage)
                }
                globalFunc.subLoader("no")
            }).
            error(function (data, status, headers, config) {
                globalFunc.subLoader("no")
                console.log("error");
            });
        }
        $scope.deletconverstion=function (qid,convId) {
            console.log("**********************deletconverstion")
            console.log(qid)
            console.log(convId)
            var usrDetail=userDetail.getData();
            var deletconversationReq={
                "requestMessage": "deleteconversation",
                "requestId": "160",
                "requestCategory": "crud_conversations",
                "apiKey": "",
                "requestData": [
                    {
                        "user_id": usrDetail.userId,
                        "email": usrDetail.email,
                        "session_id": usrDetail.sessionId,
                        "role": usrDetail.role,
                        "insight_id": qid,
                        "conversation_id": convId
                    }
                ]
            }
            console.log(JSON.stringify(deletconversationReq))
            console.log(urls.apiUrl+'startups/insightBoard/deleteConversation')
            $http.post(urls.apiUrl+'startups/insightBoard/deleteConversation',deletconversationReq).success(function (data, status, headers, config) {
                if (data.result == "yes") {
                    $scope.sucessMessage = data.resultData[0].message;
                    toastr.success($scope.sucessMessage)
                    $window.location.reload();
                } else
                {
                    $scope.failureMessage = data.resultData[0].message;
                    toastr.error($scope.failureMessage)

                }
            }).
            error(function (data, status, headers, config) {
                $rootScope.myApp.hidePleaseWait()
                console.log("error");

            });

        }

    })


    .controller('profilePicCtrl',function ($scope,urls) {
        $scope.imgUrl=urls.imageUrl;
    })
    /*----------------------mentorsCtrl controller--------------------------*/
    .controller('mentorsCtrl', function($scope,$localStorage, $stateParams, $state,toastr,urls,userAuth,$http,userDetail,globalFunc) {
        $scope.href = urls.href;
        var userData=userDetail.getData();
        console.log(userData);
        $scope.imgUrl=urls.imageUrl;
        console.log( $scope.imgUrl)
        var mentorReq={
            "requestMessage": "getmentorslist",
            "requestId": "202",
            "apiKey": "",
            "requestData": [
                {
                    "user_id": userData.userId,
                    "email": userData.email,
                    "session_id": userData.sessionId,
                    "role": userData.role,
                    "page_number": 1,
                    "limit_number": 10
                }
            ]
        }
        console.log(JSON.stringify(mentorReq))
        console.log(urls.apiUrl+'users/listMentors')
        $http.post(urls.apiUrl+'users/listMentors',mentorReq).success(function (data, status, headers, config) {
            console.log(data)
            if (data.result == "yes") {
                $scope.mentor = data.resultData[0].mentors_list;
                console.log($scope.mentorurl)

            } else
            {
                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)

            }
        }).
        error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        });



    })
    /*----------------------mentordetailCtrl controller--------------------------*/
    .controller('mentordetailCtrl', function($scope,$localStorage, $stateParams, $state,toastr,urls,userAuth,$http,userDetail,globalFunc) {
        $scope.href = urls.href;
        var userData=userDetail.getData();
        console.log(userData.userId);
        $scope.localcuserid=userData.userId
        $scope.imgUrl=urls.imageUrl;
        $scope.role=userData.role
        console.log( $scope.imgUrl)
        $scope.permission='no';
        var getmentordetialReq={
            "requestMessage": "getmentordetails",
            "requestId": "203",
            "apiKey": "",
            "requestData": [
                {
                    "user_id": userData.userId,
                    "email": userData.email,
                    "session_id": userData.sessionId,
                    "role": userData.role,
                    "user_seo_url": $stateParams.mentorUrl
                }
            ]
        }
        console.log(JSON.stringify(getmentordetialReq))
        console.log(urls.apiUrl+'users/getMentorDetails')
        $http.post(urls.apiUrl+'users/getMentorDetails',getmentordetialReq).success(function (data, status, headers, config) {
            console.log(data)
            if (data.result == "yes") {
                    $scope.mentordetails = data.resultData[0];
                    $scope.permission=data.resultData[0].editable;
                    console.log(data.resultData[0].editable+"00000000000000000000000");

            } else
            {
                $scope.failureMessage = data.resultData[0].message;
                toastr.error($scope.failureMessage)

            }
        }).
        error(function (data, status, headers, config) {
            $rootScope.myApp.hidePleaseWait()
            console.log("error");

        });

       /* var mentordetailReq={
            "requestMessage": "updateuserprofiledetails",
            "requestId": "106",
            "apiKey": "",
            "requestData": [
                {
                    "user_id": userData.userId,
                    "email": userData.email,
                    "session_id": userData.sessionId,
                    "role": userData.role,
                    "field_key": key,
                    "field_value": data
                }
            ]
        }
        console.log(JSON.stringify(mentordetailReq))
        console.log(urls.apiUrl+'users/updateProfileDetail')
            console.log(urls.apiUrl+'users/updateProfileDetail')
            $http.post(urls.apiUrl+'users/updateProfileDetail',mentordetailReq).success(function (data, status, headers, config) {
                console.log(data)
                if (data.result == "yes") {
                    $scope.mentordetails = data.resultData[0];
                } else
                {
                    $scope.failureMessage = data.resultData[0].message;
                    toastr.error($scope.failureMessage)

                }
            }).
            error(function (data, status, headers, config) {
                $rootScope.myApp.hidePleaseWait()
                console.log("error");

            });*/


        $scope.mentorsaveDetail=function (data,key) {
            globalFunc.subLoader('yes');
            console.log(data+"==="+key);
            var url="";
                url='users/updateProfileDetail';
                var mentordetailReq={
                    "requestMessage": "updateuserprofiledetails",
                    "requestId": "134",
                    "apiKey": "",
                    "requestCategory": "crud_startup",
                    "requestData": [
                        {
                            "user_id": userData.userId,
                            "email": userData.email,
                            "session_id": userData.sessionId,
                            "role": userData.role,
                            "field_key": key,
                            "field_value": data
                        }
                    ]
                }
            console.log(JSON.stringify(mentordetailReq))
            console.log(url)
            return globalFunc.updateFields(mentordetailReq,url)
                .then(function (data, status, headers, config) {
                    console.log("keyvalue",key)
                    console.log("mentoredata",data);
                    globalFunc.subLoader('no');
                    return data;
                },function (err) {
                    globalFunc.subLoader('no');
                    console.log("------------");
                    return data;

                });
        }


    })


.filter('timeline', function() {
        return function(input) {
            var output=0;
            if(input<=100){
                output=((33*input)/90);
            }
            else if(input>100 && input<=1000){
                output=((33*input)/900)+33.33;

            }else if(input>1000){
                output=((33*input)/9000)+66.66;
            }
            return parseFloat(output).toFixed(2);
        }

    })
     .filter('truncate', function () {
        return function (text, length, end) {

            if (isNaN(length))
                length = 75;

            if (end === undefined)
                end = "...";

            if (text == undefined)
                return "";
            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length - end.length) + end;
            }

        };
    })



/*
 .controller('videoCtrl',function ($scope) {
 console.log("video ctrl")
 //  console.log($scope.videoData)

 })
 */
