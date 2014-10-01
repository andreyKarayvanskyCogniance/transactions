var app = angular.module('transactionsApp', []);

app.controller('AccountListCtrl', function ($scope, $http) {

  $http.get('account').success(function(data) {
    $scope.accounts = data;
    
    $scope.curPage = 0;
 	  $scope.pageSize = 7;
   	$scope.numberOfPages = function() {
  		return Math.ceil($scope.accounts.length / $scope.pageSize);
  	};

  });
  
  $scope.trMap = new Object();
  
  $scope.fetchTransactions = function(accountId) {
    $http.get('account/' + accountId + '/transaction').success(function(data) {
      
      $scope.trMap[accountId] = data;
    });
  };

  $scope.editorEnabled = false;

  $scope.enableEditor = function() {
    $scope.editorEnabled = true;
    $scope.editableTitle = $scope.accounts.account.name;
  };

  $scope.disableEditor = function() {
    $scope.editorEnabled = false;
  };

  $scope.save = function() {
    $scope.accounts.account.name = $scope.editableTitle;
    $scope.disableEditor();
    //$http.post('/account', item);
  };

});

angular.module('transactionsApp').filter('pagination', function() {
	return function(input, start) {
		if (!input || !input.length) { return; }
		start = +start;
		return input.slice(start);
	};
});