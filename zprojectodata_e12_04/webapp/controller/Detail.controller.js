sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("zprojectodatae1204.controller.Detail", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);

                this.getView().setModel(new JSONModel(),"detail");
            },
            _onPatternMatched : function(oEvent){ // 파라미터 정보가 담겨있음.                
                // oEvent.getParameters().arguments와 동일.
                var oView = this.getView()
                var oArgu = oEvent.getParameter("arguments"); // aa, bb가(key 값이) 담겨있음.       
                var oModel = oView.getModel(); // manifest.json에 선언된 Northwird OData Model     
                var oDetailModel = oView.getModel("detail");
                var oFilter = new sap.ui.model.Filter('OrderID','EQ',oArgu.key); // 필드 이름, 조건, 값 
            
                oView.setBusy(true);
                // GET : .../northwind.svc/Orders?$filter=OrderID eq 10248와 같음.
                oModel.read("/Orders", {
                    urlParameters : {
                        '$expand' : 'Customer,Employee'
                    },
                    filters : [oFilter],
                    success : function(oReturn){ // 경로안에 데이터 반환                        
                        oView.setBusy(false);
                        // console.log(oReturn.results[0]);                 
                        oDetailModel.setProperty("/data", oReturn.results[0].Customer);  // 데이터를 전부 넘김..                        
                        // { 따로 data를 설정안해도 1레벨이니까 설정됨.
                        // data : {oReturn.results[0] 키 value가 알아서 들어감.}
                        // }
                        
                    },//success에서 this가 달라짐. 사용하려면 success function 뒤에 .bind(this)로 컨트롤러 this 사용 가능.
                    error : function(){
                        oView.setBusy(false);
                        sap.m.MessageToast.show('에러 발생');
                    }                

                });
            },
            onNavButtonPress: function(){
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteMain",{},true);
                // navTo(1,2,3) 1: Route Name, 2: Parameters 3: Route history clear
            },
        }); // extend
    });
