//Author-Autodesk Inc.
//Description-This is sample addin.

var commandIdOnQAT = 'demoCommandOnQATJS';
var commandIdOnPanel = 'demoCommandOnPanelJS';
var selectionInputId = 'selectionInput';
var distanceInputId = 'distanceValueCommandInput';
var panelId = "SolidCreatePanel";

// Support localization
var locStrings = null;
var getUserLanguage = function(){
    var app = adsk.core.Application.get();

    switch(app.preferences.generalPreferences.userLanguage){
    case adsk.core.UserLanguages.ChinesePRCLanguage:
        return "zh-CN";
    case adsk.core.UserLanguages.ChineseTaiwanLanguage:
        return "zh-TW";
    case adsk.core.UserLanguages.CzechLanguage:
        return "cs-CZ";
    case adsk.core.UserLanguages.EnglishLanguage:
        return "en-US";
    case adsk.core.UserLanguages.FrenchLanguage:
        return "fr-FR";
    case adsk.core.UserLanguages.GermanLanguage:
        return "de-DE";
    case adsk.core.UserLanguages.HungarianLanguage:
        return "hu-HU";
    case adsk.core.UserLanguages.ItalianLanguage:
        return "it-IT";
    case adsk.core.UserLanguages.JapaneseLanguage:
        return "ja-JP";
    case adsk.core.UserLanguages.KoreanLanguage:
        return "ko-KR";
    case adsk.core.UserLanguages.PolishLanguage:
        return "pl-PL";
    case adsk.core.UserLanguages.PortugueseBrazilianLanguage:
        return "pt-BR";
    case adsk.core.UserLanguages.RussianLanguage:
        return "ru-RU";
    case adsk.core.UserLanguages.SpanishLanguage:
        return "es-ES";
    }

    return "en-US";
};

// Get the loc strings by lanuage
var getLocStrings = function(){
    var locStrings = null;
    if(resources){
        var language = getUserLanguage();
        locStrings = resources[language];
        if(!locStrings){
            locStrings = resources["en-US"]; // Defaults to en-US
        }
    }

    locStrings = locStrings || {};
    return locStrings;
};

var errorDescription = function(e) {
    return (e.description ? e.description : e);
};

var commandDefinitionById = function(id) {
    var app = adsk.core.Application.get();
    var ui = app.userInterface;
    if (!id) {
        ui.messageBox(locStrings.cmdDefIdNotSpecified);
        return null;
    }
    var commandDefinitions_ = ui.commandDefinitions;
    var commandDefinition_ = commandDefinitions_.itemById(id);
    return commandDefinition_;
};

var commandControlByIdForQAT = function(id) {
    var app = adsk.core.Application.get();
    var ui = app.userInterface;
    if (!id) {
        ui.messageBox(locStrings.cmdControlIdNotSpecified);
        return null;
    }
    var toolbars_ = ui.toolbars;
    var toolbarQAT_ = toolbars_.itemById('QAT');
    var toolbarControls_ = toolbarQAT_.controls;
    var toolbarControl_ = toolbarControls_.itemById(id);
    return toolbarControl_;
};

var commandControlByIdForPanel = function(id) {
    var app = adsk.core.Application.get();
    var ui = app.userInterface;
    if (!id) {
        ui.messageBox(locStrings.cmdControlIdNotSpecified);
        return null;
    }
    var workspaces_ = ui.workspaces;
    var modelingWorkspace_ = workspaces_.itemById('FusionSolidEnvironment');
    var toolbarPanels_ = modelingWorkspace_.toolbarPanels;
    var toolbarPanel_ = toolbarPanels_.itemById(panelId);
    var toolbarControls_ = toolbarPanel_.controls;
    var toolbarControl_ = toolbarControls_.itemById(id);
    return toolbarControl_;
};

var destroyObject = function(uiObj, tobeDeleteObj) {
    if (uiObj && tobeDeleteObj) {
        if (tobeDeleteObj.isValid) {
            tobeDeleteObj.deleteMe();
        } else {
            uiObj.messageBox(locStrings.deleteObjInvalid);
        }
    }
};

