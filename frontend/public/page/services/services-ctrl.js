angular.module('app')
.controller('ServicesCtrl', function($scope, k8s, arraySvc) {
  'use strict';

  k8s.services.list().then(function(result) {
    $scope.services = result;
  });

  $scope.getPods = function(serviceName) {
    var svc = k8s.util.findByName($scope.services, serviceName);
    if (!svc.spec.selector) {
      return;
    }
    k8s.pods.list({ labels: svc.spec.selector })
      .then(function(pods) {
        svc.pods = pods;
      });
  };

  $scope.$on(k8s.events.RESOURCE_DELETED, function(e, data) {
    if (data.kind === k8s.enum.Kind.SERVICE) {
      arraySvc.remove($scope.services, data.original);
    }
  });

});
