sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/Filter"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Filter) {
    "use strict";

    return Controller.extend("nt.zprojectodatae1203.controller.Main", {
      formatter: {
        onSum: function (a, b) {
          return a + b;
        },
        dateTime: function (oDate) {
          let oDateTimeInstance;
          oDateTimeInstance = sap.ui.core.format.DateFormat.getDateTimeInstance(
            {
              pattern: "yyyy-MM-dd hh:mm",
            }
          );

          return oDateTimeInstance.format(oDate);
        },
      },
      onInit: function () {},
      onSearch: function () {
        // (기존) 필터 객체 생성.
        let oOrderDate = this.byId("idOrderDate").getDateValue();
        let sInputValue = Number(this.byId("idOrderID").getValue());
        let oFilter = new Filter({
          filters: [
            new Filter({ path: 'OrderID', operator: "EQ", value1: sInputValue}),
            new Filter({ path: 'OrderDate',operator: 'GE', value1: oOrderDate}),
          ],
          and: false // false면 or
        });
        this.byId("idOrdersTable").getBinding("items").filter([oFilter]);    // sap.m.Table은 items에 items="{/Orders}"
      },
    }); // Controller.extend
  } // function (Controller)
); // define
