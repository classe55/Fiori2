sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";

    return Controller.extend("sap.btp.ux410solving.controller.Detail", {
      onInit: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched,this);
      },
      _onPatternMatched: function (oEvent) {
        var oArgu = oEvent.getParameter("arguments");        
        var oView = this.getView();
        oView.bindElement("/Order_Details(OrderID=" + oArgu.OrderID + ',ProductID=' + oArgu.ProductID+')');
        // `'/Order_Details(OrderID='${oArgu.OrderID}',ProductID='${oArgu.ProductID})`

        // 강사님 코드
        // const oView = this.getView(),
        //  oModel = oView.getModel(),
        //      oArgu = oEvent.getParameter("arguments");

        // let sBinPath = oModel.createKey("/Order_Details",{
        //     OrderID: oArgu.OrderID,
        //     ProductID: oArgu.ProductID
        // });

        // oView.bindElement(sBinPath);

        // oModel.read(sBinPath, { // 서버 데이터를 가져옴
        // success : function(oReturn){
        // read로 조회된 데이터만 가져옴.
        // 데이터 핸들링 또한 success안에서 하기.
        // }
        // });

      },
    }); // extend
  }
);
