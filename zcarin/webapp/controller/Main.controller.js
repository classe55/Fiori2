sap.ui.define(
  ["sap/ui/core/mvc/Controller","sap/m/MessageBox","sap/m/MessageToast",],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller,MessageBox,MessageToast) {
    "use strict";

    return Controller.extend("zcarin.controller.Main", {
      formatter: {
        dateTime: function (oDate) {
          let oDateTimeInstance;
          oDateTimeInstance = sap.ui.core.format.DateFormat.getDateTimeInstance(
            {
              pattern: "yyyy-MM-dd",
            }
          );
          return oDateTimeInstance.format(oDate);
        },
      },
      onInit: function () {
        this._defalutset();
        
        this.oModel.read("/EmployeeSet", {
          success: function (oReturn) {
            console.log(oReturn);
            this.byId("EmpInfo").setText("사번 : " + oReturn.results[0].Employeeid);
            this.byId("idDept").setText("부서 : " + oReturn.results[0].Deptname );
            this.byId("idName").setText("이름 : " + oReturn.results[0].Name + " " + oReturn.results[0].Rankname );
            this.byId("idTel").setText(
              oReturn.results[0].Telno.substr(0, 3) +
                "-" +
                oReturn.results[0].Telno.substr(3, 4) +
                "-" +
                oReturn.results[0].Telno.substr(7, 4)
            );
            this.byId("idEmail").setText(oReturn.results[0].Email);
          }.bind(this),
        });

        // if(_rootPath){
        //   // this.byId('img').setSrc(_rootPath+"/model/TJ.png");
        //   this.byId('img2').setSrc(_rootPath+"/model/TJ.png");
        // }

      },
      _defalutset: function () {
        // oData Model 변수 세팅
        this.oModel = this.getOwnerComponent().getModel();
        this.oModel.setUseBatch(false);
        // oData self table 객체
        this.oTableSelf = this.byId("idSelfTable");
        // oData 업체 table 객체
        this.oTableReq = this.byId("idReqTable");
        this.oRouter = this.getOwnerComponent().getRouter();
        this.oModel.setUseBatch(false); 
      },
      onRegister: function (oEvent) {
        // footer 버튼 클릭 시
        var that = this;
        var aSelfSelectedItems  = this.oTableSelf.getSelectedItems();
        var aReqSelectedItems   = this.oTableReq.getSelectedItems();

        if (aSelfSelectedItems.length === 0 && aReqSelectedItems.length === 0 ) {
          sap.m.MessageToast.show("입고 차량을 선택해주세요!");
          return;
        }

        if (aSelfSelectedItems.length > 0 && aReqSelectedItems.length === 0) {
           
          MessageBox.confirm("입고하시겠습니까?", {
            icon: MessageBox.Icon.QUESTION,
            title: "자체 수리 입고",
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            emphasizedAction: MessageBox.Action.YES,
            onClose: function (oAction) {
              if (oAction === "YES") {
                aSelfSelectedItems.forEach(function (oSelectedItem) {
                  var oBindingContext = oSelectedItem.getBindingContext();
                  var oSelfSelectedRow = oBindingContext.getObject();

                  var UptData = {
                    Inspectid: oSelfSelectedRow.Inspectid,
                    Carid: oSelfSelectedRow.Carid,
                  };

                  var sUptPath = "/Self_CarinSet('" + oSelfSelectedRow.Inspectid + "')";

                  that.oModel.update(sUptPath,UptData,{
                    UpdateMethod: "Merge",
                    success : function(){                                                                        
                        MessageBox.show('입고되었습니다.');
                        that.oModel.refresh(true);
                    },
                    error : function(){
                        MessageToast.show('에러발생~');
                    }
                })
                });
              }
            },
          });
        }else if(aReqSelectedItems.length > 0 && aSelfSelectedItems.length === 0){
            var bChecked = this.byId('checkB').getSelected() ? this.byId('checkB').getSelected() : '';
            var jChecked = this.byId('checkJ').getSelected() ? this.byId('checkJ').getSelected() : '';

            MessageBox.confirm("입고하시겠습니까?", {
                icon: MessageBox.Icon.QUESTION,
                title: "업체 수리 입고",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: function (oAction) {
                  if (oAction === "YES") {
                    aReqSelectedItems.forEach(function (oSelectedItem) {
                        var oReqSelectedRow = oSelectedItem.getBindingContext().getObject();
                        var inputValue = oSelectedItem.getCells()[4].getValue();

                      if(inputValue === '0' || inputValue === ''  ){
                        MessageBox.error('수리 금액을 입력해주세요!');
                        return;
                      }
    
                      var Data = {
                        Inspectid: oReqSelectedRow.Inspectid,
                        Carid: oReqSelectedRow.Carid,
                        Bchange : bChecked,
                        Junkcar : jChecked,
                        Amount : inputValue,
                        Reprdesc : oReqSelectedRow.Reprdesc,
                        Bflag : '',
                        Castatus : '',
                        Employeeid : '',
                        Approvalid : '',
                        Repairtype : 'P',
                        Repdate : new Date(), 
                        Curkey : 'KRW',
                        Repdesc : ''
                      };
                      that.oModel.create("/Rep_CarinSet",Data,{
                        success : function(){                                                                        
                            MessageBox.show('입고되었습니다.');
                        },
                        error : function(){
                            MessageToast.show('에러발생');
                        }
                    })

                    });
                  }
                },
              });
              that.oModel.refresh(true);
        }
      },
    });
  }
);
