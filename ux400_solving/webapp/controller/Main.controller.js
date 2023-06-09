sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("sap.btp.ux400solving.controller.Main", {
      formatter: {
        transformDiscontinued: function (sData) {
          if (sData == true) {
             sData = "Yes";
          } else {
             sData = "No";
          }
          return sData;

        //   return value === true ? 'Yes' : 'No';
        },
      },
      onInit: function () {
        let oDatas = {
          list: [],
        };
        this.getView().setModel(new JSONModel(oDatas), "list");
        // this.getView().setModel(new JSONModel({datas:[]), "list");
      },
      onRandomPress: function () {
        var oInput = this.byId("idInput");
        oInput.setValueState("None");
        // onValueChange 이벤트가 발생하기 위해서 setValueState를 사전에 설정
        oInput.setValue(Math.floor(Math.random() * 100) + 1);                

        var validate = oInput.getValueState();

        if (validate === "None") {
          let oModel = this.getView().getModel("list");
          var aList =  oModel.getData().list;
          var iRandomNum = Number(oInput.getValue());
            
          aList.push({
            value: iRandomNum,
          });
          oModel.setProperty("/list", aList);
        }
      },
      onButtonPress: function () {
        var oDialog = this.byId("productDialog");
        if (oDialog) {
          oDialog.open();
          return;
        }
        this.loadFragment({
          name: "sap.btp.ux400solving.view.fragment.Products", //경로
        }).then(function (oDialog) {
          oDialog.open();
        }, this);
      },
      onClose: function (oEvent) {
        var oDialog = oEvent.getSource().getParent();
        oDialog.close();
      },
      onValueChange: function (oEvent) {
        // var oInput = oEvent.getSource();
        // var iValue = parseInt(oInput.getValue());
        // if (( iValue < 1 || iValue > 100)) {
        //   oInput.setValueState("Error");
        //   oInput.setValueStateText("1 이상 100 이하의 값을 입력해주세요.");
        // } else {
        //   oInput.setValueState("Success");
        //   oInput.setValueStateText("");
        //   let oModel = this.getView().getModel("list");
        //   var aList = oModel.getData().list;
        //   var iRandomNum = Number(oInput.getValue());
            
        //   aList.push({
        //     value: iRandomNum,
        //   });
        //   oModel.setProperty("/list", aList); 
        // }

        // 강사님 코드
        let oControl = this.byId("idInput");
        let iNum = Number(oControl.getValue());
        let isOk = iNum>= 1 && iNum<=100; // true false
        oControl.setValueState(isOk? 'None' : 'Error');        
        oControl.setValueStateText(isOk? '' : '1이상 100 이하의 값을 입력해주세요.');
        this.byId("idButton").setEnabled(isOk ? true : false);
        if(oControl.getValueState()){
            var aList = oModel.getData().list;
            let iNum = Number(oControl.getValue());
            let oModel = this.getView().getModel("list");

            aList.push({value: iNum});
            oModel.setProperty("/list",aList);
        }
        
      }
    });
  }
);
