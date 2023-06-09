/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */
var _rootPath = jQuery.sap.getModulePath("ER.zferbranchmanage").split('/~')[0];
sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "ER/zferbranchmanage/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("ER.zferbranchmanage.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            },
            setDensity: function ({
                styleClass = Device.system.desktop ? "sapUiSizeCompact" : "sapUiSizeCozy",
                targetElement = document.body,
              } = {}) {
                targetElement.classList.add(styleClass);
                return this;
              },
        });
    }
);