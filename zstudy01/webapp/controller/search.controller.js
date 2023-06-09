sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zstudy01.controller.search", {
            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();                
                
                this.oModel.read("/CarrierSet",{
                    success : function(oReturn){
                        console.log("READ: ", oReturn.results[0]);
                        this.oModel.setProperty("/",oReturn.results[0].Carrid);
                    }.bind(this)
                });

            },
            onValueHelpRequest: function(){
                var oDialog = this.byId("Dialog");

                if(oDialog){
                    oDialog.open();
                    return;
                }

                this.loadFragment({
                    name: "zstudy01.view.fragment.search"
                }).then(function(oDialog){
                    oDialog.open();
                },this);
            },
            onClose : function(oEvent){
                var oDialog =  oEvent.getSource().getParent();

                // this._search( this.byId("idSearchInput").getValue());
                oDialog.close();
            },
            _search : function(sInputValue){
                let oFilter = new Filter({
                    filters: [
                      new Filter({ 
                        path: 'CARRID', 
                        operator: "EQ", 
                        value1: sInputValue})]
                    });
                // return 
                this.byId("idConnectionTable").getBinding("items").filter([oFilter]); 
            }
        });
    });
