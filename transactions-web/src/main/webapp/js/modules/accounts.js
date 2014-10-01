(function(){
    /**
     * Module to work with accounts
     */
    var accounts = angular.module('accounts', ['transactions']);
    /**
     * View account controller
     */
    accounts.controller('AccountController', ['$scope', '$rootScope', 'accountService', 'transactionService', function($scope, $rootScope, accountService, transactionService){
        $scope.expanded = false;
        $scope.isRemovable = false;
        $scope.isFirstTransactionsPage = false;
        $scope.isLastTransactionsPage = false;
        /**
         * Public method to make account editable
         */
        this.editAccount = function(){
            $scope.account.edit = true;
        };
        /**
         * Delete current account
         */
        this.deleteAccount = function(){
            accountService.remove($scope.account.id).success(function(){
                $scope.loadAccounts();
            }).error(transactionsListErrorHandler);
        };
        /**
         * Expand or collapse view, displaying or hiding transactions
         */
        this.switchState = function(){
            $scope.expanded = !$scope.expanded;
            if($scope.expanded){
                $rootScope.currentlyExpandedAccountView = $scope.account.id;
                $scope.loadTransactions();
            }
        };
        /**
         * Shared method to reload accounts list
         */
        $scope.loadTransactions = this.loadTransactions = function(){
            transactionService.list($scope.account.id).success(transactionsListLoadedHandler).error(transactionsListErrorHandler);
        };
        /**
         * Go to next page
         */
        this.nextPage = function(){
            transactionService.nextPage($scope.account.id).success(transactionsListLoadedHandler).error(transactionsListErrorHandler);
        };
        /**
         * Go to previous page
         */
        this.prevPage = function(){
            transactionService.prevPage($scope.account.id).success(transactionsListLoadedHandler).error(transactionsListErrorHandler);
        };
        /**
         * Handler for success case of loading list of accounts
         * @param {content: Array.<Object>} data
         */
        function transactionsListLoadedHandler(data){
            $scope.transactions = data.content;
            $scope.isFirstTransactionsPage = transactionService.currentPage<=0;
            $scope.isLastTransactionsPage = transactionService.currentPage>=transactionService.lastPage;
        }
        /**
         * Shared error handler
         * @param {{mesage:string}} data
         */
        function transactionsListErrorHandler(data){
            alert('Error: '+data.message);
        }
        /**
         * Init accounts list
         */
        transactionService.has($scope.account.id).success(function(data){
            $scope.isRemovable = !(data && data.content && data.content.length);
        }).error(transactionsListErrorHandler);
    }]);
    /**
     * Create new account controller
     */
    accounts.controller('NewAccountController', ['$scope', 'accountService', function($scope, accountService){
        $scope.newAccount = emptyAccount();
        this.addNewAccount = function(){
            accountService.add($scope.newAccount).success(function(){
                $scope.newAccount = emptyAccount();
                $scope.loadAccounts();
            }).error(function(data){
                alert('Error: '+data.message);
            });
        }
        function emptyAccount(){
            return {name:"", code:""};
        }
    }]);
    /**
     * Edit existent account controller
     */
    accounts.controller('EditAccountController', ['$scope', 'accountService', function($scope, accountService){
        var currentAccount = $scope.account;
        $scope.editedAccount = (function(){
            var copy = {};
            for(var param in currentAccount){
                if(currentAccount.hasOwnProperty(param)){
                    copy[param] = currentAccount[param];
                }
            }
            return copy;
        })();
        /**
         * Revert view to normal for current account
         */
        this.cancelEdit = function(){
            currentAccount.edit = false;
        };
        /**
         * Save account changes and
         */
        this.saveEdit = function(){
            delete $scope.editedAccount.edit;
            accountService.update($scope.editedAccount).success(function(){
                currentAccount.edit = false;
                $scope.editedAccount = {};
                $scope.loadAccounts();
            }).error(function(data){
                alert('Error: '+data.message);
            });
        }
    }]);
    /**
     * Accounts API service
     */
    accounts.service("accountService", ["$http", function($http){
        this.perPage = 20;
        this.currentPage = 0;
        this.lastPage = 0;
        var url = "account";
        var listHandler = (function(data, status){
            this.currentPage = data.number;
            this.lastPage = data.totalPages-1;
            this.perPage = data.size;
        }).bind(this);
        /**
         * Retrieve list of accounts
         * @returns {{success: function, error: function}}
         */
        this.list = function (){
            return $http.get(url+"?page="+this.currentPage+"&size="+this.perPage+"&sort=code").success(listHandler);
        };
        /**
         * Go to next page and retrieve list of accounts
         * @returns {{success: function, error: function}} Methods from returning promise required to catch loading events
         */
        this.nextPage = function(){
            this.currentPage = Math.min(this.lastPage, this.currentPage+1);
            return this.list();
        };
        /**
         * Go to previous page and retrieve list of accounts
         * @returns {{success: function, error: function}}
         */
        this.prevPage = function(){
            this.currentPage = Math.max(0, this.currentPage-1);
            return this.list();
        };
        /**
         * Retrieve information about account
         * @param {string} id Account id
         * @returns {{success: function, error: function}}
         */
        this.get = function(id){
            return $http.get(url+"/"+id);
        };
        /**
         * Create new account
         * @param {Object} data
         * @returns {{success: function, error: function}}
         */
        this.add = function(data){
            return $http.post(url, data);
        };
        /**
         * Update account
         * @param {Object} data
         * @returns {{success: function, error: function}}
         */
        this.update = function(data){
            return $http.put(url+"/"+data.id, data);
        };
        /**
         * Remove account
         * @param {Object} id
         * @returns {{success: function, error: function}}
         */
        this.remove = function(id){
            return $http.delete(url+"/"+id);
        };
    }]);
    /**
     * Template for adding new account form
     */
    accounts.directive('accountadd', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/account-create.html"
        };
    });
    /**
     * Template for default account view, includes root for account transactions view
     */
    accounts.directive('accountview', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/account-view.html"
        };
    });
    /**
     * Template for "edit account" view
     */
    accounts.directive('accountedit', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/account-edit.html"
        };
    });
})();