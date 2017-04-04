angular.module('lensnmirrorApp.services', [])

.service('urls', function (BASE_API_URL, BASE_URL_HREF) {
        this.apiUrl = BASE_API_URL;
        this.href = BASE_URL_HREF;
        this.imageUrl = 'http://www.lensnmirror.com/demo/image_uploads/';

    })


    .factory('globalFunc',function ($http,urls,$q) {
        return{
            mainLoader:function (display) {
                var mainLoader = $('#pleaseWaitDiv');
                if(display=='yes')
                    mainLoader.show();
                else
                    mainLoader.hide();
            },
            subLoader:function (display) {
                var loadingSub = $('#loadingSub');
                if(display=='yes')
                    loadingSub.show();
                else
                    loadingSub.hide();
            },
            updateFields:function (request,apiPath) {
                var defer = $q.defer();
                $http.post(urls.apiUrl + apiPath, request)
                    .success(function (data, status, headers, config) {
                        console.log("ENTERING INTO ");
                        console.log(data);
                        if (data.result == "yes") {
                            console.log("YES YES YES YES")
                            defer.resolve(data)
                        } else {
                            defer.resolve(false)
                        }
                    }).error(function (data, status, headers, config) {
                    defer.resolve(false)
                })
                return defer.promise;
            },
            updateFields:function (mentordetailReq,apiPath) {
                var defer = $q.defer();
                $http.post(urls.apiUrl + apiPath, mentordetailReq)
                    .success(function (data, status, headers, config) {
                        console.log("ENTERING INTO ");
                        console.log(data);
                        if (data.result == "yes") {
                            console.log("YES YES YES YES")
                            defer.resolve(data)
                        } else {
                            defer.resolve(false)
                        }
                    }).error(function (data, status, headers, config) {
                    defer.resolve(false)
                })
                return defer.promise;
            }
        }
    })
// TO GET USER RELATED DATA

.factory('userDetail',function ($localStorage) {
    return{
        // JUST CALL getData() to get full data of user
        // to get specific data pass the dataField name to function
        getData:function (type) {
            var details=$localStorage.userDetail;
            if(details==undefined)
                details=false;
            else{
                if(type==undefined)
                    details=details;
                else{
                    console.log(type)
                    details=details[type];
                }
            }
            return details;
        },
        unsetData:function () {
            $localStorage.userDetail="";
        },
        setData:function (type,value) {
            if(type!=undefined){
                $localStorage.userDetail[type]=value;
                console.log("TYPE ",type)
                console.log($localStorage.userDetail[type])
            }
        }
    }
})

.factory('userAuth',function ($localStorage) {
    return{
        checkLogin:function () {
            var result = false;
            var userDetail = $localStorage.userDetail;
            if (userDetail != undefined) {
            if (userDetail.userId != null || userDetail.userId != undefined) {
                if (userDetail.userId != 0) {
                    if (userDetail.userId != "") {
                        result = true;
                    }
                }
            }
        }
            return result;
        }
    }
})

   