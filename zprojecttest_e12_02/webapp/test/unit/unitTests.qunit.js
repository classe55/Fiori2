/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"C05/zprojecttest_e12_02/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
