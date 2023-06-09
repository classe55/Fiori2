sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Filter,MessageBox,MessageToast) {
        "use strict";
        let aFilters = [];

        return Controller.extend("ER.zferrepair.controller.Self", {
            onInit: function () {
                this._defaultSet();                
                this.oRouter.getRoute("RouteSelf").attachPatternMatched(this._onPatternMatched , this);

                // 테이블 데이터 로드가 완료된 후에 호출되는 이벤트 핸들러 등록
                this.oTable.attachEvent("updateFinished", this._onTableUpdateFinished, this);
                                          
            },         
            _defaultSet : function(){                 
                this.oTable = this.byId('idMatTable');                
                this.oRouter = this.getOwnerComponent().getRouter();  
                this.oModel = this.getOwnerComponent().getModel();   
            },
            _onPatternMatched : function(oEvent){
                this.oRouter.getRoute("RouteSelf").attachPatternMatched(this._onProductMatched, this);

                // 점검 + 차량 관련 변수 
                const oModel = this.getView().getModel();
                const oArgs = oEvent.getParameter("arguments");

                // 점검 form 채우기
                var sInsPath = "/InspectionSet('"+oArgs.inspectid +"')";
                oModel.read(sInsPath, {
                    success : function(oReturn){
                        this.byId('idInspectid').setText(oReturn.Inspectid);
                        this.byId('idEmployeeid').setText(oReturn.Employeeid);  
                        this.byId('idInsdesc').setText(oReturn.Insdesc);
                                                                                       
                    }.bind(this),
                    error : function(){
                        sap.m.MessageToast.show('Error!');
                    }
                })
                // 차량정보 form
                var sCarPath = "/CAR_InfoSet('"+oArgs.carid +"')";
                oModel.read(sCarPath, {
                    success : function(oReturn){
                        this.byId('idCaridText').setText(oReturn.Carid);
                        this.byId('idCtyText').setText(oReturn.Ctyid);
                        this.byId('idCtynameText').setText(oReturn.Ctyname);  
                        this.byId('idBranchText').setText(oReturn.Branch);                          
                        this.byId('idBranchnameText').setText(oReturn.Branchname);
                                    
                    }.bind(this),
                    error : function(){
                        sap.m.MessageToast.show('Error!');
                    }                    
                })
                
            },         
            onCellClick : function(oEvent){                
                // ui.table일 때
                var sPath = oEvent.getParameters().rowBindingContext.sPath;
                var matId = sPath.substr(19,8);

                if(new Number(matId.substr(6,7)) < 6 ){
                    var matName = '와이퍼';
                }else if(new Number(matId.substr(6,7)) < 12){
                    var matName = '타이어';
                }else if (matId.substr(6,7) === '12'){
                    var matName = '바닥 매트';
                }else if (matId.substr(6,7) === '13'){
                    var matName = '전기차 충전 케이블';
                }else if (matId.substr(6,7) === '14'){
                    var matName = '에어컨 필터';
                }else if (matId.substr(6,7) === '15'){
                    var matName = '시트 커버';
                }else if (matId.substr(6,7) === '16'){
                    var matName = '전조등 / 실내등';
                }else if (matId.substr(6,7) === '17'){
                    var matName = '볼트 / 너트';
                }else if (matId.substr(6,7) === '18'){
                    var matName = '전동 공구 세트';
                }else{
                    var matName = '블랙박스';
                }
                this.byId('idSelectMatText').setText(matId);
                this.byId('idSelectMatNameText').setText(matName);
            },
            onInputChg : function(oEvent){
                oEvent.getParameter();

                if(oEvent.getParameters().value < 0){
                    this.byId('idMatCnt').setValueState('Error');
                }else{
                    this.byId('idMatCnt').setValueState('None');
                }
            },
            onRegister : function(){
                var sInput = '' ? '':  this.byId('idSelectMatText').getText();
                var sInputCnt = ''? '' : this.byId('idMatCnt').getValue();        
                var sInsId = this.byId('idInspectid').getText();
                var sInsDesc = this.byId('idInsdesc').getText();
                var sMatName = this.byId('idSelectMatNameText').getText();


                var that = this;
                if(!sInput){
                    sap.m.MessageToast.show('자재를 선택해주세요');
                    return;
                }

                if(!sInsDesc.includes(sMatName)){
                    MessageToast.show('올바른 자재를 선택해주세요');
                    return;
                }
                if(!sInputCnt){
                    sap.m.MessageToast.show('수량을 입력해주세요!');
                        this.byId('idMatCnt').setValueState('Error');
                        return;
                }else{
                    this.byId('idMatCnt').setValueState('None');
                }                                
                // 차량 상태 update (carid 전달)
                var sCarid = this.byId('idCaridText').getText();
                var sUpdatePath = "/car_statusSet('" + sCarid +"')";
                var oCarUpdateData = {
                    Carid : sCarid,
                };

                // 수리 이력 생성
                var sMatName =  this.getView().getModel().getProperty("/Material_InfoSet('" + sInput + "')").Matname;
                var sRepDesc = sInput + ' ' + sMatName + ' ' + sInputCnt +'개 교체';

                var oRepairHistory =  {
                    Repairid : sInsId,
                    Repdesc : sRepDesc,
                    Repairtype : 'E',
                    Amount : '0',
                    Curkey : 'KRW',
                    Bchange : '',
                    Junkcar : '',                    
                    Bflag : ''
                };
                var that = this;
                MessageBox.confirm("수리 등록하시겠습니까?", {
                  icon: MessageBox.Icon.QUESTION,
                  title: "수리 등록",
                  actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                  emphasizedAction: MessageBox.Action.YES,
                  onClose: function (oAction) {
                    if (oAction == "YES") {

                        that.oModel.update(sUpdatePath, oCarUpdateData, {
                            UpdateMethod: "Merge",
                            success: function () {
                              sap.m.MessageToast.show(
                                sInsId + " 수리 \r\n 등록되었습니다."                                    
                              );
                              
                              that.oModel.refresh(true);                                  
                            },
                            error: function () {
                            //   sap.m.MessageToast.show("update 에러발생!!!!!!!!!!!!!!!");
                            },
                          });
                        
                      //수리이력 생성                    
                      that.oModel.create("/Repair_HistorySet", oRepairHistory, {
                        success: function () {                        
                            
                        },
                        error: function () {
                        // sap.m.MessageToast.show("create 에러발생!!!!!!!!!!!!!!!");
                        },
                        });

                    }
                    that.oModel.refresh(true);
                    that.byId('idMatCnt').setValue('');
                    that.byId('idSelectMatText').setText('');
                    that.byId('idSelectMatNameText').setText('');
                    that.oRouter.navTo("RouteMain", {layout: sap.f.LayoutType.BeginColumnFullScreen   });
                  }
                });
            
                
            },
            _loadTableData: function(aFilters) {
                var oBinding = this.oTable.getBinding("rows");
                oBinding.filter(aFilters);    
            },
            onBackPress : function(){
                this.byId('idMatCnt').setValue('');
                this.byId('idSelectMatText').setText('');
                this.byId('idSelectMatNameText').setText('');
                this.oRouter.navTo("RouteMain", {layout: sap.f.LayoutType.BeginColumnFullScreen   });
            }
        });
    });