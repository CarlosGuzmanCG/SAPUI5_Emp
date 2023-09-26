sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"

], function (Controller, History, MessageBox) {

    function _onObjectMatched(oEvent){

        this.onClearSignature();


        this.getView().bindElement({
            path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
            model: "odataNorthwind",
            events:{
                dataReceived: function(oData){
                    _readSignature.bind(this)(oData.getParameter("data").OrderID,oData.getParameter("data").EmployeeID)
                }.bind(this)
            }
        });

        const objContext = this.getView().getModel("odataNorthwind").getContext("/Orders("
                + oEvent.getParameter("arguments").OrderID + ")").getObject();
        if(objContext){
            _readSignature.bind(this)(objContext.OrderID, objContext.EmployeeID);
        }
    }

    function _readSignature(orderId,employeeId){
            this.getView().getModel("incidenceModel").read("/SignatureSet(OrderId='" + orderId
                + "',SapId='" + this.getOwnerComponent().SapId
                + "',EmployeeId='" + employeeId + "')", {
                success: function (data) {
                    const signature = this.getView().byId("signature");
                    if (data.MediaContent !== "") {
                        signature.setSignature("data:image/png;base64," + data.MediaContent);
                    }
                }.bind(this),
                error: function (data) {
                }
        })
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

    function factoryOrderDetails (listId, oContext){
        var contextObject = oContext.getObject();
        contextObject.Currency = "EUR";
        var unitsInStock = oContext.getModel().getProperty("/Products(" + contextObject.ProductID + ")/UnitsInStock");

        if (contextObject.Quantity <= unitsInStock) {
            var objectListItem = new sap.m.ObjectListItem({
                title : "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})",
                number : "{parts: [ {path: 'odataNorthwind>UnitPrice'}, {path: 'odataNorthwind>Currency'}], type:'sap.ui.model.type.Currency', formatOptions: {showMeasure: false}}",
                numberUnit: "{odataNorthwind>Currency}"
            });
            return objectListItem;
        } else {
            var customListItem = new sap.m.CustomListItem({
                content: [
                    new sap.m.Bar({
                        contentLeft: new sap.m.Label({ text: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})"}),
                        contentMiddle:new sap.m.ObjectStatus({ text: "{i18n>availableStock} {odataNorthwind>/Products(" + contextObject.ProductID + ")/UnitsInStock}", state: "Error"}),
                        contentRight: new sap.m.Label({text:"{parts: [ {path: 'odataNorthwind>UnitPrice'}, {path: 'odataNorthwind>Currency'}], type:'sap.ui.model.type.Currency'}"}) 
                    })
                ]
            });
            return customListItem;
        }
    }

    function onSaveSignature(oEvent){
        const signature = this.byId("signature");
        const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
        let signaturePng;

        if(!signature.isFill()){
            MessageBox.error(oResourceBundle.getText("fillSignature"));
        }else{
            signaturePng = signature.getSignature().replace("data:image/png;base64,","");
            let objectOrder = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
            let body = {
                OrderId: objectOrder.OrderID.toString(),
                SapId: this.getOwnerComponent().SapId,
                EmployeeId: objectOrder.EmployeeID.toString(),
                MimeType: "image/png",
                MediaContent: signaturePng
            };

            this.getView().getModel("incidenceModel").create("/SignatureSet", body, {
                success : function(){
                    MessageBox.information(oResourceBundle.getText("signatureSave"));
                },
                error: function(){
                    MessageBox.error(oResourceBundle.getText("signatureNotSave"));
                }
            })
        };
    }

    return Controller.extend("aa.sapui5.controller.OrderDetails", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this); //routing
            oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched,this); // route
        },

        onBack : onBack,
        onClearSignature:onClearSignature,
        factoryOrderDetails:factoryOrderDetails,
        onSaveSignature :onSaveSignature
    });

});