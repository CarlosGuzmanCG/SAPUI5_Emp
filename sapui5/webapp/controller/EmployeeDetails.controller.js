sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "aa/sapui5/model/formatter"
], function (Controller, formatter) {

    function onCreateIncidence(){
        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("aa.sapui5.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var index = odata.length;
        odata.push({ index : index +1, _validateDate:false });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);
    }

    function onSaveIncidence(oEvent){
        var incidence = oEvent.getSource().getParent().getParent();
        var incidenceRow = incidence.getBindingContext("incidenceModel");
        //var temp = incidenceRow.sPath.replace('/','');
        this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });
    }

    function onDeleteIncidence (oEvent){
        var tableIncidence = this.getView().byId("tableIncidence");
        var rowIncidence = oEvent.getSource().getParent().getParent();
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var contextObj = rowIncidence.getBindingContext("incidenceModel");

        odata.splice(contextObj.index - 1, 1);
        for(var i in odata){
            odata[i].index = parseInt(i) + 1;
        }
        incidenceModel.refresh();
        tableIncidence.removeContent(rowIncidence);

        for(var j in tableIncidence.getContent()){
            tableIncidence.getContent()[j].bindElement("incidenceModel>/"+j);
        }
    }

    function onInit(){
        this._bus = sap.ui.getCore().getEventBus();
    }

    function updateIncidenceCreationDate(oEvent){
        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();

        if(!oEvent.getSource().isValidValue()){ // valid date
            contextObj._validateDate = false;
            contextObj.CreationDateState = "Error";
        }else{
            contextObj.CreationDateX = true;
            contextObj._validateDate = true;
            contextObj.CreationDateState = "None";
        };

        context.getModel().refresh(); // refresh view 

    }

    function updateIncidenceReason(oEvent){
        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();

        if(oEvent.getSource().getValue()){ // valid date
            contextObj.ReasonX = true;
            contextObj.ReasonState = "None";
        }else{
            contextObj.ReasonState = "Error";
        };

        context.getModel().refresh(); // refresh view 
    }

    function updateIncidenceType(oEvent){
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.TypeX =true;
    }

    function onDeleteIncidenceV2 (oEvent){
        var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();
        this._bus.publish("incidence", "onDeleteIncidenceV2",{
            IncidenceId: contextObj.IncidenceId,
            SapId: contextObj.SapId,
            EmployeeId: contextObj.EmployeeId
        });
    }

    return Controller.extend("aa.sapui5.controller.EmployeeDetails", {
        onInit :  onInit,        
        onCreateIncidence : onCreateIncidence,
        //onDeleteIncidence : onDeleteIncidence, //temp
        onDeleteIncidenceV2 : onDeleteIncidenceV2,
        Formatter : formatter,
        onSaveIncidence : onSaveIncidence,
        updateIncidenceCreationDate : updateIncidenceCreationDate,
        updateIncidenceReason : updateIncidenceReason,
        updateIncidenceType : updateIncidenceType
    });
});