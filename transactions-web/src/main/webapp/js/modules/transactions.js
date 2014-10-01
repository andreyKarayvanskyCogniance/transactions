(function(){
    /**
     * Transactions module
     */
    var transactions = angular.module('transactions', []);
    /**
     * Controller for basic transaction view
     */
    transactions.controller('TransactionController', ['$scope', 'transactionService', function($scope, transactionService){
        /**
         * Set transaction object to be editable
         */
        this.editTransaction = function(){
            $scope.transaction.edit = true;
        };
        /**
         * Return transaction date string
         * @returns {string}
         */
        this.getDate = function(){
            return getDateOnly($scope.transaction.date);
        }
    }]);
    /**
     * Controller for creating new transaction
     */
    transactions.controller('NewTransactionController', ['$scope', 'transactionService', function($scope, transactionService){
        $scope.newTransaction = emptyTransaction();
		$scope.transactionTypes = getTransactionTypeList();
        this.addNewTransaction = function(accountId){
            transactionService.add(accountId, $scope.newTransaction).success(function(){
                $scope.newTransaction = emptyTransaction();
                $scope.loadTransactions();
            }).error(function(data){
                alert('Error: '+data.message);
            });
        };
        function emptyTransaction(){
            return {description:"", amount:1, date:new Date()};
        }
        //apply binding to newTransaction object
        //$scope.$apply();
    }]);
    /**
     * Controller for editing transaction
     */
    transactions.controller('EditTransactionController', ['$scope', 'transactionService', function($scope, transactionService){
        var currentTransaction = $scope.transaction;
        console.log(currentTransaction);
        $scope.editedTransaction = (function(){
            var copy = {};
            for(var param in currentTransaction){
                if(currentTransaction.hasOwnProperty(param)){
                    copy[param] = currentTransaction[param];
                }
            }
            delete copy.edited;
            copy.date = new Date(currentTransaction.date);
            return copy;
        })();
        /**
         * Revert changes made to transaction
         */
        this.cancelEdit = function(){
            currentTransaction.edit = false;
        };
        /**
         * Save updated transaction and reload transactions list
         */
        this.saveEdit = function(){
            delete $scope.editedTransaction.edit;
            transactionService.update($scope.account.id, $scope.editedTransaction).success(function(){
                currentTransaction.edit = false;
                $scope.editedTransaction = {};
                $scope.loadTransactions();
            }).error(function(data){
                alert('Error: '+data.message);
            });
        }
    }]);
    /**
     * Service to work with transactions
     */
    transactions.service("transactionService", ["$http", function($http){
        this.lastAccountId = 0;
        this.perPage = 20;
        this.currentPage = 0;
        this.lastPage = 0;
        var listHandler = (function(data, status){
            this.currentPage = data.number;
            this.lastPage = data.totalPages-1;
            this.perPage = data.size;
        }).bind(this);
        /**
         * Base URL for account
         * @param {(number|string)} accountId
         * @returns {string}
         */
        this.baseUrl = function (accountId){
            return "account/"+accountId+"/transaction";
        };
        /**
         * Retrieve list of transactions for account
         * @param {(number|string)} accountId
         * @returns {{success: function, error: function}}
         */
        this.list = function (accountId){
            if(this.lastAccountId!=accountId){
                this.currentPage = 0;
                this.lastPage = 0;
                this.lastAccountId = accountId;
            }
            return $http.get(this.baseUrl(accountId)+"?page="+this.currentPage+"&size="+this.perPage).success(listHandler);
        };
        /**
         * Retrieve first transaction to find out if account has transactions
         * @param {(number|string)} accountId
         * @returns {{success: function, error: function}}
         */
        this.has = function (accountId){
            return $http.get(this.baseUrl(accountId)+"?page=0&size=1");
        };
        /**
         * Load next page for specific account
         * @param {(number|string)} accountId
         * @returns {{success: function, error: function}}
         */
        this.nextPage = function(accountId){
            this.currentPage = Math.min(this.lastPage, this.currentPage+1);
            return this.list(accountId);
        };
        /**
         * Load previous page for specific account
         * @param {(number|string)} accountId
         * @returns {{success: function, error: function}}
         */
        this.prevPage = function(accountId){
            this.currentPage = Math.max(0, this.currentPage-1);
            return this.list(accountId);
        };
        /**
         * Add new transaction for account
         * @param {(number|string)} accountId
         * @param {Object} data
         * @returns {{success: function, error: function}}
         */
        this.add = function(accountId, data){
            return $http.post(this.baseUrl(accountId), data);
        };
        /**
         * Update transaction
         * @param {(number|string)} accountId
         * @param {Object} data
         * @returns {{success: function, error: function}}
         */
        this.update = function(accountId, data){
            return $http.put(this.baseUrl(accountId)+"/"+data.id, data);
        };
    }]);
    /**
     * Template for "create transaction" form
     */
    transactions.directive('transactionadd', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/transaction-create.html"
        };
    });
    /**
     * Default template for transaction view
     */
    transactions.directive('transactionview', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/transaction-view.html"
        };
    });
    /**
     * Template for "edit transaction" view
     */
    transactions.directive('transactionedit', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/transaction-edit.html"
        };
    });
    /**
     * Format Date object to string YYYY-MM-DD
     * @param {(number|string)} timestamp
     * @returns {string}
     */
    function getDateOnly(timestamp){
        return new Date(timestamp).toISOString().substr(0, 10);
    }
    function getTransactionTypeList(){
        return ['DEBIT', 'CREDIT'];
    }
})();