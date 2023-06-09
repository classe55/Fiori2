sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zprojectteste1207.controller.Main", {
            onInit: function () {

            },
            onButtonPress : function(){ // 버튼 클릭시 detail로 화면 이동                                
                var oRouter = this.getOwnerComponent().getRouter(); // 라우터 객체를 불러옴
                oRouter.navTo("RouteDetail",{
                    aa : 'Apple',
                    bb : 'Banana',
                });
            }, 
        }); // extend
    }); // define
