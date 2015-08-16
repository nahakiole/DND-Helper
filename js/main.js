var dndApp = angular.module('dndApp', ['ngTagsInput']);

dndApp.controller('tableController', function ($scope) {
  $scope.enemies = [];
  $scope.enemyTypes = [
    {
      name: 'Spinne',
      lp: 9,
      ap: 10,
      tags: ''
    },
    {
      name: 'Ork',
      lp: 15,
      ap: 25,
      tags: ''
    }
  ];

  $scope.addEnemy = function(name){
      $scope.enemies.push( JSON.parse(JSON.stringify(   $.grep($scope.enemyTypes, function(e){ return e.name == name; })[0])) );
  };

  $scope.instaKill = function(enemy){
    $scope.enemies.splice(enemy,1);
  }

});
