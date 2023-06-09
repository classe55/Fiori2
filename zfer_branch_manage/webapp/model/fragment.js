sap.ui.define([], 

    function (JSONModel, Device) {
        "use strict";

        return {
            
        closeDialog : function(oEvent){
            oEvent.getSource().getParent().close();
        }
    };
});