// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
    * @param {typeof sap.ui.core.mvc.Controller} Controller
    * @param {typeof sap.ui.model.Filter} Filter
    * @param {typeof sap.ui.model.FilterOperator} FilterOperator
    */
    function (Controller, Filter, FilterOperator) {
        "use strict";
        function onInitv2() {
            this._bus = sap.ui.getCore().getEventBus();
        }
        function myCheck() {
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();
            if (valueEmployee.length === 10) {
                this.byId("labelCountry").setVisible(true);
                this.byId("slCountry").setVisible(true);
            } else {
                this.byId("labelCountry").setVisible(false);
                this.byId("slCountry").setVisible(false);
            }
        }
        function onFilter() {
            var oJSON = this.getView().getModel("jsonCountries").getData();
            var filters = [];
            if (oJSON.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId));
            }
            if (oJSON.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSON.CountryKey));

            }
            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        }
        function onClearFilter() {
            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
            onFilter.call(this);
        }
        function showPostalCode(oEvent) {
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployees");
            var objectContext = oContext.getObject();
            sap.m.MessageToast.show(objectContext.PostalCode);
        }
        function showOrders(oEvent) {
            // get selected controller
            var iconPressed = oEvent.getSource();
            //Context from the model
            var oContext = iconPressed.getBindingContext("odataNorthwind");
            if (!this._oDialogOrders) {
                this._oDialogOrders = sap.ui.xmlfragment("aa.sapui5.fragment.DialogOrders", this);
                this.getView().addDependent(this._oDialogOrders);
            }
            //Dialog binding to the context to have access to the data of selected item
            this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
            this._oDialogOrders.open();
        }
        function onCloseOrders() {
            this._oDialogOrders.close();
        }
        function onShowCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);
        }
        function onHideCity() {

            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        }
        function showEmployee(oEvent){
            var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
            this._bus.publish("flexible","showEmployee",path);
        }
        return Controller.extend("aa.sapui5.controller.MasterEmployee", {
            onInit : onInitv2,
            onFilter: onFilter,
            onClearFilter: onClearFilter,
            showPostalCode: showPostalCode,
            onShowCity: onShowCity,
            onHideCity: onHideCity,
            showOrders: showOrders,
            onCloseOrders: onCloseOrders,
            showEmployee : showEmployee
        });
    });