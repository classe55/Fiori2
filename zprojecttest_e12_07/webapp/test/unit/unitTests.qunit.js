/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zprojecttest_e12_07/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
