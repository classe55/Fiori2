sap.ui.define(
    ["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel",'sap/ui/model/Filter',
    
    "sap/tnt/NavigationList","sap/tnt/NavigationListItem","sap/ui/core/Fragment"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Filter,NavigationList,NavigationListItem,Fragment) {
      "use strict";
      var branch2 = '';
  
      return Controller.extend("bm.controller.Detail", {
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
            }
          },
          formatAvailableToObjectState:function(oNum){
            var num = parseInt(oNum, 10);
            var formattedNum = num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            return formattedNum;
          }
        },
        onInit: function () {
            this._defaultSet();                
            this.oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched , this);
            
            var ozModel = new JSONModel();
            ozModel.loadData("/model/oz.json");
            this.getView().setModel(ozModel, "ozModel");
            console.log(this.getView().getModel("ozModel"));
      
        },
        _defaultSet : function(){                                           
            this.oRouter = this.getOwnerComponent().getRouter();  
            this.oModel = this.getOwnerComponent().getModel(); 
            this.oTable = this.byId('DetailTable');
            this.oInsTable = this.byId('InspectionTable');
            this.oz;
        },
        _onPatternMatched: function(oEvent){
          var oArgs = oEvent.getParameter("arguments");
          // this.byId('idDetailTitle').setTitle(oArgs.branch + ' 지점 ' + ' 상세정보 ');
          this.byId('idDetailTitle').setText(oArgs.branch + ' 지점 ' + ' 상세정보 ');

          branch2 = oArgs.branch;

          var oz = oArgs.oz;
          this.oz = oArgs.oz; // 전역변수로
          var branch = oArgs.branch;
          this.byId('TileheaderTot').setHeader(branch + ' 보유차량');

          var oRootItem;
          var aItems = this.byId('navigationList').getItems();
          for (var i = 0; i < aItems.length; i++) {
            if (aItems[i].getText() === branch) {
              oRootItem = aItems[i];
              break;
            }
          }

          if (!oRootItem) {
            // Branch가 일치하는 NavigationListItem만 보여주기
            var aExistingItems = this.byId('navigationList').getItems();
            for (var j = 0; j < aExistingItems.length; j++) {
              if (aExistingItems[j].getText() !== branch) {
                this.byId('navigationList').removeItem(aExistingItems[j]);
              }
            }

            oRootItem = new sap.tnt.NavigationListItem({
              text: branch,
              expanded: true,
              icon: "sap-icon://building"
            });
            this.byId('navigationList').addItem(oRootItem);
          }

          var aSubItems = oRootItem.getItems();
          var isSubItemExist = false;
          for (var k = 0; k < aSubItems.length; k++) {
            if (aSubItems[k].getText() === oz) {
              isSubItemExist = true;
              break;
            }
          }

          if (!isSubItemExist) {
            // 모든 oz를 추가하기
            this.oModel.read("/my_carSet", {
              success: function(oReturn) {
                console.log(oReturn);
                var existingSubItems = [];
                for (var i = 0; i < oReturn.results.length; i++) {
                  var currentOz = oReturn.results[i].Homeoz;
                  if (currentOz.indexOf(branch) === 0 && existingSubItems.indexOf(currentOz) === -1) {
                    var oSubItem = new sap.tnt.NavigationListItem({
                      id: "navigationItem_" + currentOz,
                      text: currentOz,
                      key: currentOz
                    });
                    oRootItem.addItem(oSubItem);                                       
                    oSubItem.attachSelect(this.onNavigationItemSelect.bind(this));
                    existingSubItems.push(currentOz);
                  }
                }
              }.bind(this),
              error: function() {
                console.log('read error 발생');
              }
            });
          }

          // 지점 차량 Cnt tile 설정하기.
          this.oModel.read("/my_carSet", {
            success: function(oReturn){
              var tot = 0;
                var sPossible = 0;
                var sImpossible = 0;
                var sReq = 0;
                var sRepair = 0;
                var sIns = 0;
              for(var i =0; i<oReturn.results.length; i++){
                var Homeoz = oReturn.results[i].Homeoz.substr(0,4);
                var StatusTxt = oReturn.results[i].StatusTxt;                
                if(Homeoz === oArgs.branch){
                  tot += 1;
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
                  } 
                }
              }
              var aCount = [tot,sPossible,sImpossible,sIns,sReq,sRepair];
              var aTileId = ['TileheaderTot','TileheaderPossible','TileheaderImpossible','TileheaderIns','TileheaderReq','TileheaderRep']
        
              for(var i = 0; i<aCount.length; i++){
                var id = 'idDetailTile'+i;                              
                    this.byId(id).setValue(aCount[i]);
                    if(aCount[i] === '0'){
                      this.byId(aTileId[i]).setPressEnabled(false);
                    }                                                    
                }
              
                this.byId('navigationList').setSelectedKey(oArgs.oz);
            }.bind(this)
          });
        },
        onNavigationItemSelect : function(oEvent){
          var oSelectedItem = oEvent.getSource();
          var sSelectedItemId = oSelectedItem.getId();
          var condition = this.oTable.getVisible();

          if(condition){
            this.oTable.setVisible(false);
          }
          console.log(sSelectedItemId);
          // 선택된 NavigationListItem의 id에서 oz 정보 추출
          var sSelectedOz = sSelectedItemId.split("navigationItem_")[1];
          // console.log(sSelectedOz);
          this.byId('TileheaderTot').setHeader(sSelectedOz + ' 보유차량');
          this.byId("TileheaderPossible").setSubheader(sSelectedOz);
          this.byId("TileheaderImpossible").setSubheader(sSelectedOz);
          this.byId("TileheaderIns").setSubheader(sSelectedOz);
          this.byId("TileheaderReq").setSubheader(sSelectedOz);
          this.byId("TileheaderRep").setSubheader(sSelectedOz);

          this.oModel.read("/my_carSet", {
            success: function (oReturn) {
              // console.log(oReturn);
              var tot = 0;
              var sPossible = 0;
              var sImpossible = 0;
              var sRepair = 0;
              var sReq = 0;
              var sJunk = 0;
              var sIns = 0;
              for(var i=0; i<oReturn.results.length;i++){
                var currentOz = oReturn.results[i].Homeoz;
                var StatusTxt = oReturn.results[i].StatusTxt;
                
                if (currentOz === sSelectedOz) {
                  tot += 1;
                  if (StatusTxt === "수리중") {
                  } else if (StatusTxt === "대여가능") {
                    sPossible += 1;
                  } else if (StatusTxt === "대여중") {
                    sImpossible += 1;
                  } else if (StatusTxt === "수리필요") {
                    sReq += 1;
                  } else if (StatusTxt === "수리중") {
                    sRepair += 1;
                  } else if (StatusTxt === "점검필요") {
                    sIns += 1;
                  } else {
                    sJunk += 1;
                  }
                }
              }
              var aCount = [tot,sPossible,sImpossible,sIns,sReq,sRepair];        
              for(var i = 0; i<aCount.length; i++){
                var id = 'idDetailTile'+i;                           
                    this.byId(id).setValue(aCount[i]);                                                                  
                }
            }.bind(this)//success
          });
          
        },
        onFirstPress : function(oEvent){         
          var tileTitle = oEvent.getSource().mProperties.header.replace(' ','');
          var condition = this.oTable.getVisible();
          var oBinding = this.oTable.getBinding("rows");
          var aFilters = [];

          // if(condition){
          //   this.oTable.setVisible(false);
          // }else{
            this.oTable.setVisible(true);
            // this.byId('titleId').setText(this.oz.substr(0,8) + ' 정보');
            aFilters = [];
            if(tileTitle.length < 10){
              // 지점 this.oz.substr(0,4)               
              var oFilter = new Filter('Branch', sap.ui.model.FilterOperator.EQ , this.oz.substr(0,4));
              aFilters.push(oFilter);
              oBinding.filter(aFilters);              
            }else{
              // oz tileTitle.substr(0,8)
              var oFilter = new Filter('Homeoz', sap.ui.model.FilterOperator.EQ, tileTitle.substr(0,8));
              aFilters.push(oFilter);
              oBinding.filter(aFilters);
            }

          // }                  
        },
        InsBtnPress : function(oEvent){
          var that = this;          
          // var oDialog = this.byId("Inspection");
          var aFilters = [];
          // var oInsTable = this.byId('InspectionTable');
                    
          var aSelectedIndices = this.oTable.getSelectedIndices();
          if (aSelectedIndices.length === 0) {
            sap.m.MessageToast.show("차량을 선택해주세요!");
            return;
          }
          var oSelectedRow = this.oTable.getContextByIndex(aSelectedIndices).getObject();
          // console.log(oSelectedRow.Carid);
          
          
          // 기존

          // if (oDialog) {
          //   var oFilter = new Filter('Carid', sap.ui.model.FilterOperator.EQ, oSelectedRow.Carid);
          //   aFilters.push(oFilter);
          //   this.openInsDialogWithFilters(oDialog, oInsTable, aFilters);
          //   return;
          // }
          
          // this.loadFragment({
          //   name: "bm.view.fragments.Inspection",
          // }).then(function(oDialog) {
          //   var oFilter = new Filter('Carid', sap.ui.model.FilterOperator.EQ, oSelectedRow.Carid);
          //   aFilters.push(oFilter);
          //   that.openInsDialogWithFilters(oDialog, oInsTable, aFilters);
          // }, this);

          if (!this.oDialog) {
            this.oDialog = Fragment.load({
              id : this.getView().getId(),
              name: "bm.view.fragments.Inspection",
              controller: this
            });
          }
          var that = this;
          this.oDialog.then(function(oDialog) {
            var oInsTable = this.byId('InspectionTable');
            var oFilter = new Filter('Carid', sap.ui.model.FilterOperator.EQ, oSelectedRow.Carid);                
            aFilters.push(oFilter);
            that.getView().addDependent(oDialog);
            oInsTable.getBinding("rows").filter(aFilters);
            oDialog.open();
          }.bind(this));


          
        },
        RepBtnPress : function(oEvent){
          var that = this;          
          // var oRepDialog = this.byId("repair");
          var oRepDialog;
          var aFilters = [];
          var oRepTable = this.byId('repairTable');
          
          var aSelectedIndices = this.oTable.getSelectedIndices();
          if (aSelectedIndices.length === 0) {
            sap.m.MessageToast.show("차량을 선택해주세요!");
            return;
          }
          var oSelectedRow = this.oTable.getContextByIndex(aSelectedIndices).getObject();      
          // 새로

          if (!this.oRepDialog) {
            this.oRepDialog = Fragment.load({
              id : this.getView().getId(),
              name: "bm.view.fragments.repair",
              controller: this
            });
          }          
          this.oRepDialog.then(function(oDialog) {
            var oRepTable = this.byId('repairTable');
            var oFilter = new Filter('Carid', sap.ui.model.FilterOperator.EQ, oSelectedRow.Carid);                
            aFilters.push(oFilter);
            this.getView().addDependent(oDialog);
            oRepTable.getBinding("rows").filter(aFilters);
            oDialog.open();
          }.bind(this));
          
        },
        RetBtnPress : function(oEvent){
          var that = this;          
          // var oRetDialog = this.byId("rental");
          var oRetDialog ;
          var aFilters = [];
          // var oRenTable = this.byId('rentalTable');
          
          // console.log(oEvent);
          var aSelectedIndices = this.oTable.getSelectedIndices();
          if (aSelectedIndices.length === 0) {
            sap.m.MessageToast.show("차량을 선택해주세요!");
            return;
          }
          var oSelectedRow = this.oTable.getContextByIndex(aSelectedIndices).getObject();

          // 새로

          if (!this.oRetDialog) {
            this.oRetDialog = Fragment.load({
              id : this.getView().getId(),
              name: "bm.view.fragments.Rental",
              controller: this
            });
          }

          this.oRetDialog.then(function(oDialog) {
            var oRenTable = this.byId('rentalTable');
            var oFilter = new Filter('Carid', sap.ui.model.FilterOperator.EQ, oSelectedRow.Carid);                
            aFilters.push(oFilter);
            this.getView().addDependent(oDialog);
            oRenTable.getBinding("rows").filter(aFilters);
            oDialog.open();
          }.bind(this));
        },
        openInsDialogWithFilters: function(oDialog, oInsTable, aFilters) {
          oInsTable.getBinding("rows").filter(aFilters);
          oDialog.open();  
        }, 
        openRepDialogWithFilters: function(oDialog, oRepTable, aFilters) {
          oRepTable.getBinding("rows").filter(aFilters);
          oDialog.open();  
        }, 
        openRentalDialogWithFilters: function(oDialog, oRenTable, aFilters) {
          oRenTable.getBinding("rows").filter(aFilters);
          oDialog.open();  
        }, 
        onClose : function(oEvent){
          var oDialog = oEvent.getSource().getParent();
          oDialog.close();
        },
        closeDialog : function(oEvent){
          oEvent.getSource().getParent().close();
        },
        onBackPress : function(){
          this.oTable.setVisible(false);
          this.oRouter.navTo("RouteMain", {});
        },
        onSecPress : function(oEvent){
          var tileTitle = oEvent.getSource().mProperties.header.replace(' ','');
          var tileSubTitle = this.byId('TileheaderPossible').getSubheader();
          var condition = this.oTable.getVisible();
          var oBinding = this.oTable.getBinding("rows");
          var sCondition = oEvent.getSource().mProperties.header.replace(' ','');
          sCondition = this.formatter.castatus(sCondition);

          // if(condition){
          //   this.oTable.setVisible(false);
          // }else{
            this.oTable.setVisible(true); 
            if(tileSubTitle){              
              let oFilter = new Filter({
                filters: [                  
                  new Filter('Homeoz', sap.ui.model.FilterOperator.EQ ,tileSubTitle),
                  new Filter('Castatus', sap.ui.model.FilterOperator.EQ, sCondition),
                ],
                and: false,
              });
              oBinding.filter([oFilter][0].aFilters);  
               
            }else{
              let oFilter = new Filter({
                filters: [
                  new Filter('Branch', sap.ui.model.FilterOperator.EQ , this.oz.substr(0,4)),
                  new Filter('Castatus', sap.ui.model.FilterOperator.EQ, sCondition),
                ],
                and: false,
              });
              oBinding.filter([oFilter][0].aFilters);
            }

          // } 

        },
        handleSortButtonPressed : function(){
          // fragment sort
        var oDialog = this.byId("Sort");

        // if (oDialog) {
        //   oDialog.open();
        //   return;
        // }
        // this.loadFragment({
        //   name: "bm.view.fragments.SortDialog",
        //   Controller : this
        // }).then(function (oDialog) {
        //   this.getView().addDependent(oDialog);
        //   oDialog.open()
        // }, this);

        if (!this.oDialog) {
          this.oDialog = Fragment.load({
            id : this.getView().getId(),
            name: "bm.view.fragments.SortDialog",
            controller: this
          });
        }
        var that = this;
        this.oDialog.then(function(oDialog) {
          that.getView().addDependent(oDialog);
          oDialog.open();
        });


        },
        handleSortDialogConfirm: function (oEvent) {
          // 선택된 sort 적용
          var oTable = this.byId("DetailTable");
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
        onBranchPress : function(){
          // 지점 차량 Cnt tile 설정하기.
          this.oModel.read("/my_carSet", {
            success: function(oReturn){
              var tot = 0;
                var sPossible = 0;
                var sImpossible = 0;
                var sReq = 0;
                var sRepair = 0;
                var sIns = 0;
              for(var i =0; i<oReturn.results.length; i++){
                var Homeoz = oReturn.results[i].Homeoz.substr(0,4);
                var StatusTxt = oReturn.results[i].StatusTxt;                
                if(Homeoz === branch2){
                  tot += 1;
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
                  } 
                }
              }
              var aCount = [tot,sPossible,sImpossible,sIns,sReq,sRepair];
              var aTileId = ['TileheaderTot','TileheaderPossible','TileheaderImpossible','TileheaderIns','TileheaderReq','TileheaderRep']
        
              for(var i = 0; i<aCount.length; i++){
                var id = 'idDetailTile'+i;            
                    if(i === 0){
                      this.byId('TileheaderTot').setHeader(branch2 + ' 보유차량');
                    }                  
                    this.byId(id).setValue(aCount[i]);
                    if(aCount[i] === '0'){
                      this.byId(aTileId[i]).setPressEnabled(false);
                    }                                                    
                }
              
                
            }.bind(this)
          });

        }
        
      });
    }
  );
  