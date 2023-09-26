sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"

], function (Controller, History) {

    function _onObjectMatched(oEvent){
        this.getView().bindElement({
            path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
            model : "odataNorthwind"
        });
    }

    function onBack(){
        var oHistory = History.getInstance();
        var sPreviosHash = oHistory.getPreviousHash();
        if(sPreviosHash !== undefined){
            window.history.go(-1);
        }else{
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteMain", true);
        };
    }

    function onClearSignature(oEvent){
        var signature = this.byId("signature");
        signature.clear();
    }

    return Controller.extend("aa.sapui5.controller.OrderDetails", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this); //routing
            oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched,this); // route
        },

        onBack : onBack,
        onClearSignature:onClearSignature

    });

});