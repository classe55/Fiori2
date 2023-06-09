sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("zprojectodatae1205.controller.Main", {
            onInit: function () {
                this.getView().setModel(new JSONModel(),"main");

                this._defaultSet();
            },
            _defaultSet : function(){
                // oData Model 변수 세팅
                this.oModel = this.getOwnerComponent().getModel();
                // json Model
                this.oMainModel = this.getView().getModel("main");
                // oData table 객체
                this.oTable = this.byId("idProductTable");
            },
            onCreate : function(){
                let oData = this.oMainModel.getData();  // view에서 입력한 값을 받아옴

                // data type 일치시키기
                oData.Productno = Number(oData.Productno);
                
                //create(경로(Entityset 정보),Data,params(성공,에러 등 여부))
                this.oModel.create("/Products",oData,{
                    success : function(){
                        sap.m.MessageToast.show('Create Success!');
                    },
                    error : function(){
                        sap.m.MessageToast.show('Error!');
                    }
                }); 
            },
            onUpdate : function(){
                // 사용자가 입력한 값을 토대로 update함.
                let jsonData = this.oMainModel.getProperty("/"); // input에 mapping 되어있는 전체 데이터를 가져옴.
                let sFullPath = this.oModel.createKey("/Products",{
                        Productno : jsonData.Productno // object안에 있는 Productno.
                    });// sFullPath -> /Products(Productno = 111)            
                this.oModel.update(sFullPath,jsonData,{
                    success: function(){
                        sap.m.MessageToast.show('변경되었슝~');
                    }
                });
            },
            onDelete : function(){
                // 전제 조건 ! input에 값이 채워져 있어야 함.
                let idx = this.oMainModel.getProperty("/Productno"); // input에 저장된 Productno 반환(1204)
                let sFullPath = this.oModel.createKey("/Products",{
                        Productno : Number(idx)
                    });  // /Products(1204)
                    //idx와 
                this.oModel.remove(sFullPath,{
                    success : function(){
                        sap.m.MessageToast.show('삭제되었슝~!');
                    }
                })
            },
            onReadEntity : function(){
                let idx = this.oTable.getSelectedIndex();
                let sPath = this.oTable.getContextByIndex(idx).getPath(); // 해당 index의 context 정보를 받아옴.

                // let sFullPath = this.oModel.createKey("/Products",{
                //     Productno : 2
                // }); // "Products(2)"와 동일함

                this.oModel.read(sPath, {
                    success : function(oReturn){
                        console.log("READ: ", oReturn);
                        this.oMainModel.setProperty("/",oReturn); // mainmodel input에 바인딩시킴.                           
                        // this.oMainModel.setData(oReturn);

                    }.bind(this),
                    error : function(){
                        sap.m.MessageToast.show('Error!');
                    }
                })
            }

        });
    });
