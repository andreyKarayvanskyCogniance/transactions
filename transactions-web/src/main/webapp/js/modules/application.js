(function(){
    var app = angular.module('app', ['accounts']);
    app.controller('AppController', ['$scope', 'accountService', function($scope, accountService){
        $scope.isFirstPage = false;
        $scope.isLastPage = false;
        $scope.loadAccounts = function(){
            accountService.list().success(accountsListLoadHandler).error(accountsListErrorHandler);
        };
        this.nextPage = function(){
            accountService.nextPage().success(accountsListLoadHandler).error(accountsListErrorHandler);
        };
        this.prevPage = function(){
            accountService.prevPage().success(accountsListLoadHandler).error(accountsListErrorHandler);
        };
        function accountsListLoadHandler(data){
            $scope.accounts = data.content;
            $scope.isFirstPage = accountService.currentPage<=0;
            $scope.isLastPage = accountService.currentPage>=accountService.lastPage;
        }
        function accountsListErrorHandler(data){
            alert('Error: '+data.message);
        }
        $scope.loadAccounts();
    }]);
})();