(function(){
    var app = angular.module('app', ['accounts']);
    app.controller('AppController', ['$scope', 'accountService', function($scope, accountService){
        $scope.isFirstPage = false;
        $scope.isLastPage = false;
        accountService.list().success((function(data){
            /*
            $scope.accounts = [
                {"id":1,"version":0,"name":"The Very First Demo Account","code":"demo1"},
                {"id":2,"version":0,"name":"The Very Second Demo Account","code":"demo2"},
                {"id":3,"version":0,"edit":true,"name":"The Very Third Demo Account","code":"demo3"},
                {"id":4,"version":0,"name":"The Very Fourth Demo Account","code":"demo4"},
                {"id":5,"version":0,"name":"The Very Fifth Demo Account","code":"demo5"},
                {"id":6,"version":0,"name":"The Very Sixth Demo Account","code":"demo6"}
            ];
            */
            $scope.accounts = data.content;
            $scope.isFirstPage = accountService.currentPage<=0;
            $scope.isLastPage = accountService.currentPage>=accountService.lastPage;
        }).bind(this));
        this.nextPage = function(){
            accountService.nextPage();
        };
        this.prevPage = function(){
            accountService.prevPage();
        };
    }]);
})();