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

        return Controller.extend("zprojectteste1204.controller.Main", {
            onInit: function () {
                // 직접 데이터 만들고 받아올 때,
                // let datas =     {
                //     title : {
                //         subTitle : 'Json Title'
                //     },
                //     list : [
                //         {num1 : 33,  operator : '+' , num2 : 10, result : 43},
                //             ]
                // };

                // 파일 형태로 받아옴
                var oModel = new JSONModel();
                oModel.loadData(
                    sap.ui.require.toUrl("zprojectteste1204/model/data.json")
                );
                this.getView().setModel(oModel, 'MainModel'); // json data를 가진 모델이 생성됨.
            },
            onChange : function() {
                var oModel = this.getView().getModel("MainModel");
                // 데이터 호출 방법1 
                var oData = oModel.getData(); // 전체 데이터 다 가져옴
                // 데이터 호출 방법2 프로퍼티
                // oModel.getProperty("/title/subTitle"); // 특정 경로에 해당하는 데이터 가져옴

                var oData = oModel.getProperty("/title/subTitle");
                console.log('변경 전',oData);
                oModel.setProperty("/title/subTitle",'change Title'); // 변경할 값을 넘겨주기

                // console.log('변경 전 제목 :', oData.title.subTitle);
                // oData.title.subTitle = 'change Title';                
                // oModel.setData(oData); // 변경된 title로 oModel에 적용함.

                // age 24 -> 100
                oData.list[4].age = 100;
                oModel.setData(oData); 
            },
            onDisplay : function(){
                var oModel = this.getView().getModel("MainModel");
                var oData = oModel.getData(); 
                console.log('변경 후 제목:',oData.title.subTitle);
                console.log('변경 후 List:',oData.list[4].age);

            },
            onBtnPress : function(oEvent){
                let oModel = this.getView().getModel("MainModel"),
                    aList = oModel.getData().list;     // [{..}]

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
                
                MessageBox.show(sMsg, {
                    icon: MessageBox.Icon.INFORMATION,
                    title: "My message box title",
                    actions: [MessageBox.Action.YES,MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if(oAction === 'YES'){
                            aList.push({
                                num1 : iNum1, 
                                operator : oSelect.getText(), 
                                num2 : iNum2, 
                                result : iResult
                                        });
                                oModel.setProperty("/list", aList);                               
                        }                                                                         
                    }
                });
            },
            onAdd : function () {               
                //처음엔 안 가져옴 아래 로직 탐.
                var oDialog = this.byId("Dialog"); // 1차 : undefined                
                if(oDialog){
                    oDialog.open();
                    return;
                }                
                // 위에 if문이 없으면 계속 loadFragment
                this.loadFragment({
                    name: "zprojectteste1204.view.fragment.Dialog" //경로
                }).then(function(oDialog){
                    oDialog.open();
                },this);                
            },
            onDelete : function(oEvent){    
               var oTable =  this.byId("todoTable");
               var oModel = this.getView().getModel("MainModel");
               var aSelectedIndices = oTable.getSelectedIndices(); // 배열
               var aDatas = oModel.getProperty("/todo");

               MessageBox.confirm('정말 삭제하시겠습니까?',{
                icon: MessageBox.Icon.QUESTION,
                title: "Delete",
                actions: [MessageBox.Action.YES,MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: function (oAction) {
                    if(oAction ==='YES' && aSelectedIndices.length >=1){
                        if(aSelectedIndices.length <= 1){
                            aDatas.splice(aSelectedIndices[0],1); // 인덱스(단건 삭제), 삭제 할 개수.
                            oModel.setProperty("/todo",aDatas);                             
                        }else{
                            for(var i=aSelectedIndices.length-1; i>=0; i--) {
                                aDatas.splice(aSelectedIndices[i], 1);
                                oModel.setProperty("/todo", aDatas);
                                  }
                        }                                                                         
                    }
                    
                }
            });


            },
            onClose : function(oEvent){
                // var oDialog =  oEvent.getSource().getParent(); 

                // // input 가져오는 강사님 방법1
                // oDialog.getContent()[0].getItems()[1].getValue();

                // var sValue = this.getView().getModel("root").getProperty("/value");
                // console.log(sValue);
                // oDialog.close();// dialog button 객체를 가져옴 (press를 통해)                
            },
            onSave : function(oEvent){
                var oDialog =  oEvent.getSource().getParent();                    
                let oModel = this.getView().getModel("MainModel"),
                    aTodo = oModel.getData().todo;                                    
                //  push로 아래 넣는 방법
                //     aList.push({
                //     content : this.byId("todoInput").getValue()
                // });
                //     oModel.setProperty("/todo", aList);  

                
                // var sValue = oDialog.getContent()[0].getItems()[1].getValue();
                //debugger; 

                //     // 강사님 방법(root에 접근)
                // var oModel = this.getView().getModel("MainModel");
                // var aTodos = oModel.getProperty("/todo"); // [ {... }]
                // var sValue = this.getView().getModel("root").getProperty ("/value");

                // if(sValue) {
                //     aTodos.unshift({ content : sValue});
                //     oModel.setProperty("/todo", aTodos);
                // }
                // oDialog.close();


                // unshift로 앞에 추가하는 방법       -- main 모델 접근            
                if(aTodo){
                    aTodo.unshift({
                        content : this.byId("todoInput").getValue()
                         
                    });
                    oModel.setProperty("/todo", aTodo);    
                        
                }                                     
                    oDialog.close();
                    
            },
            onBeforeOpen : function(){
                this.byId("todoInput").setValue();
            },
            onRowDelete : function(oEvent){
                var oModel = this.getView().getModel("MainModel");
                var aDatas = oModel.getProperty("/todo");
                var iSelectIndex = oEvent.getParameters().row.getIndex()

                aDatas.splice(iSelectIndex, 1);
                oModel.setProperty("/todo", aDatas);

            },
        
        });
    });