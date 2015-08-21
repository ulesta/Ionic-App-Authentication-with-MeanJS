angular.module('starter.controllers', [])

  .controller('LoginCtrl', function($scope, localStorageService, $http, $state) {
    $scope.login = function (method) {
      // Opens new InApp Browser which points to Facebook auth route on our MeanJS server
      var window = cordova.InAppBrowser.open('http://localhost:3000/auth/facebook', '_blank', "location=yes");
      // Add event listener on every load (i.e. refresh), redirect is an example event
      window.addEventListener('loadstart', function(event) {

        //console.log('URL: ' + event.url);
        var foundToken = event.url.indexOf('token=');
        var foundId = event.url.indexOf('userId=');

        if ( foundToken > -1 && foundId > -1 ) {
          console.log('Url before closing: ' + event.url);

          // Look for the query string
          var indexQueryBegin = event.url.indexOf('?');
          var query = event.url.substring(indexQueryBegin+1);
          // Split the query string into key-value pairs
          var querySplitPairs = query.split('&');
          var queryObj = {};
          for (var i = 0; i < querySplitPairs.length; i++) {
            var keyValuePair = querySplitPairs[i].split('=');
            queryObj[keyValuePair[0]] = keyValuePair[1];
          }

          //console.log('Query Obj userId: ');
          //console.log(queryObj.userId);
          //console.log('Query Obj token: ');
          //console.log(queryObj.token);

          // Stash the token and userId in our localStorageService
          localStorageService.set('token', queryObj.token);
          localStorageService.set('userId', queryObj.userId);

          $state.go('tab.dash');

          window.close();
        }
      })
    }
  })

  .controller('DashCtrl', function ($scope, localStorageService, $state) {
    if (!localStorageService.get('token')) {
      $state.go('login');
    }
  })

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
