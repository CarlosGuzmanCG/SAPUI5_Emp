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
            
            var oView = this.getView(); //get JSON
            var oJSONModelEmpl = new sap.ui.model.json.JSONModel(); //set JSON
            // var i18nBundle = oView.getModel("i18n").getResourceBundle();
            oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
            oView.setModel(oJSONModelEmpl, "jsonEmployees");

            var oJSONModelCounties = new sap.ui.model.json.JSONModel();
            oJSONModelCounties.loadData("./localService/mockdata/Countries.json", false);
            oView.setModel(oJSONModelCounties, "jsonCountries");

            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID : true,
                visibleName :  true,
                visibleCountry : true,
                visibleCity : false,
                visibleBtnShowCity : true,
                visibleBtnHideCity : false
            });

            oView.setModel(oJSONModelConfig, "jsonModelConfig");

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
            var oJSON = this.getView().getModel("jsonCountries").getData();
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
            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
            onFilter.call(this);
        }

        function showPostalCode(oEvent){
            var itemPressed = oEvent.getSource();
            var oContext =  itemPressed.getBindingContext("jsonEmployees");
            var objectContext = oContext.getObject();
            sap.m.MessageToast.show(objectContext.PostalCode);
        }

        function showOrders(oEvent){

            var ordersTable = this.getView().byId("ordersTable");
            ordersTable.destroyItems();
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployees");
            
            var objectContext = oContext.getObject();
            var orders = objectContext.Orders; // value of Employee json

            var ordersItems = [];

            for(var i in orders){
                ordersItems.push(new sap.m.ColumnListItem({
                    cells : [
                        new sap.m.Label({text : orders[i].OrderID}),
                        new sap.m.Label({text : orders[i].Freight}),
                        new sap.m.Label({text : orders[i].ShipAddress}),
                    ]
                }));
            }

            var newTable = new sap.m.Table({
                width : "auto",
                columns : [
                    new sap.m.Column({
                        header : new sap.m.Label({
                            text : "{i18n>OrderID}"
                        })
                    }),
                    new sap.m.Column({
                        header : new sap.m.Label({
                            text : "{i18n>Freight}"
                        }) 
                    }),
                    new sap.m.Column({
                            header : new sap.m.Label({
                                text : "{i18n>ShipAddress}"
                            }) 
                    })

                ],
                items : ordersItems
            }).addStyleClass("sapUiSmallMargin");

            ordersTable.addItem(newTable);

            var newTableJSON = new sap.m.Table();
            newTableJSON.setWidth("auto");
            newTableJSON.addStyleClass("sapUiSmallMargin");

            var columnOrderID = new sap.m.Column();
            var labelOrderID = new sap.m.Label();
            labelOrderID.bindProperty("text","i18n>OrderID");
            columnOrderID.setHeader(labelOrderID);
            newTableJSON.addColumn(columnOrderID);

            var columnFreight = new sap.m.Column();
            var labelFreight = new sap.m.Label();
            labelFreight.bindProperty("text","i18n>Freight");
            columnFreight.setHeader(labelFreight);
            newTableJSON.addColumn(columnFreight);

            var columnShipAddress = new sap.m.Column();
            var labelShipAddress = new sap.m.Label();
            labelShipAddress.bindProperty("text","i18n>ShipAddress");
            columnShipAddress.setHeader(labelShipAddress);
            newTableJSON.addColumn(columnShipAddress);

            var columnListItem = new sap.m.ColumnListItem();

            var cellOrderID = new sap.m.Label();
            cellOrderID.bindProperty("text","jsonEmployees>OrderID");
            columnListItem.addCell(cellOrderID);

            var cellFreight = new sap.m.Label();
            cellFreight.bindProperty("text","jsonEmployees>Freight");
            columnListItem.addCell(cellFreight);

            var cellShipAddress = new sap.m.Label();
            cellShipAddress.bindProperty("text","jsonEmployees>ShipAddress");
            columnListItem.addCell(cellShipAddress);

            var oBindingInfo = {
                model : "jsonEmployees",
                path : "Orders",
                template : columnListItem
            };

            newTableJSON.bindAggregation("items", oBindingInfo);
            newTableJSON.bindElement("jsonEmployees>" + oContext.getPath());

            ordersTable.addItem(newTableJSON);
        }

        function onShowCity(){
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);
        }

        function onHideCity(){
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        }

        return Controller.extend("aa.sapui5.controller.App", {
            onInit : onInitv2,
            onFilter : onFilter,
            onClearFilter : onClearFilter,
            showPostalCode : showPostalCode,
            onShowCity : onShowCity,
            onHideCity : onHideCity,
            showOrders : showOrders
        });
    });
