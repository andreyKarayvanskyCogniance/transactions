(function(){
    /**
     * Main application module
     */
    var app = angular.module('app', ['accounts']);
    /**
     * Main controller loads list of accounts
     */
    app.controller('AppController', ['$scope', 'accountService', function($scope, accountService){
        /**
         * Defines visibility of "Got to previous page" button
         * @type {boolean}
         */
        $scope.isFirstPage = false;
        /**
         * Defines visibility of "Got to next page" button
         * @type {boolean}
         */
        $scope.isLastPage = false;
        /**
         * Public method to reload list of accounts
          */
        $scope.loadAccounts = function(){
            accountService.list().success(accountsListLoadHandler).error(accountsListErrorHandler);
        };
        /**
         * Go to next page
         */
        this.nextPage = function(){
            accountService.nextPage().success(accountsListLoadHandler).error(accountsListErrorHandler);
        };
        /**
         * Go to previous page
         */
        this.prevPage = function(){
            accountService.prevPage().success(accountsListLoadHandler).error(accountsListErrorHandler);
        };
        /**
         * Success handler for loading list of Accounts
         * @param {{content: Array<Object>}} data
         */
        function accountsListLoadHandler(data){
            $scope.accounts = data.content;
            $scope.isFirstPage = accountService.currentPage<=0;
            $scope.isLastPage = accountService.currentPage>=accountService.lastPage;
        }
        /**
         * Error handler
         * @param {{message: string}} data
         */
        function accountsListErrorHandler(data){
            alert('Error: '+data.message);
        }

        /**
         * Init list of accounts
         */
        $scope.loadAccounts();
    }]);
})();