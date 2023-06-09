sap.ui.define([
    "sap/ui/core/mvc/Controller","sap/m/MessageBox","sap/m/MessageToast","sap/ui/model/Sorter",'sap/ui/model/Filter' 
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,MessageToast,Sorter,Filter) {
        "use strict";

        return Controller.extend("ER.zfercarin.controller.Main", {
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
                this._bDescendingSort = false;
                this.oModel.read("/EmployeeSet", {
                  success: function (oReturn) {
                    this.byId("EmpInfo").setText("사번 : " + oReturn.results[0].Employeeid);
                    this.byId("idDept").setText("부서 : " + oReturn.results[0].Branchname + " " + oReturn.results[0].Deptname );
                    this.byId("idName").setText("이름 : " + oReturn.results[0].Name + " " + oReturn.results[0].Rankname );
                    this.byId("idTel").setText(
                      oReturn.results[0].Telno.substr(0, 3) +
                        "-" +
                        oReturn.results[0].Telno.substr(3, 4) +
                        "-" +
                        oReturn.results[0].Telno.substr(7, 4)
                    );
                    this.byId("idEmail").setText(oReturn.results[0].Email);

                    if(_rootPath){
                      this.byId("idLoginImage").setSrc(_rootPath+'/image/'+oReturn.results[0].Sapid+'.png');
                  }else{
                      this.byId("idLoginImage").setSrc('/image/'+oReturn.results[0].Sapid+'.png');
                  }
                  }.bind(this),
                });
        
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
                   // 선택된 항목 개수 저장
                  var selectedItemsCountSelf = aSelfSelectedItems.length;
                  MessageBox.confirm("입고하시겠습니까?", {
                    icon: MessageBox.Icon.QUESTION,
                    title: "자체 수리 입고",
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                      if (oAction === "YES") {
                        var processedItemsCountSelf = 0;
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
                              processedItemsCountSelf++; // 항목 처리 완료 시 카운트 증가
                                  if (processedItemsCountSelf === selectedItemsCountSelf) {
                                    MessageToast.show('입고되었습니다.'); // 마지막 항목 처리 시 메시지 띄우기
                                    that.oModel.refresh(true);
                                  }
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
                  // var selectedItemsCountReq = aReqSelectedItems.length;
                    var bChecked = this.byId('checkB').getSelected() ? 'X' : '';
                    var jChecked = this.byId('checkJ').getSelected() ? 'X' : '';
                    
                    var isValidInput = true; // 입력값 유효성 여부 
                    MessageBox.confirm("입고하시겠습니까?", {
                        icon: MessageBox.Icon.QUESTION,
                        title: "업체 수리 입고",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (oAction) {
                          if (oAction === "YES") {
                            var selectedItemsCountReq = 0; // 처리된 항목 개수 카운트
                            aReqSelectedItems.forEach(function (oSelectedItem) {
                                var oReqSelectedRow = oSelectedItem.getBindingContext().getObject();
                                var inputValue = oSelectedItem.getCells()[5].getValue();
        
                              if(inputValue === '0' || inputValue === ''  ){
                                isValidInput = false;
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
                                  selectedItemsCountReq++; // 항목 처리 완료 시 카운트 증가

                                  if (selectedItemsCountReq === aReqSelectedItems.length) {
                                    MessageToast.show('입고되었습니다.'); // 마지막 항목 처리 시 메시지 띄우기
                                  }
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
              onSelfDateChange : function(){
                var aFilters = [];
                var oDateFrom = this.formatter.dateTime(oEvent.getParameters().from);
                var oDateTo  = this.formatter.dateTime(oEvent.getParameters().to);
                var oTable = this.byId("idSelfTable");
          
                var oFilter = new Filter('Insdate', sap.ui.model.FilterOperator.BT, oDateFrom,oDateTo);
                aFilters.push(oFilter);
                oTable.getBinding("items").filter(aFilters);

              },
              onReqDateChange : function(){
                var aFilters = [];
                var oDateFrom = this.formatter.dateTime(oEvent.getParameters().from);
                var oDateTo  = this.formatter.dateTime(oEvent.getParameters().to);
                var oTable = this.byId("idReqTable");
          
                var oFilter = new Filter('Insdate', sap.ui.model.FilterOperator.BT, oDateFrom,oDateTo);
                aFilters.push(oFilter);
                oTable.getBinding("items").filter(aFilters);   
              },
              onSelfSort : function(){
                this._bDescendingSort = !this._bDescendingSort;
                var oView = this.getView(),
                oTable = oView.byId("idSelfTable"),
                oBinding = oTable.getBinding("items"),
                oSorter = new Sorter("Inspectid", this._bDescendingSort);
                oBinding.sort(oSorter);
              },
              onReqSort : function(){
                this._bDescendingSort = !this._bDescendingSort;
                var oView = this.getView(),
                oTable = oView.byId("idReqTable"),
                oBinding = oTable.getBinding("items"),
                oSorter = new Sorter("Inspectid", this._bDescendingSort);
                oBinding.sort(oSorter);

              },
              onSelfDateChange : function(oEvent){
                var aFilters = [];
                var oDateFrom = this.formatter.dateTime(oEvent.getParameters().from);
                var oDateTo  = this.formatter.dateTime(oEvent.getParameters().to);
                var oTable = this.byId("idSelfTable");
            
                if(!oDateFrom && !oDateTo){
                  oTable.getBinding("items").filter([]);
              }else {
                  var oFilter = new Filter('Repdate', sap.ui.model.FilterOperator.BT, oDateFrom,oDateTo);
                  aFilters.push(oFilter);
                  oTable.getBinding("items").filter(aFilters);
              }


              },
              onReqDateChange : function(oEvent){
                var aFilters = [];
                var oDateFrom = this.formatter.dateTime(oEvent.getParameters().from);
                var oDateTo  = this.formatter.dateTime(oEvent.getParameters().to);
                var oTable = this.byId("idReqTable");
            
             
                if(!oDateFrom && !oDateTo){
                  oTable.getBinding("items").filter([]);
                }else {
                  var oFilter = new Filter('Repdate', sap.ui.model.FilterOperator.BT, oDateFrom,oDateTo);
                  aFilters.push(oFilter);
                  oTable.getBinding("items").filter(aFilters);
                }
              },
              // onSearchReq : function(oEvent){
              //   var aFilters = [];
              //   var oTable = this.byId("idReqTable");
              //   var sQuery = oEvent.getParameter("query");
        
              //   if(!sQuery){
              //     oTable.getBinding("items").filter(aFilters);
              //   }else{
              //     var oFilter = new Filter('Inspectid', sap.ui.model.FilterOperator.EQ, sQuery);
              //   aFilters.push(oFilter);
              //   oTable.getBinding("items").filter(aFilters);
              //   } 
              // }
        });
    });
