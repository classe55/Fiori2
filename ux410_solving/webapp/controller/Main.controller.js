sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Control"
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Filter, JSONModel,Control) {
    "use strict";

    return Controller.extend("sap.btp.ux410solving.controller.Main", {
      onInit: function () {
        let oData = {
          type: [
            { name: "bar" },
            { name: "column" },
            { name: "line" },
            { name: "donut" },
          ],
        };
        // 문제 6
        this.getView().setModel(new JSONModel(oData), "typeList");
        // ComboBox에 모델을 설정
        // var oComboBoxType = this.byId("idComboBoxType").setModel(this.getView().getModel("typeList"));        
        //ComboBox에 바인딩할 경로를 설정합니다.
        // oComboBoxType.bindAggregation("items","/type",new sap.ui.core.ListItem({ text: "{name}" }));

        // 문제 7 화면이 실행되자마자 Type ComboBox에 bar 라는 값을 나타날 수 있도록 한다.
        // xml에서 selectedKey="{typeList>/type/0/name}" 설정.
        // var oItem = this.byId("idComboBoxType").getModel().getProperty("/type/0");
        // this.byId("idComboBoxType").setSelectedItem(oItem.name);
      },
      // combobox의 선택된 아이템에 따라 반환 다르게.
      _getSelectedItemText: function (comboBox) {
        var selectedItem = comboBox.getSelectedItem();
        return selectedItem ? selectedItem.getText() : "";
      },
      onSearch: function () {
        var sInput = this._getSelectedItemText(this.byId("idComboBoxOrderID"));
        var comboType = this._getSelectedItemText(this.byId("idComboBoxType"));
        var vizFrame = this.byId('idViewChart');
        
        if(comboType === '' && !this.byId("idComboBoxType").getSelectedKey()){
            this.byId("idComboBoxType").setValueState("Error");
            return;
        }else{
            this.byId("idComboBoxType").setValueState("None");
        }
        // Type Combobox 값에따라 차트 동적 변화
        if (comboType === "donut") {
          vizFrame.setVizType("donut");
        //   this.byId("idMeasure").setUid("size");
        //   this.byId("idDimension").setUid("color");
        } else {
          // donut이 아니면 vizType만 변경
          vizFrame.setVizType(comboType);
        //   cate value로 다시 바꾸기.
        //   this.byId("idMeasure").setUid("size");
        //   this.byId("idDimension").setUid("color");
        }

        // OrderID가 비어 있으면 전체 데이터에 대한 필터 생성
        var oFilter = sInput ? new Filter("OrderID","EQ",sInput) : []; 
        
        vizFrame.getDataset().getBinding("data").filter(oFilter);

    
      },
      onSelectData : function(oEvent){
        var sOrderID = oEvent.getParameters().data[0].data['OrderID'];
        var sProductID = oEvent.getParameters().data[0].data['ProductID'];
        var oRouter = this.getOwnerComponent().getRouter(); // 라우터 객체를 불러옴

        // 선택 차트 초기화
        this.byId('idViewChart').vizSelection(oEvent.getParameters().data[0].data, {clearSelection : true});

        oRouter.navTo("RouteDetail",{
            'OrderID' : sOrderID,
            'ProductID' : sProductID,
        });

      }
    }); // extend
  }
); // define
