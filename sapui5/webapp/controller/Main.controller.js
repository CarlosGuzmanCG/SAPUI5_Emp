sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {

    function onInit() {
        var oView = this.getView(); //get JSON

        // @ts-ignore
        var oJSONModelEmpl = new sap.ui.model.json.JSONModel(); //set JSON
        // var i18nBundle = oView.getModel("i18n").getResourceBundle();
        oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
        oView.setModel(oJSONModelEmpl, "jsonEmployees");

        var oJSONModelCountries = new sap.ui.model.json.JSONModel();
        oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
        oView.setModel(oJSONModelCountries, "jsonCountries");

        var oJSONModelLayout = new sap.ui.model.json.JSONModel();
        oJSONModelLayout.loadData("./localService/mockdata/Layout.json", false);
        oView.setModel(oJSONModelLayout, "jsonLayout");

        var oJSONModelConfig = new sap.ui.model.json.JSONModel({
            visibleID: true,
            visibleName: true,
            visibleCountry: true,
            visibleCity: false,
            visibleBtnShowCity: true,
            visibleBtnHideCity: false
        });

        oView.setModel(oJSONModelConfig, "jsonModelConfig");

        this._bus = sap.ui.getCore().getEventBus();

        this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);

    }

    function showEmployeeDetails(category, nameEvent, path) {
        var detailView = this.getView().byId("detailEmployeeView");
        detailView.bindElement("jsonEmployees>" + path);
        this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");
    }

    return Controller.extend("aa.sapui5.controller.Main", {
        onInit: onInit,
        showEmployeeDetails: showEmployeeDetails // showEmployeeDetails : function(category, nameEvent, path)
        

    });
});