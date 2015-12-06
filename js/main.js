window.addEventListener('load', function () {
    FastClick.attach(document.body);
}, false);

var dndApp = angular.module('dndApp', ['ngTagsInput', 'ui.bootstrap']);

dndApp.controller('tableController', ['$scope', '$modal', function ($scope, $modal) {
    $scope.enemies = [];
    $scope.round = 1;
    $scope.enemyTypes = [];

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
                enemy.setLp(enemy.lp - 1);
                enemy.setAp(enemy.ap - 1);
            }
        },
        {
            text: 'feuer',
            roundCallBack: function (enemy) {
                var tag = $scope.getTag(enemy, 'feuer');
                if (tag.timeout == undefined) {
                    tag.timeout = 1;
                }
                if (tag.timeout == 3) {
                    $scope.removeTag(enemy, 'feuer')
                }
                tag.timeout++;
                enemy.setLp(enemy.lp - 2);
            }
        },
        {
            text: 'betäubt',
            roundCallBack: function (enemy) {
                var tag = $scope.getTag(enemy, 'betäubt');
                if (tag.timeout == undefined) {
                    tag.timeout = 1;
                }
                if (tag.timeout == 2) {
                    $scope.removeTag(enemy, 'betäubt')
                }
                tag.timeout++;
            }
        }
    ];

    $scope.addEnemy = function (name) {
        for (var i = 0; i < $scope.enemyTypes.length; i++) {
            if ($scope.enemyTypes[i].name == name) {
                $scope.enemies.push(
                    angular.copy($scope.enemyTypes[i])
                );
            }
        }
    };

    $scope.instaKill = function (enemy) {
        enemy.setLp(0);
        enemy.setAp(0);
    };

    $scope.reset = function (enemy) {
        $scope.enemyTypes = [];
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
        }
    };

    $scope.openSettings = function () {
        var modalInstance = $modal.open({
            templateUrl: 'settings.html',
            controller: 'SettingsController',
            resolve: {
                enemyTypes: function () {
                    return $scope.enemyTypes;
                }
            }

        });
        modalInstance.result.then(function (enemyTypes) {
            $scope.enemyTypes = enemyTypes;
        }, function () {
        });
    };
    $scope.openSettings();

    $scope.toggleTag = function (enemy, tag) {
        for (var i = 0; i < enemy.tags.length; i++) {
            if (enemy.tags[i].text == tag) {
                enemy.tags.splice(i, 1);
                return;
            }
        }
        enemy.addTag(tag);
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

dndApp.controller('SettingsController', ['$scope', '$modalInstance', 'enemyTypes', function ($scope, $modalInstance, enemyTypes) {

    $scope.enemyTypes = [
        new Enemy("Spinne", 9, 10, []),
        new Enemy("Sarazene", 15, 10, []),
        new Enemy("Ork", 15, 20, []),
        new Enemy("Goblin", 10, 10, []),
        new Enemy("Untoter", 25, 0, []),
        new Enemy("Kämpf", 40, 40, []),
        new Enemy("Dreyan", 30, 30, []),
        new Enemy("Riesenspinne", 60, 40, []),
        new Enemy("Drache", 100, 100, []),
        new Enemy("Krieger des Grafen", 15, 10, []),
        new Enemy("Golem", 30, 0, []),
        new Enemy("Troll", 30, 20, [])
    ];

    $scope.activeEnemies = enemyTypes;

    $scope.toggle = function (enemy) {
        if ($scope.isActive(enemy)) {
            $scope.remove(enemy);
        }
        else {
            $scope.activeEnemies.push(enemy);
        }
    };

    $scope.isActive = function (enemy) {
        var l = $scope.activeEnemies.length;
        for (var i = 0; i < l; i++) {
            if ($scope.activeEnemies[i].hasOwnProperty('name') && $scope.activeEnemies[i].name == enemy.name) {
                return true;
            }
        }
        return false;
    };

    $scope.remove = function (enemy) {
        var l = $scope.activeEnemies.length;
        for (var i = 0; i < l; i++) {
            if ($scope.activeEnemies[i].hasOwnProperty('name') && $scope.activeEnemies[i].name == enemy.name) {
                $scope.activeEnemies.splice(i, 1);
            }
        }
    };

    $scope.ok = function () {
        $modalInstance.close($scope.activeEnemies);
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
    this.lp = Math.max(lp, 0);
};

Enemy.prototype.setAp = function (ap) {
    this.ap = Math.max(ap, 0);
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

Enemy.prototype.createNewEnemy = function () {
    return new Enemy(this.name, this.lp, this.ap, this.tags);
};
