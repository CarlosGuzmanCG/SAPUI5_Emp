sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, Filter ,FilterOperator) {
        "use strict";

        function onInitv2(){
            var oJSONModel = new sap.ui.model.json.JSONModel(); //set JSON
            var oView = this.getView(); //get JSON
            var i18nBundle = oView.getModel("i18n").getResourceBundle();

            oJSONModel.loadData("./localService/mockdata/Employees.json", false);
            oView.setModel(oJSONModel);
        }

        function myCheck(){
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if(valueEmployee.length === 10 ){
                this.byId("labelCountry").setVisible(true);
                this.byId("slCountry").setVisible(true);
            }else{
                this.byId("labelCountry").setVisible(false);
                this.byId("slCountry").setVisible(false);
            }
        }

        function onFilter(){
            var oJSON = this.getView().getModel().getData();
            var filters = [];
            if(oJSON.EmployeeId !== ""){
                filters.push(new Filter("EmployeeID", FilterOperator.EQ,oJSON.EmployeeId ));
            }

            if(oJSON.CountryKey !== ""){
                filters.push(new Filter("Country", FilterOperator.EQ,oJSON.CountryKey ));
            }

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        }

        function onClearFilter(){
            var oModel = this.getView().getModel();
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
            onFilter.call(this);
        }

        return Controller.extend("aa.sapui5.controller.App", {
            onInit : onInitv2,
            onFilter : onFilter,
            onClearFilter : onClearFilter
        });
    });
