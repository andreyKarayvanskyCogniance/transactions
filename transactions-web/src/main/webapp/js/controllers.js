var app = angular.module('transactionsApp', ['xeditable']);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

app.controller('AccountListCtrl', function ($scope, $http) {

  $http.get('account').success(function(data) {
    $scope.accounts = data;

    $scope.curPage = 0;
    $scope.pageSize = 20;
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


  $scope.saveAccount = function(data, id, version) {
        data['version'] = version;
        if (id) {
            return $http.put('/account/' + id, data);
        } else {
            return $http.post('/account', data);
        }
  };
  
//add account
  $scope.addAccount = function() {
    $scope.inserted = {
      id: null,
      name: '',
      code: ''
    };
    $scope.users.push($scope.inserted);
  };
});

angular.module('transactionsApp').filter('pagination', function() {
	return function(input, start) {
		if (!input || !input.length) { return; }
		start = +start;
		return input.slice(start);
	};
});