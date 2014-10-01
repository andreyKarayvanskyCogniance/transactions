(function(){
    var accounts = angular.module('accounts', ['transactions']);
    accounts.controller('AccountController', ['$scope', 'accountService', 'transactionService', function($scope, accountService, transactionService){
        $scope.expanded = false;
        $scope.isRemovable = false;
        $scope.isFirstTransactionsPage = false;
        $scope.isLastTransactionsPage = false;
        this.editAccount = function(){
            $scope.account.edit = true;
        };
        this.deleteAccount = function(){
            accountService.remove($scope.account.id).success(function(){
                accountService.list();
            }).error(function(data){
                alert('Error: '+data.message);
            });
        };
        this.switchState = function(){
            $scope.expanded = !$scope.expanded;
            if($scope.expanded){
                this.loadTransactions($scope.account.id);
            }
        };
        this.loadTransactions = function(id){
            transactionService.list($scope.account.id).success((function(data){
                $scope.transactions = data.content;
                /*
                $scope.transactions = [
                    {"id":1,"version":0,"date":1412162779153,"amount":10.00,"type":"DEBIT","description":"A Demo Transaction"},
                    {"id":2,"version":0,"date":1412162779153,"amount":11.00,"type":"DEBIT","description":"A Demo Transaction"},
                    {"id":3,"version":0,"date":1412162779153,"amount":12.00,"type":"CREDIT","description":"A Demo Transaction"},
                    {"id":4,"version":0,"date":1412162779153,"amount":13.00,"type":"DEBIT","description":"A Demo Transaction"},
                    {"id":5,"version":0,"date":1412162779153,"amount":14.00,"type":"CREDIT","description":"A Demo Transaction"},
                    {"id":6,"version":0,"date":1412162779153,"amount":15.00,"type":"DEBIT","description":"A Demo Transaction"},
                    {"id":7,"version":0,"date":1412162779153,"amount":16.00,"type":"DEBIT","description":"A Demo Transaction"}
                ];
                */
                $scope.isFirstTransactionsPage = transactionService.currentPage<=0;
                $scope.isLastTransactionsPage = transactionService.currentPage>=transactionService.lastPage;
            }).bind(this)).error(function(data){
                alert('Error: '+data.message);
            });
        };
        this.nextPage = function(){
            transactionService.nextPage($scope.account.id);
        };
        this.prevPage = function(){
            transactionService.prevPage($scope.account.id);
        };
        transactionService.has($scope.account.id).success(function(data){
            $scope.isRemovable = !(data && data.content && data.content.length);
        }).error(function(data){
            alert('Error: '+data.message);
        });
    }]);
    accounts.controller('NewAccountController', ['$scope', 'accountService', function($scope, accountService){
        $scope.newAccount = {name:"", code:""};
        this.addNewAccount = function(){
            accountService.add($scope.newAccount).success(function(){
                $scope.newAccount = {name:"", code:""};
                accountService.list();
            }).error(function(data){
                alert('Error: '+data.message);
            });
        }
    }]);
    accounts.controller('EditAccountController', ['$scope', 'accountService', function($scope, accountService){
        var currentAccount = $scope.account;
        $scope.editedAccount = (function(){
            var copy = {};
            for(var param in currentAccount){
                if(currentAccount.hasOwnProperty(param)){
                    copy[param] = currentAccount[param];
                }
            }
            delete copy.edited;
            return copy;
        })();
        this.cancelEdit = function(){
            currentAccount.edit = false;
        };
        this.saveEdit = function(){
            accountService.update($scope.editedAccount).success(function(){
                currentAccount.edit = false;
                $scope.editedAccount = {};
                accountService.list();
            }).error(function(data){
                alert('Error: '+data.message);
            });
        }
    }]);
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
        this.list = function (){
            return $http.get(url+"?page="+this.currentPage+"&size="+this.perPage+"&sort=code").success(listHandler);
        };
        this.nextPage = function(){
            this.currentPage = Math.min(this.lastPage, this.currentPage+1);
            return this.list();
        };
        this.prevPage = function(){
            this.currentPage = Math.max(0, this.currentPage-1);
            return this.list();
        };
        this.get = function(id){
            return $http.get(url+"/"+id);
        };
        this.add = function(data){
            return $http.post(url, data);
        };
        this.update = function(data){
            return $http.put(url+"/"+data.id, data);
        };
        this.remove = function(id){
            return $http.delete(url+"/"+id);
        };
    }]);
    accounts.directive('accountadd', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/account-create.html"
        };
    });
    accounts.directive('accountview', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/account-view.html"
        };
    });
    accounts.directive('accountedit', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/account-edit.html"
        };
    });
})();