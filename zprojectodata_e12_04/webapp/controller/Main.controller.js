sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Filter) {
        "use strict";

        return Controller.extend("zprojectodatae1204.controller.Main", {
            onInit: function () {
            },
            onSelected: function(oEvent){
                var oRouter = this.getOwnerComponent().getRouter(); // 라우터 객체를 불러옴
                var sPath = oEvent.getParameters().listItem.getBindingContextPath();
                var sKey = this.getView().getModel().getProperty(sPath+'/OrderID');
                oRouter.navTo("RouteDetail",
                    {
                        "key" : sKey
                    }
                );
            },
            onValueHelpRequest : function(oEvent){
                /* dialog open
                    CustomerDialog.fragment.xml 오픈
                    해당 다이얼로그 안에 sap.ui.table.Table 세팅 후 
                    /Customers 바인딩... 표시할 필드는 CustomerID,CompanyName 팝업 닫히도록 한다.
                */
               //처음엔 안 가져옴 아래 로직 탐.
               var oDialog = this.byId("Dialog"); // 1차 : undefined                
               if(oDialog){
                   oDialog.open();
                   return;
               }
               this.loadFragment({
                name: "zprojectodatae1204.view.fragment.CustomerDialog" //경로
                }).then(function(oDialog){
                oDialog.open();
                },this);                   
            },
            onClose : function(oEvent){
                var oDialog =  oEvent.getSource().getParent();
                
                this._search( this.byId("inputId").getValue());
                oDialog.close();
                
            },
            onClicked :function(oEvent){
                var sPath = oEvent.getParameters().rowContext.sPath
                 // var sCustomerId = oEvent.getParameters().rowContext.getProperty('/CustomerID')
                var sKey = this.getView().getModel().getProperty(sPath+'/CustomerID');
                this.byId("inputId").setValue(sKey);
            },
            _search : function(sInputValue){
                let oFilter = new Filter({
                    filters: [
                      new Filter({ path: 'CustomerID', operator: "EQ", value1: sInputValue})]
                    });
                // return 
                this.byId("idProductsTable").getBinding("items").filter([oFilter]); 
            }
        }); //extend
    }); // define
