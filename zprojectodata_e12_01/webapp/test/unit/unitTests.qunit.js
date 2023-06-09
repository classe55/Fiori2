/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zprojectodata_e12_01/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
