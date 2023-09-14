sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {

    function onCreateIncidence(){
        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("aa.sapui5.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var index = odata.length;
        odata.push({ index : index +1 });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);
    }

    return Controller.extend("aa.sapui5.controller.EmployeeDetails", {
        onInit: function () {
        },

        onCreateIncidence : onCreateIncidence

    });
});