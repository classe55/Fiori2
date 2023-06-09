sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("zprojectteste1201.controller.Main", {
        onInit: function () {
            // 계산기 실습 Input 초기값 세팅 
            // this.byId('idInput1').setValue(10);
            // this.byId('idInput2').setValue(20);
            // this.byId('idSelect').setSelectedKey("multiply");        
        },
        onClick : function(){
            var oInput = this.byId("idCustomer"); // input 객체
           
            var oLabel = oInput.getLabels()[0];  // Label 객체
            // oLabel.getText();  //'Customer' 문자열 받아옴.
            console.log(oLabel.getText());
        },
        // 계산기 관련
        // onBtnPress : function(oEvent){
        //     // Input 및 Select 값 받아오기
        //     var num1 = this.byId('idInput1').getValue();
        //     var num2 = this.byId('idInput2').getValue();
        //     var result = 0;
        //     var select = this.byId('idSelect').getSelectedKey();

        //     num1 = new Number(num1);
        //     num2 = new Number(num2);
        //     switch(select){
        //         case 'plus':
        //             result = num1 + num2;
        //             break;
        //         case 'minus':
        //             result = num1 - num2;
        //             break;
        //         case 'multiply':
        //             result = num1 * num2;
        //             break;
        //         case 'divide':
        //             result = num1 / num2;
        //             break;
            
        //     alert(result);                 
        // }
    });
});
