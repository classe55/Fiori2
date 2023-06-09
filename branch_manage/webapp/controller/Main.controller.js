sap.ui.define(
  ["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel",'sap/ui/model/Sorter','sap/ui/model/Filter'],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller,JSONModel,Sorter,Filter) {
    "use strict";

    return Controller.extend("branchmanage.controller.Main", {
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
        var ozModel = new JSONModel();
        ozModel.loadData("/model/oz.json");
        this.getView().setModel(ozModel, "ozModel");

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
        // this.byId('map').setInitialPosition(pos);
        this.byId("map").setCenterPosition(pos);
        this.byId("map").setZoomlevel(15);
      },
      onCenter:function(){
        var center = "126.9779692;37.566535;0";
        this.byId("map").setCenterPosition(center);
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

        console.log(oEvent);
        // var sCondition = oEvent.getSource().mProperties.header.replace(' ','');
        // sCondition = this.formatter.castatus(sCondition);

        if (oDialog) {
          // var oFilter = new Filter('Castatus', sap.ui.model.FilterOperator.All, sCondition);
          // aFilters.push(oFilter);
          this.openDialogWithFilters(oDialog, oTable, aFilters);
          return;
        }
        this.loadFragment({
          name: "branchmanage.view.fragments.WholeCar",
        }).then(function (oDialog) {
          oDialog.open();
        }, this);
      },
      onClose: function (oEvent) {
        var oDialog = oEvent.getSource().getParent();
        oDialog.close();
      },

      handleSortButtonPressed: function () {
        // fragment sort
        var oDialog = this.byId("Sort");

        if (oDialog) {
          oDialog.open();
          return;
        }
        this.loadFragment({
          name: "branchmanage.view.fragments.SortDialog",
        }).then(function (oDialog) {
          oDialog.open()
        }, this);
      },
      handleSortDialogConfirm: function (oEvent) {
        // 선택된 sort 적용
        var oTable = this.byId("wholeCarTable");
        var mParams = oEvent.getParameters();
        var oBinding = oTable.getBinding("rows");
        var sPath = mParams.sortItem.getKey();
        var bDescending = mParams.sortDescending;

        // Clear any existing sorters
        oBinding.sort();

        // Apply the selected sort
        if (sPath) {
          var oSorter = new sap.ui.model.Sorter(sPath, bDescending);
          oBinding.sort(oSorter);
        }
      },
      handleFilterButtonPressed: function () {
        var oDialog = this.byId("Filter");

        if (oDialog) {
          oDialog.open();
          return;
        }
        this.loadFragment({
          name: "branchmanage.view.fragments.Filter",
        }).then(function (oDialog) {
          oDialog.open();
        }, this);
      },
      handleFilterDialogConfirm: function (oEvent) {
        var oTable = this.byId("wholeCarTable");
        var mParams = oEvent.getParameters();
        var oBinding = oTable.getBinding("rows");
        
        var aFilters = [];

        mParams.filterItems.forEach(function (oItem) {          
          var aSplit = oItem.getKey();          
          var oFilter = new Filter('Castatus', sap.ui.model.FilterOperator.EQ, aSplit);
          aFilters.push(oFilter);         
          
        });

        oBinding.filter(aFilters);
   
      },
      onTilePress : function(oEvent){
        var that = this;
        var oTable = this.byId("wholeCarTable");
        var oDialog = this.byId("Whole");
        var aFilters = [];
        
        console.log(oEvent);
        var sCondition = oEvent.getSource().mProperties.header.replace(' ','');
        sCondition = this.formatter.castatus(sCondition);
        

        if (oDialog) {
          // 기존
          var oFilter = new Filter('Castatus', sap.ui.model.FilterOperator.EQ, sCondition);
          aFilters.push(oFilter);
          this.openDialogWithFilters(oDialog, oTable, aFilters);
          return;
        }
        
        this.loadFragment({
          name: "branchmanage.view.fragments.WholeCar",
        }).then(function(oDialog) {
          var oFilter = new Filter('Castatus', sap.ui.model.FilterOperator.EQ, sCondition);
          aFilters.push(oFilter);
          that.openDialogWithFilters(oDialog, oTable, aFilters);
        }, this);

      },

      openDialogWithFilters: function(oDialog, oTable, aFilters) {
        oTable.getBinding("rows").filter(aFilters);        
        oDialog.open();  
      },      
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
        var aFilters = [];
        var oTable = this.byId("wholeCarTable");
        var sQuery = oEvent.getParameter("query");

        if(!sQuery){
          oTable.getBinding("rows").filter(aFilters);
        }else{
          var oFilter = new Filter('Carid', sap.ui.model.FilterOperator.EQ, sQuery);
        aFilters.push(oFilter);
        oTable.getBinding("rows").filter(aFilters);
        }
        
      }
    }); //extend
  }
);