function run(context) {

    "use strict";
    if (adsk.debug === true) {
        /*jslint debug: true*/
        debugger;
        /*jslint debug: false*/
    }

    var ui;
    try {
        var app = adsk.core.Application.get();
        ui = app.userInterface;

        locStrings = getLocStrings();

        var commandName = locStrings.cmdName;
        var commandDescription = locStrings.cmdDescription;
        var commandResources = './resources';
        var iconResources = './resources';

        var onInputChanged = function(args) {
            try
            {
                var command = adsk.core.Command(args.firingEvent.sender);
                var cmdInput = args.input;
                if(cmdInput.id != distanceInputId)
                    ui.messageBox(locStrings.inputChangedEventTriggered.replace('{0}', command.parentCommandDefinition.id));

                if(cmdInput.id == selectionInputId){
                    var inputs = cmdInput.commandInputs;
                    var distanceInput = inputs.itemById(distanceInputId);

                    if(cmdInput.selectionCount > 0){
                        var sel = cmdInput.selection(0);
                        var selPt = sel.point;
                        var ent = sel.entity;
                        var plane = ent.geometry;

                        distanceInput.setManipulator(selPt, plane.normal);
                        distanceInput.expression = "10mm * 2";
                        distanceInput.isEnabled = true;
                        distanceInput.isVisible = true;
                    }
                    else{
                        distanceInput.isEnabled = false;
                        distanceInput.isVisible = false;
                    }
                }
            } catch (e) {
                ui.messageBox(locStrings.FailedInInputChangedEvent + errorDescription(e));
            }
        };

        var onCommandExecuted = function(args) {
            try {
                var command = adsk.core.Command(args.firingEvent.sender);
                var app = adsk.core.Application.get();
    var ui = app.userInterface;
    var product = app.activeProduct;
    var design = adsk.fusion.Design(product);
    var exportMgr = design.exportManager;
    var tmpDir = '/Users/alexturin/projects/NativeView/';

    var stlOptions = exportMgr.createSTLExportOptions(design.rootComponent, tmpDir + 'test.stl');
    stlOptions.isBinaryFormat = true;
    stlOptions.meshRefinement = adsk.fusion.MeshRefinementSettings.MeshRefinementHigh;
    var res;
    res = exportMgr.execute(stlOptions);

    // ui.messageBox('Completed exporting all file formats into ' + tmpDir);

            } catch (e) {
                ui.messageBox(locStrings.cmdExecutedFailed + errorDescription(e));
            }
        };

        var onCommandCreatedOnQAT = function(args) {
            try {
                var command = args.command;
                command.execute.add(onCommandExecuted);
                // ui.messageBox(locStrings.cmdQATCreated);

            } catch (e) {
                ui.messageBox(locStrings.cmdQATCreatedFailed);
            }
        };

        var onCommandCreatedOnPanel = function(args) {
            try {
                var command = args.command;
                command.helpFile = 'help.html';

                command.execute.add(onCommandExecuted);
                command.inputChanged.add(onInputChanged);

                var commandInputs_ = command.commandInputs;
                commandInputs_.addValueInput('valueInput_', locStrings.value, 'cm', adsk.core.ValueInput.createByString('0.0 cm'));
                commandInputs_.addBoolValueInput('boolvalueInput_', locStrings.checked, true);
                commandInputs_.addStringValueInput('stringValueInput_', locStrings.stringValue, locStrings.defaultValue);
                var selInput = commandInputs_.addSelectionInput(selectionInputId, locStrings.selection, locStrings.selectOne);
                selInput.addSelectionFilter('PlanarFaces');
                selInput.addSelectionFilter('ConstructionPlanes');
                var dropDownCommandInput_ = commandInputs_.addDropDownCommandInput('dropdownCommandInput', locStrings.dropDown, adsk.core.DropDownStyles.LabeledIconDropDownStyle);
                var dropDownItems_ = dropDownCommandInput_.listItems;
                dropDownItems_.add(locStrings.listItem1, true);
                dropDownItems_.add(locStrings.listItem2, false);
                dropDownItems_.add(locStrings.listItem3, false);
                var dropDownCommandInput2_ = commandInputs_.addDropDownCommandInput('dropDownCommandInput2', locStrings.dropDown2, adsk.core.DropDownStyles.CheckBoxDropDownStyle);
                var dropDownCommandInputListItems_ = dropDownCommandInput2_.listItems;
                dropDownCommandInputListItems_.add(locStrings.listItem1, true);
                dropDownCommandInputListItems_.add(locStrings.listItem2, true);
                dropDownCommandInputListItems_.add(locStrings.listItem3, false);
                commandInputs_.addFloatSliderCommandInput('floatSliderCommandInput', locStrings.slider, 'cm', 0.0, 10.0, true);
                var buttonRowCommandInput_ = commandInputs_.addButtonRowCommandInput('buttonRowCommandInput', locStrings.buttonRow, false);
                var buttonRowCommandInputListItems_ = buttonRowCommandInput_.listItems;
                buttonRowCommandInputListItems_.add('ListItem 1', false, iconResources);
                buttonRowCommandInputListItems_.add('ListItem 2', true, iconResources);
                buttonRowCommandInputListItems_.add('ListItem 3', false, iconResources);

                var distanceInput = commandInputs_.addDistanceValueCommandInput(distanceInputId, locStrings.distance, adsk.core.ValueInput.createByReal(0.0));
                distanceInput.isEnabled = false;
                distanceInput.isVisible = false;
                distanceInput.minimumValue = 1.0;
                distanceInput.maximumValue = 10.0;

                var directionInput = commandInputs_.addDirectionCommandInput('directionInput', locStrings.direction);
                directionInput.setManipulator(adsk.core.Point3D.create(0,0,0), adsk.core.Vector3D.create(1,0,0));
                var directionInput2 = commandInputs_.addDirectionCommandInput('directionInput2', locStrings.direction2, iconResources);
                directionInput2.setManipulator(adsk.core.Point3D.create(0,0,0), adsk.core.Vector3D.create(0,1,0));

                // ui.messageBox(locStrings.cmdPanelCreated);

            } catch (e) {
                ui.messageBox(locStrings.cmdPanelCreatedFailed + errorDescription(e));
            }
        };

        var commandDefinitions_ = ui.commandDefinitions;

        // add a command button on Quick Access Toolbar
        var toolbars_ = ui.toolbars;
        var toolbarQAT_ = toolbars_.itemById('QAT');
        var toolbarControlsQAT_ = toolbarQAT_.controls;
        var toolbarControlQAT_ = toolbarControlsQAT_.itemById(commandIdOnQAT);
        if (!toolbarControlQAT_) {
            var commandDefinitionQAT_ = commandDefinitions_.itemById(commandIdOnQAT);
            if (!commandDefinitionQAT_) {
                commandDefinitionQAT_ = commandDefinitions_.addButtonDefinition(commandIdOnQAT, commandName, commandDescription, commandResources);
            }
            commandDefinitionQAT_.commandCreated.add(onCommandCreatedOnQAT);
            toolbarControlQAT_ = toolbarControlsQAT_.addCommand(commandDefinitionQAT_);
            toolbarControlQAT_.isVisible = true;
            // ui.messageBox(locStrings.demoButtonAddedToQAT);
        }

        //TOOOOOOOLBAAAR
        // add a command on create panel in modeling workspace
        var workspaces_ = ui.workspaces;
        var modelingWorkspace_ = workspaces_.itemById('FusionSolidEnvironment');
        var toolbarPanels_ = modelingWorkspace_.toolbarPanels;
        var toolbarPanel_ = toolbarPanels_.itemById(panelId); // add the new command under the Create panel
        var toolbarControlsPanel_ = toolbarPanel_.controls;
        var toolbarControlPanel_ = toolbarControlsPanel_.itemById(commandIdOnPanel);
        if (!toolbarControlPanel_) {
            var commandDefinitionPanel_ = commandDefinitions_.itemById(commandIdOnPanel);
            if (!commandDefinitionPanel_) {
                commandDefinitionPanel_ = commandDefinitions_.addButtonDefinition(commandIdOnPanel, commandName, commandDescription, commandResources);
            }
            commandDefinitionPanel_.commandCreated.add(onCommandCreatedOnPanel);
            toolbarControlPanel_ = toolbarControlsPanel_.addCommand(commandDefinitionPanel_);
            toolbarControlPanel_.isVisible = true;
            // ui.messageBox(locStrings.demoButtonAddedToPanel);
        }
    }
    catch (e) {
        if (ui) {
            ui.messageBox(locStrings.addInStartFailed + errorDescription(e));
        }
    }
}

function stop(context) {
    var ui;
    try {
        var app = adsk.core.Application.get();
        ui = app.userInterface;
        var objArrayQAT = [];
        var objArrayPanel = [];

        var commandControlQAT_ = commandControlByIdForQAT(commandIdOnQAT);
        if (commandControlQAT_) {
            objArrayQAT.push(commandControlQAT_);
        }
        var commandDefinitionQAT_ = commandDefinitionById(commandIdOnQAT);
        if (commandDefinitionQAT_) {
            objArrayQAT.push(commandDefinitionQAT_);
        }

        var commandControlPanel_ = commandControlByIdForPanel(commandIdOnPanel);
        if (commandControlPanel_) {
            objArrayPanel.push(commandControlPanel_);
        }
        var commandDefinitionPanel_ = commandDefinitionById(commandIdOnPanel);
        if (commandDefinitionPanel_) {
            objArrayPanel.push(commandDefinitionPanel_);
        }

        objArrayQAT.forEach(function(obj){
            destroyObject(ui, obj);
        });

        objArrayPanel.forEach(function(obj){
            destroyObject(ui, obj);
        });

    } catch (e) {
        if (ui) {
            ui.messageBox(locStrings.addInStopFailed + errorDescription(e));
        }
    }
}
