// @ts-nocheck
sap.ui.define([
    "sap/ui/core/Control",
], function (Control) {


    return Control.extend("aa.sapui5.controller.Signature", {

        metadata: {
            properties: {
                "width": {
                    type: "sap.ui.core.CSSSize",
                    defaulValue: "400px"
                },
                "height": {
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "100px"
                },
                "bgcolor": {
                    type: "sap.ui.core.CSSColor",
                    defaultValue: "white"
                }
            }
        },

        onInit: function () {

        },

        renderer: function (oRM, oControl) {
            oRM.write("<div");
            oRM.addStyle("width", oControl.getProperty("width"));
            oRM.addStyle("height", oControl.getProperty("height"));
            oRM.addStyle("background-color", oControl.getProperty("bgcolor"));
            oRM.addStyle("border", "1px solid black")
            oRM.writeStyles();
            oRM.write(">");

            oRM.write("<canvas white='" + oControl.getProperty("width") + "' " + "height='"
                + oControl.getProperty("height") + "'");
            oRM.write("></canvas>");
            oRM.write("</div>");
        },

        onAfterRendering: function () {
            var canvas = document.querySelector("canvas");
            try {
                this.signaturePad = new SignaturePad(canvas); //where it should be instantiated
                this.signaturePad.fill = false; // img
                canvas.addEventListener("mousedown", function(){
                    this.signaturePad.fill = true;
                }.bind(this));
            } catch (e) {
                console.error(e);
            }

        },

        clear: function(){ //clear
            this.signaturePad.clear();
            this.signaturePad.fill = false; // img
        },

        isFill :  function(){ // 
            return this.signaturePad.fill;
        },

        getSignature : function(){ // get img
            return this.signaturePad.toDataURL();
        },

        setSignature: function(signature){ //set the format
            this.signaturePad.fromDataURL(signature);
        }
    });

});