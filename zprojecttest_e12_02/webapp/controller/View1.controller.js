sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, MessageBox) {
        "use strict";
        return Controller.extend("C05.zprojectteste1202.controller.View1", {
            onInit: function () {
                this.byId('idSelect').setSelectedKey("multiply"); 
            },
            // _validateInput: function (oInput) {
            //     var sValueState = "None";
            //     var bValidationError = false;
            //     var oBinding = oInput.getBinding("value");
    
            //     try {
            //         oBinding.getType().validateValue(oInput.getValue());
            //     } catch (oException) {
            //         sValueState = "Error";
            //         bValidationError = true;
            //     }
            //     oInput.setValueState(sValueState);
            //     return bValidationError;
            // },

            // onInputChange1: function(oEvent){
            //     var oInput = oEvent.getSource();
			//     this._validateInput(oInput);
            // },
            onSubmit:function(){
                this.byId("idText").setText(this.byId("idInput").getValue());
            },
            onBtnPress : function(oEvent){                
                var iNum1 = Number(this.byId('idInput1').getValue());
                var iNum2 = Number(this.byId('idInput2').getValue());
                var sMsg = new String();   // sMsg = ''; 동일.
                var iResult = 0;
                var oSelect = this.byId('idSelect').getSelectedItem();
                switch(oSelect.getKey()){
                    case 'plus':
                        iResult = iNum1 + iNum2;
                        break;
                    case 'minus':
                        iResult = iNum1 - iNum2;
                        break;
                    case 'multiply':
                        iResult = iNum1 * iNum2;
                        break;
                    case 'divide':
                        iResult = iNum1 / iNum2;
                        break;
                    }
                sMsg = `${iNum1} ${oSelect.getText()} ${iNum2} = ${iResult}`;
                // MessageToast.show(sMsg);

                MessageBox.show(sMsg,{
                    icon: MessageBox.Icon.INFORMATION, // icon
                    title: "My message box title",     // box title
                    actions: [MessageBox.Action.YES], 
                    emphasizedAction: MessageBox.Action.YES,                // yes에 강조
                    onClose: function (oAction) { / * do something * / }    // 버튼에 따라 로직넣기.
                                        });

        }
        });
    });
