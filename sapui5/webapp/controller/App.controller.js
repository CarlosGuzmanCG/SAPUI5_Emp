sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        function onInitv2(){
            var oJSONModel = new sap.ui.model.json.JSONModel(); //set JSON
            var oView = this.getView(); //get JSON
            var i18nBundle = oView.getModel("i18n").getResourceBundle();
            var oJSON = { //Model json
                employeeId : "12345",
                countryKey : "UK",
                listCountry: [
                    {
                        key : "U",
                        text : i18nBundle.getText("countryUS") 
                    },
                    {
                        key : "UK",
                        text : i18nBundle.getText("countryUK") 
                    },
                    {
                        key : "ES",
                        text : i18nBundle.getText("countryES") 
                    }
                ]
            };

            oJSONModel.setData(oJSON); //pass the data of type JSON
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

        return Controller.extend("aa.sapui5.controller.App", {
            onValidate : myCheck,
            onInit : onInitv2
        });
    });
