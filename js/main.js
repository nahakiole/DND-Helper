var dndApp = angular.module('dndApp', ['ngTagsInput', 'ui.bootstrap']);

dndApp.controller('tableController',[ '$scope','$modal', function ($scope,$modal) {
    $scope.enemies = [];
    $scope.enemyTypes = [
        {
            name: 'Spinne',
            lp: 9,
            ap: 10,
            tags: []
        },
        {
            name: 'Ork',
            lp: 15,
            ap: 25,
            tags: []
        },
        {
            name: 'Troll',
            lp: 15,
            ap: 25,
            tags: []
        }
    ];

    $scope.tags = [
        'vergiftet',
        'feuer',
        'betäubt'
    ];

    $scope.addEnemy = function (name) {
        $scope.enemies.push(JSON.parse(JSON.stringify($.grep($scope.enemyTypes, function (e) {
            return e.name == name;
        })[0])));
    };

    $scope.instaKill = function (enemy) {
        $scope.enemies.splice(enemy, 1);
    };

    $scope.openSettings = function () {
        var modalInstance = $modal.open({
            templateUrl: 'settings.html',
            controller: 'ModalInstanceCtrl'
        });
    };

    $scope.toggleTag = function(enemy, tag){
        for (var i = 0; i <  enemy.tags.length; i++){
            if (enemy.tags[i].text == tag){
                enemy.tags.splice(i, 1);
                return;
            }
        }
        enemy.tags.push({'text': tag});
    };

    $scope.hasTag = function(enemy, tag){
        for (var i = 0; i <  enemy.tags.length; i++){
            if (enemy.tags[i].text == tag){
                return true;
            }
        }
        return false;
    };

    $scope.getTags = function (name) {
        var regexp = new RegExp(name, "gi");
        return $scope.tags.filter(
            function (tag) {
                return tag.match(regexp);
            }
        ).sort(function (a, b) {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            });
    }

}] );

dndApp.controller('ModalInstanceCtrl', [ '$scope', '$modalInstance', function ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

function Enemy(name,lp,ap,tags){
    this.name = name;
    this.lp = lp;
    this.ap = ap;
    this.tags = tags;
}

Enemy.prototype.setLp = function(lp){
    this.lp = lp;
};

Enemy.prototype.setAp = function(ap){
    this.ap = ap;
};

Enemy.prototype.setAp = function(ap){
    this.ap = ap;
};
