sap.ui.define([
    "sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel",'sap/ui/model/Sorter','sap/ui/model/Filter'
    , "sap/ui/core/Fragment","ER/zferbranchmanage/model/fragment","sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Sorter,Filter,Fragment,fragment,MessageToast) {
        "use strict";

        return Controller.extend("ER.zferbranchmanage.controller.Main", {
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
                stat: function (sStatusTxt) {
                  switch (sStatusTxt) {
                    case "점검필요":
                      return 1;
                    case "수리필요":
                      return 2;
                    case "수리중":
                      return 8;
                    case "대여가능":
                      return 7;
                    case "대여중":
                      return 6;
                    case "폐차":
                      return 3;
                    case "신규":
                      return 4;              
                    default:
                      return 5;
                  }
                },
                castatus: function(sStatusTxt){
                  switch (sStatusTxt) {
                    case "대여중":
                      return 2;
                    case "대여가능":
                      return 1;
                    case "점검필요":
                      return 3;
                    case "수리필요":
                      return 4;
                    case "수리중":
                      return 5;
                    case "폐차":
                      return 6;
                    case "신규":
                      return 7;
                  }
                },
                formatAvailableToObjectState:function(oNum){
                  var num = parseInt(oNum, 10);
                  var formattedNum = num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                  return formattedNum;
                }
              },
              onInit: function () {
                // root path 추가
                var ozModel = new JSONModel();
                if(_rootPath){
                  
                  ozModel.loadData(_rootPath+"/model/oz.json");
                  this.getView().setModel(ozModel, "ozModel");
                }
                this.byId('map').setHeight('500px');
                this.byId('map').setWidth('500px');
                // 기존
                // var ozModel = new JSONModel();
                // ozModel.loadData("/model/oz.json");
                // this.getView().setModel(ozModel, "ozModel");
        
                this._defaultSet();
                this.oModel.read("/EmployeeSet", {
                  success: function (oReturn) {
                    console.log(oReturn);
                    // this.byId('nowBranch').setText(oReturn.results[0].Branch);
                    // this.byId('idName').setText(oReturn.results[0].Name + ' ' + oReturn.results[0].Rankname);
                  }.bind(this),
                });
        
                this.oModel.read("/my_carSet", {
                  success: function (oReturn) {
                    console.log(oReturn);
                    var sLength = oReturn.results.length;
                    var sPossible = 0;
                    var sImpossible = 0;
                    var sRepair = 0;
                    var sReq = 0;
                    var sNew = 0;
                    var sIns = 0;
                    for (var i = 0; i < sLength; i++) {
                      var StatusTxt = oReturn.results[i].StatusTxt;
                      if (StatusTxt === "수리중") {
                        sRepair += 1;
                      } else if (StatusTxt === "대여가능") {
                        sPossible += 1;
                      } else if (StatusTxt === "대여중") {
                        sImpossible += 1;
                      } else if (StatusTxt === "수리필요") {
                        sReq += 1;
                      } else if (StatusTxt === "점검필요") {
                        sIns += 1;
                      } else {
                        sNew += 1;
                      }
                    }
                    // this.byId("idTile0").setValue(sLength);
                    // this.byId("idTile1").setValue(sPossible);
                    // this.byId("idTile2").setValue(sImpossible);
                    // this.byId("idTile3").setValue(sIns);
                    // this.byId("idTile4").setValue(sReq);
                    // this.byId("idTile5").setValue(sRepair);
                    // this.byId("idTile6").setValue(sJunk);
        
                    var aCount = [sLength,sPossible,sImpossible,sIns,sReq,sRepair,sNew];
        
                    for(var i = 0; i<aCount.length; i++){
                      var id = 'idTile'+i;
                      if(aCount[i] === 0){              
                          this.byId(id).setValue(aCount[i]);                                    
                        }else{
                          this.byId(id).setValue(aCount[i]);                
                        }
                      }
                    }.bind(this),
                });
              },
              _defaultSet: function () {
                // oData Model 변수 세팅
                this.oModel = this.getOwnerComponent().getModel();
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oMap = this.getView().byId("map");
                this.WholeCarTable = this.getView().byId('wholeCarTable');
              },
              onClickSpot: function (oEvent) {
        
                var spot = oEvent.getSource();
                var branch = spot.getTooltip().substr(0,4);
                var oz = spot.getTooltip().substr(5,10);
        
                this.oRouter.navTo("RouteDetail", {
                  branch: branch,
                  oz : oz
                });
              },
              onSearch: function () {
                var selectedKey = this.byId("idBranchCombo").getSelectedKey();

                if(!selectedKey){
                  MessageToast.show('지점을 선택해주세요!');
                  return;
                }

                var ozData = this.getView().getModel("ozModel");
                var length = ozData.getProperty("/Spots/items/").length;
                var pos;
                for (var i = 0; i < length; i++) {
                  var ozName = ozData.getProperty("/Spots/items/")[i].OZNAME;
                  if (ozName === selectedKey) {
                    pos = ozData.getProperty("/Spots/items/")[i].pos;
                    break;
                  }
                }
                this.byId("map").setCenterPosition(pos);
                this.byId("map").setZoomlevel(17);
                MessageToast.show(selectedKey + '\r\n 이동되었습니다.')
              },
              onCenter:function(){
                var center = "126.9779692;37.566535;0";
                this.byId("map").setCenterPosition(center);
                this.byId("map").setInitialZoom('12');
              },
              onClusterClick: function (oEvent) {
                var oCluster = oEvent.getSource();
                var aSpots = [];
        
                var oItemsAggregation = oCluster.getAggregation("items");
                if (oItemsAggregation) {
                  aSpots = oItemsAggregation.map(function (oClusterItem) {
                    return oClusterItem.getBindingContext("ozModel").getObject();
                  });
                }
        
                aSpots.forEach(function (oSpot) {
                  var sBranch = oSpot.BRANCH;
                  console.log("Spot Branch:", sBranch);
                });
              },
              onFirstPress: function (oEvent) {
                var oDialog = this.byId("Whole");
                var that = this;
                var oTable = this.byId("wholeCarTable");        
                var aFilters = [];
         
                this.sCondition = oEvent.getSource().mProperties.header.replace(' ','');
                // sCondition = this.formatter.castatus(sCondition);

                if(!this.oDialog){
                  this.oDialog = Fragment.load({
                    id : this.getView().getId(),
                    name: "ER.zferbranchmanage.view.fragments.WholeCar",                                                             
                    controller : this
                  });
                }
                
                var that = this;
                this.oDialog.then(function(oDialog){
                  var oTable = that.byId("wholeCarTable");       
                  that.byId('tableTitle').setTitle(this.sCondition);
                  that.byId('tableTitle').setText(this.sCondition);                     
                  that.getView().addDependent(oDialog);
                  oTable.getBinding("rows").filter([]);
                  oDialog.open();
                }.bind(this))              

              },
              onClose: function (oEvent) {
                var oDialog = oEvent.getSource().getParent();
                oDialog.close();
              },
              closeDialog : function(oEvent){
                oEvent.getSource().getParent().close();
                this.byId('SearchField').setValue('');
              },        
              handleSortButtonPressed: function () {                
                 var that = this;
                 if(!this.sortDialog){
                  this.sortDialog = Fragment.load({
                    id : this.getView().getId(),
                    name: "ER.zferbranchmanage.view.fragments.SortDialog",                    
                    controller : this
                  });
                }
                this.sortDialog.then(function(oDialog){                  
                  that.getView().addDependent(oDialog);              
                  oDialog.open();
                }.bind(this))                                 
              },
              handleSortDialogConfirm: function (oEvent) {
                // 선택된 sort 적용
                var oTable = this.byId("wholeCarTable");

                if (oTable) {
                  var oBinding = oTable.getBinding("rows");

                  if (oBinding) {
                    var mParams = oEvent.getParameters();
                    var sPath = mParams.sortItem.getKey();
                    var bDescending = mParams.sortDescending;

                    // Clear any existing sorters
                    oBinding.sort();

                    // Apply the selected sort
                    if (sPath) {
                      var oSorter = new sap.ui.model.Sorter(sPath, bDescending);
                      oBinding.sort(oSorter);
                    }
                  } else {
                    console.error("Table binding not found");
                  }
                } else {
                  console.error("Table not found");
                }
              },
              handleFilterButtonPressed: function () {
                var that = this;
                if(!this.filterDialog){
                 this.filterDialog = Fragment.load({
                   id : this.getView().getId(),
                   name: "ER.zferbranchmanage.view.fragments.Filter",                    
                   controller : this
                 });
               }
               this.filterDialog.then(function(oDialog){                  
                 that.getView().addDependent(oDialog);              
                 oDialog.open();
               }.bind(this))
           
              },
              onTilePress : function(oEvent){
                var that = this;
                var oTable = this.byId("wholeCarTable");
                var oDialog = this.byId("Whole");
                var aFilters = [];
                                
                var sCondition = oEvent.getSource().mProperties.header.replace(' ','');
                this.sCondition = sCondition;
                sCondition = this.formatter.castatus(sCondition);

                // 새로 시도
                if (!this.oDialog) {
                  this.oDialog = Fragment.load({
                    id : this.getView().getId(),
                    name: "ER.zferbranchmanage.view.fragments.WholeCar",
                    controller: this
                  });
                }
                var that = this;
                this.oDialog.then(function(oDialog) {
                  // var oTable = sap.ui.core.Fragment.byId("ER.zferbranchmanage.view.fragments.WholeCar", "wholeCarTable");
                  var oTable = that.byId("wholeCarTable");
                  var oFilter = new Filter('Castatus', sap.ui.model.FilterOperator.EQ, sCondition);                  
                  aFilters.push(oFilter);

                  that.getView().addDependent(oDialog);
                  that.byId('tableTitle').setTitle(this.sCondition);
                  that.byId('tableTitle').setText(this.sCondition);
                  oTable.getBinding("rows").filter(aFilters);
                  oDialog.open();
                }.bind(this));

              },
              openDialogWithFilters: function(oDialog, oTable, aFilters) {                
                oTable.getBinding("rows").filter(aFilters);        
                oDialog.open();  

                // var that = this;
                // oTable.getBinding("rows").filter(aFilters);
                // that.getView().addDependent(oDialog);
                // oDialog.open();
              },   
              // // 타일 때문에 추가
              // loadFragment: function(options) {
              //   return Fragment.load(options);
              // },
              onPressLegend : function(){
                // toolbar btn
                if (this.byId("map").getLegendVisible() == true) {
                  this.byId("map").setLegendVisible(false);
                  this.byId("btnLegend").setTooltip("Show legend");
                } else {
                  this.byId("map").setLegendVisible(true);
                  this.byId("btnLegend").setTooltip("Hide legend");
                }
              },
              onCarSearch : function(oEvent){
                // var aFilters = [];
                // var oTable = this.byId("wholeCarTable");
                // var oBinding = oTable.getBinding("rows");
                // // var oNowFilters = oBinding.aFilters[0]; // 현재 적용된 필터 가져오기
                // var sQuery = oEvent.getParameter("query");
                // var tableTitle = this.byId("tableTitle").getText();
                // // 전체 보유차량의 경우 oBinding.aFilters[0]가 undefine
                // if(oBinding.aFilters[0] == ''){
                //   var oNowFilters = [];
                // }else{
                //   var oNowFilters = oBinding.aFilters[0];
                // }
        
                // if(!sQuery){
                //   // 전체 보유 차량의 oNowFilters는 []로
                //   // 차량 상태별 oNowFilters는 차량 상태로
                //   oTable.getBinding("rows").filter(oNowFilters);
                // }else{
                //   // 전체 보유 차량의 + sQuery
                //   // 차량 상태별  보유차량 상태 +sQuery
                //   var oFilter = new Filter('Carid', sap.ui.model.FilterOperator.EQ, sQuery);
                
                //   if (oNowFilters) {
                //     aFilters.push(oNowFilters);
                //   }
                //   aFilters.push(oFilter);
                //   oBinding.filter(aFilters);
                // }

                var aFilters = [];
                var oTable = this.byId("wholeCarTable");
                var oBinding = oTable.getBinding("rows");
                var oNowFilters = oBinding.aFilters[0]; // 현재 적용된 필터 가져오기
                var sQuery = oEvent.getParameter("query");
                var tableTitle = this.byId("tableTitle").getText();

                if(tableTitle.length >5 && !sQuery){
                  oTable.getBinding("rows").filter([]);
                }else if(tableTitle.length >5 && sQuery){
                  var oFilter = new Filter('Carid', sap.ui.model.FilterOperator.EQ, sQuery);
                  aFilters.push(oFilter);
                  oBinding.filter(aFilters);
                }else if(oNowFilters && !sQuery){
                  aFilters.push(oNowFilters);
                  oBinding.filter(aFilters);
                }else{

                  var oFilter = new Filter('Carid', sap.ui.model.FilterOperator.EQ, sQuery);
                  aFilters.push(oNowFilters);
                  aFilters.push(oFilter);
                  oBinding.filter(aFilters);
                }
                
              }
        });
    });
