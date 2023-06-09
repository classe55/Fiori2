/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "branchmanage/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("branchmanage.Component", {
            metadata: {
                interfaces: [
                    "sap.ui.core.IAsyncContentCreation",
                  ],
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
                this.getModel("mapConfig").setDefaultBindingMode("OneWay");
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