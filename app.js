angular.module('BlueAppDemo', [])
    .controller('MainController', ['$scope', mainController]);

function mainController($scope) {
	var main = this;

	main.buttonClicked = function() {
                main.Name = ''; // Store name
                main.Id = ''; // Store id
		if (isBluetoothEnabled()) {
			let options = {	
				filters: [{name: 'HEXIWEAR'}],	
				optionalServices: ['0000180a-0000-1000-8000-00805f9b34fb']
			};
 			
        	navigator.bluetooth.requestDevice(options)
            	.then(function(device) {
                	// Receives device user selected.
                	main.Name = device.name; // Store name
                	main.Id = device.uuid  ; // Store id
                	$scope.$apply();

                	return device.gatt.connect();
            	})
            	.then(function(data) {
            		// Got the value. Let's use it in our application.
            	    main.Manufacturer = dataToString(data);
            	    $scope.$apply();
				})
		.then(function(server) {
            		// Device has connected.
            		// Get the service we are looking for to get data from.
            		return server.getPrimaryService('0000180a-0000-1000-8000-00805f9b34fb');
            	})
            	.then(function(service) {
            		// Got the service
             	   	// Get the characteristic where data is found.
             	   	return service.getCharacteristic('00002a29-0000-1000-8000-00805f9b34fb');
            	})
            	.then(function(c1) {
            	    // Got characteristic.
             	   	// Read the value we want.
             	   	return c1.readValue();
            	})
            	.catch(function(error) {
                	console.log('Argh! ' + error);
            	});
		}
	}

    function isBluetoothEnabled() {
        if (navigator.bluetooth) {
            console.log("We have bluetooth");
            return true;
        } else {
            return false;
        }
    }

    function dataToString(data) {
        var value = '';

        for (var i = 0; i < data.byteLength; i++) {
            value = value + String.fromCharCode(data.getUint8(i));
        }

        value = value.replace(/\0/g, '');
        return value.trim();
    }
}
