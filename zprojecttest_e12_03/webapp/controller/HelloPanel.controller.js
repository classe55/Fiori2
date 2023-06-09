sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        return Controller.extend("zprojectteste1203.controller.HelloPanel", {
            onInit: function () {
            },
            onHelloPress: function () {               
                //처음엔 안 가져옴 아래 로직 탐.
                var oDialog = this.byId("helloDialog"); // 1차 : undefined
                if(oDialog){
                    oDialog.open();
                    return;
                }
                
                // 위에 if문이 없으면 계속 loadFragment
                this.loadFragment({
                    name: "zprojectteste1203.view.fragment.HelloDialog" //경로
                }).then(function(oDialog){
                    oDialog.open();
                },this);
            },
            onClose : function(oEvent){
                var oDialog =  oEvent.getSource().getParent(); 
                oDialog.close();
                // dialog button 객체를 가져옴 (press를 통해)
            },
        });
    });
