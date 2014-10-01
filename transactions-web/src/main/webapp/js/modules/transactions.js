(function(){
    var transactions = angular.module('transactions', []);
    transactions.controller('TransactionController', ['$scope', 'transactionService', function($scope, transactionService){
        this.editTransaction = function(){
            $scope.transaction.edit = true;
        };
        this.getDate = function(){
            return getDateOnly($scope.transaction.date);
        }
    }]);
    transactions.controller('NewTransactionController', ['$scope', 'transactionService', function($scope, transactionService){
        $scope.newTransaction = {name:"", code:""};
        this.addNewTransaction = function(accountId){
            transactionService.add(accountId, $scope.newTransaction).success(function(){
                $scope.newTransaction = {name:"", code:""};
                transactionService.list(accountId);
            }).error(function(data){
                alert('Error: '+data.message);
            });
        }
    }]);
    transactions.controller('EditTransactionController', ['$scope', 'transactionService', function($scope, transactionService){
        var currentTransaction = $scope.transaction;
        $scope.editedTransaction = (function(){
            var copy = {};
            for(var param in currentTransaction){
                if(currentTransaction.hasOwnProperty(param)){
                    copy[param] = currentTransaction[param];
                }
            }
            delete copy.edited;
            return copy;
        })();
        this.cancelEdit = function(){
            currentTransaction.edit = false;
        };
        this.saveEdit = function(){
            transactionService.update($scope.editedTransaction).success(function(){
                currentTransaction.edit = false;
                $scope.editedTransaction = {};
                $scope.loadTransactions();
            }).error(function(data){
                alert('Error: '+data.message);
            });
        }
    }]);
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
        this.baseUrl = function (accountId){
            return "account/"+accountId+"/transaction";
        };
        this.list = function (accountId){
            if(this.lastAccountId!=accountId){
                this.currentPage = 0;
                this.lastPage = 0;
                this.lastAccountId = accountId;
            }
            return $http.get(this.baseUrl(accountId)+"?page="+this.currentPage+"&size="+this.perPage).success(listHandler);
        };
        this.has = function (accountId){
            return $http.get(this.baseUrl(accountId)+"?page=0&size=1").success(listHandler);
        };
        this.nextPage = function(accountId){
            this.currentPage = Math.min(this.lastPage, this.currentPage+1);
            return this.list(accountId);
        };
        this.prevPage = function(accountId){
            this.currentPage = Math.max(0, this.currentPage-1);
            return this.list(accountId);
        };
        this.add = function(accountId, data){
            return $http.post(this.baseUrl(accountId), data);
        };
        this.update = function(accountId, data){
            return $http.put(this.baseUrl(accountId)+"/"+data.id, data);
        };
    }]);
    transactions.directive('transactionadd', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/transaction-create.html"
        };
    });
    transactions.directive('transactionview', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/transaction-view.html"
        };
    });
    transactions.directive('transactionedit', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/transaction-edit.html"
        };
    });
    function getDateOnly(timestamp){
        return new Date(timestamp).toISOString().substr(0, 10);
    }
})();