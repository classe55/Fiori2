/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sapbtp/ux400_solving/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
