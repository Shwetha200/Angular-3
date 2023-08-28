// app.js
angular.module('NarrowItDownApp', [])

.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowCtrl = this;
  narrowCtrl.searchTerm = '';
  narrowCtrl.foundItems = [];

  narrowCtrl.narrowItDown = function() {
    if (narrowCtrl.searchTerm.trim() === '') {
      narrowCtrl.foundItems = [];
      return;
    }

    MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
      .then(function(foundItems) {
        narrowCtrl.foundItems = foundItems;
      });
  };

  narrowCtrl.removeItem = function(index) {
    narrowCtrl.foundItems.splice(index, 1);
  };
}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
  var service = this;

  service.getMatchedMenuItems = function(searchTerm) {
    return $http({
      method: 'GET',
      url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
    }).then(function(response) {
      var foundItems = [];

      var menuItems = response.data;
      for (var key in menuItems) {
        var menuItem = menuItems[key];
        if (menuItem.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          foundItems.push(menuItem);
        }
      }

      return foundItems;
    });
  };
}

function FoundItemsDirective() {
  var ddo = {
    restrict: 'E',
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'foundCtrl',
    bindToController: true
  };

  return ddo;
}

function FoundItemsDirectiveController() {
  var foundCtrl = this;
}
