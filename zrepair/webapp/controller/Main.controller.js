sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/f/library",
    "sap/ui/model/Sorter"    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,MessageToast,MessageBox,library,Sorter) {
        "use strict";  

        return Controller.extend("zrepair.controller.Main", {
            formatter : {
                dateTime : function(oDate){
                    let  oDateTimeInstance;
                    oDateTimeInstance = sap.ui.core.format.DateFormat.getDateTimeInstance({
                         pattern : 'yyyy-MM-dd'
                     });                     
                     return oDateTimeInstance.format(oDate);
                 }
            },
            onInit: function () {
                // oData Model 변수 세팅
                this.oModel = this.getOwnerComponent().getModel();                   
                this.oModel.setUseBatch(false); 
                // oData self table 객체
                this.oTableSelf = this.byId("idSelfTable");
                // oData 업체 table 객체
                this.oTableReq = this.byId("idReqTable");
                // oData Deny table 객체
                this.oTableDeny = this.byId("idDenyTable");

                this.oRouter = this.getOwnerComponent().getRouter();
                
                this._bDescendingSort = false; //초기 sort

                this.oModel.read('/EmployeeSet',{
                    success : function(oReturn){
                        console.log(oReturn);
                        this.byId('idDept').setText(oReturn.results[0].Deptname);
                        this.byId('idName').setText(oReturn.results[0].Name + ' ' + oReturn.results[0].Rankname);                        
                    }.bind(this)
                })

                // 테이블 데이터 로드가 완료된 후에 호출되는 이벤트 핸들러 등록
                this.oTableSelf.attachEvent("updateFinished", this.onTableUpdateFinished, this);
                this.oTableReq.attachEvent("updateFinished", this.onTableUpdateFinished, this);
                this.oTableDeny.attachEvent("updateFinished", this.onTableUpdateFinished, this);
            },
            onTableUpdateFinished: function() {
                // 테이블 로드가 완료된 후에 호출되는 코드
                var iCountSelf = this.oTableSelf.getBinding("items").getLength();
                var iCountReq = this.oTableReq.getBinding("items").getLength();
                var iCountDeny = this.oTableDeny.getBinding("items").getLength();

                this.getView().byId("idIconSelf").setCount(iCountSelf);
                this.getView().byId("idReqSelf").setCount(iCountReq);
                this.getView().byId("idIconDeny").setCount(iCountDeny);
                
              },
            onPress : function(oEvent){                
                // 자체수리 자재 정보 입력화면으로 이동.
                // 선택된 행을 가져옵니다.
                var oSelectedItem = oEvent.getSource().getParent();
                    
                // 선택된 행에서 필요한 데이터를 가져옵니다.
                var oBindingContext = oSelectedItem.getBindingContext();
                var sPath = oBindingContext.getPath();
                
                this.oView.getParent().getParent().setLayout(library.LayoutType.MidColumnFullScreen);

                this.oRouter.navTo("RouteSelf", {
                    layout: "MidColumnFullScreen",
                    inspectid: oBindingContext.getProperty(sPath).Inspectid,
                    carid: oBindingContext.getProperty(sPath).Carid
                  });
                
            },
            onReqButton : function(oEvent){
                var that = this;
                let idx = this.oTableReq.getSelectedItems();
                if(idx == ''){
                    MessageBox.show('요청하고자 하는 차량을 선택해주세요');
                    return;
                }
                console.log(idx);                
                MessageBox.confirm('수리 요청하시겠습니까?',{
                    icon: MessageBox.Icon.QUESTION,                
                    title: "수리 요청",
                    actions: [MessageBox.Action.YES,MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if(oAction ==='YES'){
                            // 수리요청 Head
                            var selectdItems = that.oTableReq.getSelectedItems();                               
                            var sInsDesc,sPartnerId; 

                            selectdItems.forEach(function(item) {
                                var rowData = item.getBindingContext().getObject(); // 각 행의 데이터를 가져옵니다.
                                sInsDesc = rowData.Insdesc;
                                if (sInsDesc.includes('폐차')) {
                                    sPartnerId = 'PAT06';
                                    sInsDesc = '폐차 요청';

                                } else {
                                    sPartnerId = 'PAT06';                                    
                                }
                                var reqData = {
                                    Employeeid : rowData.Employeeid,
                                    Partnerid : sPartnerId,
                                    Reprdesc : sInsDesc,
                                    Inspectid : rowData.Inspectid,
                                    Carid : '',
                                    Repairtype : 'P',
                                    Ename : '',                                   
                                    Reprnum : '',
                                    Delflag : '',
                                    Delflagi : '',
                                    Pname : '',
                                    Reprdate : new Date()
                                  
                                };
                                    
                                that.oModel.create("/Repair_RequestSet",reqData,{
                                    success : function(){                                                                        
                                        MessageBox.show('상신되었습니다.');
                                        that.oModel.refresh(true);
                                    }
                                })
                            })                            
                        }                                         
                    }
                });
                // MessageBox.show('상신되었습니다.');
                that.oModel.refresh(true);                                      
            },
            onListItemPress : function(oEvent){                
                var oSelectedItem = oEvent.getSource();
                // 선택된 행에서 필요한 데이터를 가져옵니다.
                var oBindingContext = oSelectedItem.getBindingContext();
                var sPath = oBindingContext.getPath();

                this.oView.getParent().getParent().setLayout(library.LayoutType.TwoColumnsMidExpanded);

                this.oRouter.navTo("RouteDeny", {
                    layout: library.LayoutType.TwoColumnsMidExpanded,
                    Reprid: oBindingContext.getProperty(sPath).Reprid,
                    Approvalid: oBindingContext.getProperty(sPath).Approvalid
                  });

            },
            onSort : function(oEvent){
                this._bDescendingSort = !this._bDescendingSort;
                var oView = this.getView(),
                oTable = oView.byId("idSelfTable"),
                oBinding = oTable.getBinding("items"),
                oSorter = new Sorter("Inspectid", this._bDescendingSort);
                oBinding.sort(oSorter);
            }
        });
    });
