sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("zrental.controller.Main", {
      onInit: function () {
        var oData = {
          ProductCollection: [
            { CTY: "CTY01", Branch: "강북", Color: "Red", path: "" },
            { CTY: "CTY02", Branch: "강북", Color: "Blue", path: "" },
            { CTY: "CTY03", Branch: "강북", Color: "Green", path: "" },
            { CTY: "CTY04", Branch: "강북", Color: "Midnight blue", path: "" },
            { CTY: "CTY05", Branch: "강북", Color: "Brown", path: "" },
            { CTY: "CTY06", Branch: "강북", Color: "Orange", path: "" },
            { CTY: "CTY07", Branch: "강북", Color: "Violet", path: "" },
            { CTY: "CTY08", Branch: "강북", Color: "Navy blue", path: "" },
            { CTY: "CTY09", Branch: "강북", Color: "Yellow", path: "" },
          ],
        };

        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel, "MainModel");

        var sPaTH = "../model/CTY/CTY0";
        for (var i = 0; i < 9; i++) {
          var sFullPath = sPaTH + (i + 1) + ".png";

          oData.ProductCollection[i].path = sFullPath;
        }
        this.getView()
          .getModel("MainModel")
          .setProperty("/ProductCollection", oData.ProductCollection);
        console.log(this.getView().getModel("MainModel").getData());
      },
    });
  }
);
