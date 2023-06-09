sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zprojectteste1207.controller.Detail", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);
            },
            _onPatternMatched : function(oEvent){ // 파라미터 정보가 담겨있음.                
                // oEvent.getParameters().arguments와 동일.
                var oArgu = oEvent.getParameter("arguments"); // aa, bb가(key 값이) 담겨있음.             
                console.log(oArgu);

            },
            onNavButtonPress: function(){
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteMain",{},true);
                // navTo(1,2,3) 1: Route Name, 2: Parameters 3: Route history clear
            },
        }); // extend
    });
