sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/m/Table"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel,MessageToast,MessageBox,Fragment,Table) {
        "use strict";

        return Controller.extend("zprojectteste1206.controller.Main", {        
            onInit: function () {
                var oModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("zprojectteste1206/model/products.json"));
                this.getView().setModel(oModel);
            },
            onDelete : function() {
               var oTable =  this.byId("idProductsTable");
               var oModel = this.getView().getModel();
               var aSelectedIndices = oTable.getSelectedItems(); // 배열    
               var aDatas = oModel.getProperty("/ProductCollection");

                MessageBox.confirm('정말 삭제하시겠습니까?',{
                    icon: MessageBox.Icon.QUESTION,
                    title: "Delete",
                    actions: [MessageBox.Action.YES,MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if(aSelectedIndices.length <= 1){
                            aDatas.splice(aSelectedIndices[0],1); // 인덱스(단건 삭제), 삭제 할 개수.
                            oModel.setProperty("/ProductCollection",aDatas);                             
                        }else{
                            for(var i=aSelectedIndices.length-1; i>=0; i--) {
                                aDatas.splice(aSelectedIndices[i], 1);
                                oModel.setProperty("/ProductCollection", aDatas);
                                  }
                        }                                                                         
                    }
                });
            },


        });
    });
