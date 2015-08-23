var dndApp = angular.module('dndApp', ['ngTagsInput', 'ui.bootstrap']);

dndApp.controller('tableController', ['$scope', '$modal', function ($scope, $modal) {
    $scope.enemies = [];
    $scope.round = 1;
    $scope.enemyTypes = [
        new Enemy("Spinne", 9, 10, []),
        new Enemy("Ork", 15, 25, []),
        new Enemy("Troll", 15, 25, [])
    ];

    $scope.tags = [
        {
            text: 'vergiftet',
            roundCallBack: function (enemy) {
                var tag = $scope.getTag(enemy, 'vergiftet');
                if (tag.timeout == undefined) {
                    tag.timeout = 1;
                }
                if (tag.timeout == 3) {
                    $scope.removeTag(enemy, 'vergiftet')
                }
                tag.timeout++;
                enemy.setLp(enemy.lp - 2);
                enemy.setAp(enemy.ap - 1);
            }
        },
        {
            text: 'feuer'
        },
        {
            text: 'betäubt'
        }
    ];

    $scope.addEnemy = function (name) {
        for (var i = 0; i < $scope.enemyTypes.length; i++) {
            if ($scope.enemyTypes[i].name == name) {
                $scope.enemies.push(
                    $scope.enemyTypes[i].clone()
                );
            }
        }
    };

    $scope.instaKill = function (enemy) {
        $scope.enemies.splice(enemy, 1);
    };

    $scope.reset = function (enemy) {
        $scope.enemies = [];
        $scope.round = 1;
    };

    $scope.nextRound = function () {
        $scope.round++;
        for (var i = 0; i < $scope.enemies.length; i++) {
            for (var j = 0; j < $scope.tags.length; j++) {
                if ($scope.hasTag($scope.enemies[i], $scope.tags[j].text)) {
                    if ($scope.tags[j].hasOwnProperty('roundCallBack')) {
                        $scope.tags[j].roundCallBack($scope.enemies[i]);
                    }
                }
            }
            if ($scope.enemies[i].isDead()) {
                $scope.enemies.splice(i, 1);
            }
        }
    };

    $scope.openSettings = function () {
        var modalInstance = $modal.open({
            templateUrl: 'settings.html',
            controller: 'ModalInstanceCtrl'
        });
    };

    $scope.toggleTag = function (enemy, tag) {
        for (var i = 0; i < enemy.tags.length; i++) {
            if (enemy.tags[i].text == tag) {
                enemy.tags.splice(i, 1);
                return;
            }
        }
        enemy.tags.push({'text': tag});
    };

    $scope.removeTag = function (enemy, tag) {
        for (var i = 0; i < enemy.tags.length; i++) {
            if (enemy.tags[i].text == tag) {
                enemy.tags.splice(i, 1);
                return;
            }
        }
    };

    $scope.hasTag = function (enemy, tag) {
        for (var i = 0; i < enemy.tags.length; i++) {
            if (enemy.tags[i].text == tag) {
                return true;
            }
        }
        return false;
    };

    $scope.getTag = function (enemy, tag) {
        for (var i = 0; i < enemy.tags.length; i++) {
            if (enemy.tags[i].text == tag) {
                return enemy.tags[i];
            }
        }
        return false;
    };

    $scope.addTag = function (enemy, tag) {
        for (var i = 0; i < enemy.tags.length; i++) {
            if (enemy.tags[i].text == tag) {
                return;
            }
        }
        enemy.tags.push({text: tag});
    };


    $scope.getTags = function (name) {
        var regexp = new RegExp(name, "gi");
        return $scope.tags.filter(
            function (tag) {
                return tag.text.match(regexp);
            }
        ).sort(function (a, b) {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            });
    }

}]);

dndApp.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

function Enemy(name, lp, ap, tags) {
    this.name = name;
    this.lp = lp;
    this.ap = ap;
    this.tags = tags;
}

Enemy.prototype.setLp = function (lp) {
    console.log(this);
    if (this.isDead()) {
        $scope.enemies.splice(i, 1);
    }
    this.lp = lp;
};

Enemy.prototype.setAp = function (ap) {
    this.ap = Math.max(ap, 0);
    if (this.ap == 0){
        this.addTag('betäubt')
    }
};


Enemy.prototype.isDead = function () {
    return this.lp <= 0;
};

Enemy.prototype.addTag = function (tag) {
    for (var i = 0; i < this.tags.length; i++) {
        if (this.tags[i].text == tag) {
            return;
        }
    }
    this.tags.push({text: tag});
};

Enemy.prototype.clone = function () {
    return new Enemy(this.name, this.lp, this.ap, this.tags);
};