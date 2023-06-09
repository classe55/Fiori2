sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Filter,JSONModel) {
        "use strict";

        return Controller.extend("exprograme12.controller.Main", {
          onInit: function () {
            this._defaultSet();

            this.oModel.read("/carrierSet", {
              urlParameters: {
                $expand: "to_Item",
              },
              // filters : [oFilter],
              success: function (oReturn) {
                // 경로안에 데이터 반환
                console.log(oReturn.results[0].to_Item.results.length);
              }.bind(this),
              error: function () {
                sap.m.MessageToast.show("Error!");
              },
            });

          },
          _defaultSet: function () {
            // oData Model 변수 세팅
            this.oModel = this.getOwnerComponent().getModel();
            // rev Model
            this.oRevModel = new JSONModel();
            this.getView().setModel(this.oRevModel, "RevModel");
            // oData table 객체
            this.oTable = this.byId("idCarrierTable");                        
          },         
          onSearch: function () {
            var sInput = this.byId("idInput").getValue();
            var sComboBox = this.byId("idComboBox").getSelectedKey();
            var sComboBoxText = this.byId("idComboBox").getValue();
            var oFilter;

            // (추가 사항) 콤보박스의 값이 콤보박스 리스트 아이템 중 하나가 아닌 경우 setValueState error 처리
            if(!["USD", "EUR", "KRW",""].includes(sComboBoxText)){                
              this.byId("idComboBox").setValueState("Error");
              this.byId("idComboBox").setValueStateText("유효한 Code를 선택해주세요");
              return;
            }
            if (!sInput && !sComboBox) {
              // 둘 다 비어 있는 경우 전체 데이터 조회
              oFilter = [];
            } else if (sInput && sComboBox) {
              // 두 가지 데이터에 맞춰 데이터 조회
              oFilter = new Filter({
                filters: [
                    new Filter("Currcode","EQ",sComboBox),
                    new Filter("Carrname","Contains",sInput)
                ],
                and: true,
              });
            } else if (sInput) {
              // 검색어로 데이터 조회
              oFilter = new Filter("Carrname","Contains",sInput);             
            } else {
              // 콤보박스 값으로 데이터 조회
              oFilter = new Filter("Currcode","EQ",sComboBox);
            }
            // 콤보박스 값이 유효한 경우 setValueState 초기화
            this.byId("idComboBox").setValueState("None");

            this.byId("idCarrierTable").getBinding("items").filter(oFilter);
          },
          getLength: function (oItems) {
            // 각 항공사(Header)의 항공편(Item) 총 개수 표시
            return oItems ? oItems.length : 0;
          },
          onButtonPress: function (oEvent) {
            // console.log(oEvent.getSource());
            let sPath = oEvent.getSource().getBindingContext().sPath; // /carrierSet('AA')"

            // carridset('aa')를 성공적으로 읽으면 dialog open
            this.oModel.read(sPath, {
              urlParameters: { $expand: "to_Item" },
              success: function (oReturn) {
                this.oRevModel.setProperty("/", oReturn.to_Item.results); // RevModel에 to_Items 데이터 세팅.

                // < 추가 사항 >
                this.oRevModel.setProperty("/currency", oReturn.Currcode); // 예약 상세에 가격과 currcode 추가

                var oDialog = this.byId("Dialog");
                if (oDialog) {
                  this.byId("Dialog").setTitle(oReturn.Carrname);                  
                  oDialog.open();
                  return;
                }
                this.loadFragment({
                  name: "exprograme12.view.fragment.reservation",
                }).then(function (oDialog) {
                  this.byId("Dialog").setTitle(oReturn.Carrname);                  
                  oDialog.open();
                }, this);
              }.bind(this),
              error: function () {
                sap.m.MessageToast.show("Error!");
              },
            });
          },
          onClose: function (oEvent) {
            var oDialog = oEvent.getSource().getParent();
            this.byId("Chart").setVizType("stacked_column");
            oDialog.close();
          },

          onChartSearch: function(){
            // 추가사항 (차트 타입에 맞춰 차트 변화)
            var sCombotype = this.byId("idChartType").getSelectedKey();
            this.byId("Chart").setVizType(sCombotype);

          },
          onBeforeOpen: function(){
            this.byId("idChartType").setSelectedKey("stacked_column");
          }
        });// extend
    }); // define
