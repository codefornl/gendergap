$(document).ready(function () {
    main.init();
});

var main = {
    percent: parseInt($('body').attr('data-percent')),
    init: function () {
        this.domEvents();
        $('.diffpercent').text(main.percent);
    },
    domEvents: function () {
        $('.calculator button').click(main.showResult);
        $('.calculator .gender').click(function () {
            self = $(this);
            if (self.hasClass('active'))
                return;

            self.parent().find('.active').removeClass('active');
            self.addClass('active');


            $('.diagram .active').removeClass('active');
            gender = self.attr('data-gender');
            $('.result-diagram.' + gender).addClass('active');
        });
        $('.share').click(function () {
            var title = $(".title.step2").text();
            var description = $(".info p").text();

            main.shareOverrideOGMeta(title, description);
        });
    },
    showResult: function () {
        var isWoman = $('section.calculator .gender.active').hasClass('woman');
        var moreLess = 'less';
        var diagramSelector = 'woman';
        var diagramSelector_real = 'man';
        var ranges = $('select').val();
        var chosenRanges = $("select").val().split("-");
        var manSalary = [];
        var womanSalary = [];
        var othersSalary = [];
        $.each(chosenRanges, function (key, value) {
            var intValue = parseInt(value);
            chosenRanges[key] = parseInt(value);
            manSalary[key] = intValue * (100 + main.percent) / 100;
            womanSalary[key] = intValue * (100 - main.percent) / 100;
        });
        var difference = main.calculateDifference(chosenRanges);

        // your salary
        $(".result-diagram.active .salary-name").text("Your Salary");
        $(".result-diagram.active .salary").text(main.convertArrayToString(chosenRanges));
        $(".title .salary").text(main.convertArrayToString(difference));
        $(".title .salary-real").text(main.convertArrayToString(chosenRanges));

        othersSalary = womanSalary;

        if (isWoman) {
            $(".result-diagram.active .salary-name");
            diagramSelector = 'man';
            diagramSelector_real = 'woman';
            moreLess = 'more';
            othersSalary = manSalary;
        }
        $(".title .sex").text(diagramSelector);
        $(".title .sex-real").text(diagramSelector_real);
        $(".title .moreless").text(moreLess);

        $(".result-diagram:not(.active ) .salary").text(main.convertArrayToString(othersSalary));
        main.setFimaleDiagramWidth();
        main.changeSections();

        setTimeout(function () {
            main.showFirstDiagram();
        }, 300);

        setTimeout(function () {
            main.showSecondDiagram();
        }, 4500);
    },
    setFimaleDiagramWidth: function () {
        var width = 100 - main.percent;
        $(".specialwidth").attr('style', 'width: ' + width + '%');
        //$(".specialwidth").attr('style', 'width: ' + width + '% !important');

    },
    convertArrayToString: function (arr) {
        if (arr.length === 1) {
            return arr[0] + "+";
        } else {
            return arr[0] + "-" + arr[1];
        }
    },
    calculateDifference: function (arr) {
        arr = arr.map(function (a) { return a * main.percent / 100; });
        return arr;
    },
    getAvg: function (arr) {
        sum = arr.reduce(function (a, b) { return a + b; });
        avg = sum / arr.length;
        return avg;
    },
    changeSections: function () {
        $('section').addClass('animationg');

        setTimeout(function () {
            $('.calculator').removeClass('active').addClass('hidden');
            $('section.result').removeClass('hidden').addClass('active');
        }, 100);

        setTimeout(function () {
            $('section').removeClass('animationg');
        }, 200);
    },
    showFirstDiagram: function () {

        $(".result-diagram.active").addClass("opacity");

        setTimeout(function () {
            $(".result-diagram.active .result-inner").addClass("animate").removeClass('stopanimation');
        }, 600);
    },
    showSecondDiagram: function () {
        $(".result-diagram:not(.active)").addClass("opacity");
        main.changeText();
        setTimeout(function () {
            $(".result-diagram:not(.active) .result-inner").addClass("animate").removeClass('stopanimation');
        }, 600);
    },
    changeText: function () {
        $('.title.step1').removeClass('active');

        setTimeout(function () {
            $('.title.step1').addClass('hidden');
            $('.title.step2').removeClass('hidden');
        }, 500);


        setTimeout(function () {
            $('.title.step2').addClass('active');
        }, 650);
    },
    shareOverrideOGMeta: function (overrideTitle, overrideDescription) {
        FB.ui({
            method: 'share_open_graph',
            action_type: 'og.likes',
            action_properties: JSON.stringify({
                object: {
                    'og:title': overrideTitle,
                    'og:description': overrideDescription
                }
            })
        },
            function (response) {
                // Action after response
            });
    }
};
var account = {
    controllerPath: "Account/",
    checkPersonalIdPath: "checkPersonalId/",
    checkMobile: "checkMobileNumber/",
    checkSmsCode: "checkSmsCode/",
    idNumberSelector: $("#id-number"),
    mobileSelector: $("#mobile-number"),
    smsCodeSelector: $("#sms-code"),
    smsMobileSelector: $("#sms-mobile"),
    init: function () {
        this.domEvents();
        console.log("account inited!");
    },
    domEvents: function () {
        this.idNumberSelector.keyup(function () {
            var val = $(this).val();
            if (val.length === 11) {
                main.startLoading();
                var endPoint = Path + account.controllerPath + account.checkPersonalIdPath;
                $.post(endPoint, { personalId: val }, account.checkPersonalIdCallback);
            }
        });

        this.idNumberSelector.keypress(function (event) {
            var val = $(this).val();
            if (val.length === 11) {
                return false;
            }
        });

        this.mobileSelector.keyup(function () {
            var val = $(this).val();
            if (val.length === 9) {
                main.startLoading();
                var endPoint = Path + account.controllerPath + account.checkMobile;
                $.post(endPoint, { personalId: val }, account.checkMobileCallback);
                account.smsMobileSelector.val(val);
            }
        });

        this.mobileSelector.keypress(function (event) {
            var val = $(this).val();
            if (val.length === 9) {
                return false;
            }
        });

        this.smsCodeSelector.keyup(function () {
            var val = $(this).val();
            if (val.length === 4) {
                main.startLoading();
                var endPoint = Path + account.controllerPath + account.checkSmsCode;
                $.post(endPoint, { personalId: val }, account.checkSmsCodeCallback);
            }
        });

        this.smsCodeSelector.keypress(function (event) {
            var val = $(this).val();
            if (val.length === 4) {
                return false;
            }
        });
    },
    checkPersonalIdCallback: function (response, status) {
        main.endLoading();
        if (status === 'success') {
            if (response.success) {
                $(".account-wrapper").addClass("step2");
            } else {
                main.showPopup(response.message);
            }
        }
    },
    checkMobileCallback: function (response, status) {
        main.endLoading();
        if (status === 'success') {
            if (response.success) {
                $(".account-wrapper").addClass("step3");
            } else {
                main.showPopup(response.message);
            }
        }
    },
    checkSmsCodeCallback: function (response, status) {
        if (status === 'success') {
            if (response.success) {
                main.initUser();
            } else {
                main.endLoading();
                main.showPopup(response.message);
            }
        }
    }
};

contact = {
    oldFb: "",
    oldTw: "",
    oldIns: "",
    oldOth: "",
    saveListener: $(".contact .success"),
    cancelListener: $(".contact .cancel"),
    inputs: $(".contact input"),
    wrapper: $(".contact"),
    buttons: $(".contact .buttons-wrapper"),
    ControllerPath: "Profile/",
    ActionPath: "UpdateContact/",
    init: function () {
        this.domEvents();
    },
    domEvents: function () {
        this.inputs.keyup(function () {
            contact.checkChanges();
        });

        this.inputs.focus(function () {
            // if none of the inputs are changed, save current values as old 
            if (!$(".contact input.changed").length) {
                contact.oldFb = contact.wrapper.find(".fb-link").val();
                contact.oldTw = contact.wrapper.find(".tw").val();
                contact.oldIns = contact.wrapper.find(".insta").val();
                contact.oldOth = contact.wrapper.find(".oth").val();
            }
        });

        this.saveListener.click(function () {
            contact.save();
        });

        this.cancelListener.click(function () {
            contact.cancelSave();
        });
    },
    save: function () {
        var formIsValid = contact.validateLinks();
        if (!formIsValid) {
            console.log("Form is not valid !!");
            return false;
        }
        main.startLoading();
        var data = this.checkChanges();
        console.log("data to send", data);
        var endPoint = Path + contact.ControllerPath + contact.ActionPath;
        $.post(endPoint, data, function (response, status) {
            if (status === 'success') {
                if (response.success) {
                    contact.buttons.removeClass("active");
                    contact.inputs.removeClass("changed");
                }
                else {
                    main.showPopup(response.message);
                }
            }
            main.endLoading();
        });
    },
    cancelSave: function () {
        contact.wrapper.find(".fb-link").val(contact.oldFb);
        contact.wrapper.find(".tw").val(contact.oldTw);
        contact.wrapper.find(".insta").val(contact.oldIns);
        contact.wrapper.find(".oth").val(contact.oldOth);
        contact.buttons.removeClass("active");
        contact.inputs.removeClass("changed hasError");
    },
    startEditing: function () { },
    checkChanges: function () {
        var Fb = this.wrapper.find(".fb-link");
        var Tw = this.wrapper.find(".tw");
        var Ins = this.wrapper.find(".insta");
        var Oth = this.wrapper.find(".oth");

        var isSame = this.checkAndModifyLink(Fb, this.oldFb) &&
            this.checkAndModifyLink(Tw, this.oldTw) &&
            this.checkAndModifyLink(Ins, this.oldIns) &&
            this.checkAndModifyLink(Oth, this.oldOth);

        console.log("isChanged", isSame);

        if (isSame) {
            this.buttons.removeClass("active");
        } else {
            this.buttons.addClass("active");
            return { fb: Fb.val(), tw: Tw.val(), ins: Ins.val(), oth: Oth.val() };
        }
    },
    checkAndModifyLink: function (element, oldVal) {

        console.log("oldVal", oldVal);
        console.log("element val", element.val());

        if (oldVal === element.val()) {
            return true;
        }
        else {
            element.addClass("changed");
            return false;
        }
    },
    checkFBUrl: function (url) {
        var wwwCheck = /^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i.test(url);
        var webCheck = /^(https?:\/\/)?((web\.)?)facebook.com\/.*/i.test(url);
        var mCheck = /^(https?:\/\/)?((m\.)?)facebook.com\/.*/i.test(url);
        var isvalid = (wwwCheck || webCheck || mCheck);

        return isvalid;
    },
    checkTwitterUrl: function (url) {
        return /^(https?:\/\/)?((w{3}\.)?)twitter.com\/.*/i.test(url);
    },
    checkInstaUrl: function (url) {
        return /^(https?:\/\/)?((w{3}\.)?)instagram.com\/.*/i.test(url);
    },
    validateLinks: function () {
        var isvalid = true;
        $(".contact input.changed").each(function () {
            var self = $(this);
            if (contact.isValidLink(self)) {
                self.removeClass("hasError");
            } else {
                isvalid = false;
                self.addClass("hasError");
            }
        });
        return isvalid;
    },
    checkOtherLink: function (str) {
        regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str)) {
            return true;
        }
        else {
            return false;
        }
    },
    isValidLink: function (urlInput) {
        var val = urlInput.val();
        if (urlInput.hasClass("fb-link")) {
            console.log("validation fb");
            return contact.checkFBUrl(val);
        }
        else if (urlInput.hasClass("tw")) {
            return contact.checkTwitterUrl(val);
        }
        else if (urlInput.hasClass("insta")) {
            return contact.checkInstaUrl(val);
        }
        else if (urlInput.hasClass("oth")) {
            return contact.checkOtherLink(val);
        }
    }
};
header = {
    oldUsername: "",
    oldDescription: "",
    saveListener: $(".header .success"),
    cancelListener: $(".header .cancel"),
    inputs: $(".header textarea, .header input"),
    wrapper: $(".header"),
    buttons: $(".header .buttons-wrapper"),
    ControllerPath: "Profile/",
    ActionPath: "UpdateHeader/",
    init: function () {
        this.domEvents();
        $('.header textarea').each(function () {
            $(this).height($(this).prop('scrollHeight'));
        });
    },
    domEvents: function () {
        this.inputs.keyup(function () {
            header.checkChanges();
        });

        this.inputs.focus(function () {
            // if none of the inputs are changed, save current values as old 
            if (!$(".header textarea.changed").length) {
                header.oldUsername = header.wrapper.find("input[type='text']").val();
                header.oldDescription = header.wrapper.find("textarea").val();
            }
        });

        this.saveListener.click(function () {
            header.save();
        });

        this.cancelListener.click(function () {
            header.cancelSave();
        });
    },
    save: function () {
        var formIsValid = header.validateInputs();
        if (!formIsValid) {
            console.log("Form is not valid !!");
            return false;
        }
        main.startLoading();
        var data = this.checkChanges();
        console.log("data to send", data);
        var endPoint = Path + header.ControllerPath + header.ActionPath;
        $.post(endPoint, data, function (response, status) {
            if (status === 'success') {
                if (response.success) {
                    header.buttons.removeClass("active");
                    header.inputs.removeClass("changed");
                }
                else {
                    main.showPopup(response.message);
                }
            }
            main.endLoading();
            main.resizeTextarea(header.wrapper.find("textarea"));
        });
    },
    cancelSave: function () {
        header.wrapper.find("input[type='text']").val(header.oldUsername);
        header.wrapper.find("textarea").val(header.oldDescription);
        header.buttons.removeClass("active");
        header.inputs.removeClass("changed hasError");
        main.resizeTextarea(header.wrapper.find("textarea"));
    },
    checkChanges: function () {
        var username = this.wrapper.find("input[type='text']");
        var description = this.wrapper.find("textarea");

        var isSame = this.checkAndModifyLink(username, this.oldUsername) &&
            this.checkAndModifyLink(description, this.oldDescription);

        console.log("isChanged", isSame);

        if (isSame) {
            this.buttons.removeClass("active");
        } else {
            this.buttons.addClass("active");
            return { username: username.val(), description: description.val() };
        }
    },
    checkAndModifyLink: function (element, oldVal) {
        if (oldVal === element.val()) {
            return true;
        }
        else {
            element.addClass("changed");
            return false;
        }
    },
    validateInputs: function () {
        var isvalid = true;
        $(".header textarea.changed").each(function () {
            var self = $(this);
            if (header.isValidText(self)) {
                self.removeClass("hasError");
            } else {
                isvalid = false;
                self.addClass("hasError");
            }
        });
        return isvalid;
    },
    isValidText: function (self) {
        return self.val().trim().length > 0;
    }
};
projects = {
    addNewListener: ".projects .add-new",
    templateItem: $(".projects .template.editor"),
    templateItemReady: $(".projects .template.text"),
    itemsContainer: $(".projects .section-data"),
    instructions: $(".projects .sectin-instructions"),
    saveItemListener: ".projects .editor .success",
    cancelItemListener: ".projects .editor .cancel",
    editor: ".projects .editor",
    editorFields: ".projects .section-data .editor .required",
    editingElement: ".projects .section-data .being-edited",
    deleteListener: ".projects .delete",
    editListener: ".projects .edit",
    controllerPath: "Projects/",
    deleteAction: "Delete/",

    init: function () {
        this.domEvents();
    },
    domEvents: function () {
        $("body").on("click", this.addNewListener, function () {
            projects.createAndFillEditor();
        });

        $("body").on("click", this.saveItemListener, function () {
            var formIsValid = projects.validateForm();
            if (formIsValid) {
                projects.saveChanges();
            }
        });

        $("body").on("click", this.cancelItemListener, function () {
            projects.itemsContainer.find(".editor").remove();
            projects.itemsContainer.find(".being-edited").removeClass("being-edited");
            projects.viewHideInstructions();
        });


        $("body").on("click", this.deleteListener, function () {
            var itemToDelete = $(this).closest(".item");
            projects.deleteItem(itemToDelete);
        });

        $("body").on("click", this.editListener, function () {
            var itemToDelete = $(this).closest(".item");
            projects.editItem(itemToDelete);
        });
    },
    createAndFillEditor: function () {
        var newItem = projects.templateItem.clone();
        newItem.removeClass("hidden template");
        projects.itemsContainer.append(newItem);

        setTimeout(function () {
            projects.itemsContainer.find(".editor").addClass("editing");
        }, 100);
        projects.viewHideInstructions();

        var editingItem = $(projects.editingElement);
        var isEdit = editingItem.length === 1;
        console.log("is edit", isEdit);
        if (isEdit) {
            var editor = projects.itemsContainer.find(".editor");
            editor.find(".title").val(editingItem.find(".title").text());
            editor.find(".description").val(editingItem.find(".description").text());
        }
    },
    viewHideInstructions: function () {
        var itemExists = this.itemsContainer.find(".item").length;
        if (itemExists)
            this.instructions.addClass("hidden");
        else
            this.instructions.removeClass("hidden");
    },
    validateForm: function () {
        var isValid = true;
        $(projects.editorFields).each(function () {
            var self = $(this);

            if (self.val().trim().length === 0) {
                isValid = false;
                self.addClass("hasError");
            } else {
                self.removeClass("hasError");
            }
        });
        return isValid;
    },
    saveChanges: function () {
        var savedItem = $(projects.editingElement);
        var isEdit = savedItem.length === 1;
        if (!isEdit) {
            savedItem = projects.templateItemReady.clone();
            savedItem.removeClass("template hidden");
        }

        var editor = projects.itemsContainer.find(".editor");

        savedItem.find(".title").text(editor.find(".title").val());
        savedItem.find(".description").text(editor.find(".description").val());

        if (isEdit) {
            savedItem.removeClass("being-edited");
        }
        else {
            projects.itemsContainer.append(savedItem);
        }

        editor.remove();
        projects.viewHideInstructions();
    },
    deleteItem: function (element) {
        var endPoint = Path + projects.controllerPath + projects.deleteAction;
        main.startLoading();
        //TODO send element id to delete
        $.post(endPoint, { personalId: 1 }, function (response, status) {
            if (status === 'success') {
                if (response.success) {
                    element.remove();
                    projects.viewHideInstructions();
                }
                else {
                    main.showPopup(response.message);
                }
            }
            main.endLoading();
        });
    },
    editItem: function (editItem) {
        editItem.addClass("being-edited");
        projects.createAndFillEditor();
    }
};
references = {
    addNewListener: ".reference .add-new",
    templateItem: $(".reference .template.editor"),
    templateItemReady: $(".reference .template.text"),
    itemsContainer: $(".reference .section-data"),
    instructions: $(".reference .sectin-instructions"),
    saveItemListener: ".reference .editor .success",
    cancelItemListener: ".reference .editor .cancel",
    editor: ".reference .editor",
    editorFields: ".reference .section-data .editor .required",
    editingElement: ".reference .section-data .being-edited",
    deleteListener: ".reference .delete",
    editListener: ".reference .edit",
    controllerPath: "References/",
    deleteAction: "Delete/",

    init: function () {
        this.domEvents();
    },
    domEvents: function () {
        $("body").on("click", this.addNewListener, function () {
            references.createAndFillEditor();
        });

        $("body").on("click", this.saveItemListener, function () {
            var formIsValid = references.validateForm();
            if (formIsValid) {
                references.saveChanges();
            }
        });

        $("body").on("click", this.cancelItemListener, function () {
            references.itemsContainer.find(".editor").remove();
            references.itemsContainer.find(".being-edited").removeClass("being-edited");
            references.viewHideInstructions();
        });


        $("body").on("click", this.deleteListener, function () {
            var itemToDelete = $(this).closest(".item");
            references.deleteItem(itemToDelete);
        });

        $("body").on("click", this.editListener, function () {
            var itemToDelete = $(this).closest(".item");
            references.editItem(itemToDelete);
        });
    },
    createAndFillEditor: function () {
        var newItem = references.templateItem.clone();
        newItem.removeClass("hidden template");
        references.itemsContainer.append(newItem);

        setTimeout(function () {
            references.itemsContainer.find(".editor").addClass("editing");
        }, 100);
        references.viewHideInstructions();

        var editingItem = $(references.editingElement);
        var isEdit = editingItem.length === 1;
        console.log("is edit", isEdit);
        if (isEdit) {
            var editor = references.itemsContainer.find(".editor");
            editor.find(".title").val(editingItem.find(".title").text());
            editor.find(".position").val(editingItem.find(".position").text());
            editor.find(".description").val(editingItem.find(".description").text());
        }
    },
    viewHideInstructions: function () {
        var itemExists = this.itemsContainer.find(".item").length;
        if (itemExists)
            this.instructions.addClass("hidden");
        else
            this.instructions.removeClass("hidden");
    },
    validateForm: function () {
        var isValid = true;
        $(references.editorFields).each(function () {
            var self = $(this);

            if (self.val().trim().length === 0) {
                isValid = false;
                self.addClass("hasError");
            } else {
                self.removeClass("hasError");
            }
        });
        return isValid;
    },
    saveChanges: function () {
        var savedItem = $(references.editingElement);
        var isEdit = savedItem.length === 1;
        if (!isEdit) {
            savedItem = references.templateItemReady.clone();
            savedItem.removeClass("template hidden");
        }

        var editor = references.itemsContainer.find(".editor");

        savedItem.find(".title").text(editor.find(".title").val());
        savedItem.find(".position").text(editor.find(".position").val());
        savedItem.find(".description").text(editor.find(".description").val());

        if (isEdit) {
            savedItem.removeClass("being-edited");
        }
        else {
            references.itemsContainer.append(savedItem);
        }

        editor.remove();
        references.viewHideInstructions();
    },
    deleteItem: function (element) {
        var endPoint = Path + references.controllerPath + references.deleteAction;
        main.startLoading();
        //TODO send element id to delete
        $.post(endPoint, { personalId: 1 }, function (response, status) {
            if (status === 'success') {
                if (response.success) {
                    element.remove();
                    references.viewHideInstructions();
                }
                else {
                    main.showPopup(response.message);
                }
            }
            main.endLoading();
        });
    },
    editItem: function (editItem) {
        editItem.addClass("being-edited");
        references.createAndFillEditor();
    }
};
skills = {
    oldFeatures: "",
    oldOthers: "",
    saveListener: $(".skills .success"),
    cancelListener: $(".skills .cancel"),
    inputs: $(".skills textarea"),
    wrapper: $(".skills"),
    buttons: $(".skills .buttons-wrapper"),
    ControllerPath: "Profile/",
    ActionPath: "UpdateSkills/",
    init: function () {
        this.domEvents();
        $('.skills textarea').each(function () {
            $(this).height($(this).prop('scrollHeight'));
        });
    },
    domEvents: function () {
        this.inputs.keyup(function () {
            skills.checkChanges();
        });

        this.inputs.focus(function () {
            // if none of the inputs are changed, save current values as old 
            if (!$(".skills textarea.changed").length) {
                skills.oldFeatures = skills.wrapper.find(".features").val();
                skills.oldOthers = skills.wrapper.find(".others").val();
            }
        });

        this.saveListener.click(function () {
            skills.save();
        });

        this.cancelListener.click(function () {
            skills.cancelSave();
        });
    },
    save: function () {
        var formIsValid = skills.validateInputs();
        if (!formIsValid) {
            console.log("Form is not valid !!");
            return false;
        }
        main.startLoading();
        var data = this.checkChanges();
        console.log("data to send", data);
        var endPoint = Path + skills.ControllerPath + skills.ActionPath;
        $.post(endPoint, data, function (response, status) {
            if (status === 'success') {
                if (response.success) {
                    skills.buttons.removeClass("active");
                    skills.inputs.removeClass("changed");
                }
                else {
                    main.showPopup(response.message);
                }
            }
            main.endLoading();
            skills.inputs.each(function () {
                main.resizeTextarea($(this));
            });
        });
    },
    cancelSave: function () {
        skills.wrapper.find(".features").val(skills.oldFeatures);
        skills.wrapper.find(".others").val(skills.oldOthers);
        skills.buttons.removeClass("active");
        skills.inputs.removeClass("changed hasError");
        skills.inputs.each(function () {
            main.resizeTextarea($(this));
        });
    },
    checkChanges: function () {
        var features = this.wrapper.find(".features");
        var others = this.wrapper.find(".others");

        var isSame = this.checkAndModifyLink(features, this.oldFeatures) &&
            this.checkAndModifyLink(others, this.oldOthers);

        console.log("isChanged", isSame);

        if (isSame) {
            this.buttons.removeClass("active");
        } else {
            this.buttons.addClass("active");
            return { features: features.val(), others: others.val() };
        }
    },
    checkAndModifyLink: function (element, oldVal) {
        if (oldVal === element.val()) {
            return true;
        }
        else {
            element.addClass("changed");
            return false;
        }
    },
    validateInputs: function () {
        var isvalid = true;
        $(".skills textarea.changed").each(function () {
            var self = $(this);
            if (skills.isValidText(self)) {
                self.removeClass("hasError");
            } else {
                isvalid = false;
                self.addClass("hasError");
            }
        });
        return isvalid;
    },
    isValidText: function (self) {
        return self.val().trim().length > 0;
    }
};
userInfo = {
    navigationListener: ".navigation a",
    init: function () {
        //console.log("userInfo inited!");
        this.domEvenets();
        work.init();
        projects.init();
        references.init();
        contact.init();
        skills.init();
        header.init();
    },
    domEvenets: function () {
        $("body").on("click", this.navigationListener, function () {
            var self = $(this);
            if (self.hasClass("active"))
                return;

            self.parent().find(".active").removeClass("active");
            self.addClass("active");

            var nav = self.attr("data-nav");
            $(".information-wrapper .data-wrapper").attr("data-step", nav);
        });
    }
};
work = {
    addNewListener: ".work-experience .add-new",
    templateItem: $(".work-experience .template.editor"),
    templateItemReady: $(".work-experience .template.text"),
    itemsContainer: $(".work-experience .section-data"),
    instructions: $(".work-experience .sectin-instructions"),
    saveItemListener: ".work-experience .editor .success",
    cancelItemListener: ".work-experience .editor .cancel",
    editor: ".work-experience .editor",
    editorFields: ".work-experience .section-data .editor .required",
    editingElement: ".work-experience .section-data .being-edited",
    deleteListener: ".work-experience .delete",
    editListener: ".work-experience .edit",
    controllerPath: "Work/",
    deleteAction: "Delete/",

    init: function () {
        this.domEvents();
    },
    domEvents: function () {
        $("body").on("click", this.addNewListener, function () {
            work.createAndFillEditor();
        });

        $("body").on("click", this.saveItemListener, function () {
            var formIsValid = work.validateForm();
            if (formIsValid) {
                work.saveChanges();
            }
        });

        $("body").on("click", this.cancelItemListener, function () {
            work.itemsContainer.find(".editor").remove();
            work.itemsContainer.find(".being-edited").removeClass("being-edited");
            work.viewHideInstructions();
        });


        $("body").on("click", this.deleteListener, function () {
            var itemToDelete = $(this).closest(".item");
            work.deleteItem(itemToDelete);
        });

        $("body").on("click", this.editListener, function () {
            var itemToDelete = $(this).closest(".item");
            work.editItem(itemToDelete);
        });
    },
    createAndFillEditor: function () {
        var newItem = work.templateItem.clone();
        newItem.removeClass("hidden template");
        work.itemsContainer.append(newItem);

        setTimeout(function () {
            work.itemsContainer.find(".editor").addClass("editing");
        }, 100);
        work.viewHideInstructions();

        var editingItem = $(work.editingElement);
        var isEdit = editingItem.length === 1;
        console.log("is edit", isEdit);
        if (isEdit) {
            var editor = work.itemsContainer.find(".editor");
            editor.find(".title").val(editingItem.find(".title").text());
            editor.find(".period").val(editingItem.find(".period").text());
            editor.find(".company").val(editingItem.find(".company").text());
            editor.find(".description").val(editingItem.find(".description").text());
        }
    }, 
    viewHideInstructions: function () {
        var itemExists = this.itemsContainer.find(".item").length;
        if (itemExists)
            this.instructions.addClass("hidden");
        else
            this.instructions.removeClass("hidden");
    },
    validateForm: function () {
        var isValid = true;
        $(work.editorFields).each(function () {
            var self = $(this);

            if (self.val().trim().length === 0) {
                isValid = false;
                self.addClass("hasError");
            } else {
                self.removeClass("hasError");
            }
        });
        return isValid;
    },
    saveChanges: function () {
        var savedItem = $(work.editingElement);
        var isEdit = savedItem.length === 1;
        if (!isEdit) {
            savedItem = work.templateItemReady.clone();
            savedItem.removeClass("template hidden");
        }

        var editor = work.itemsContainer.find(".editor");

        savedItem.find(".title").text(editor.find(".title").val());
        savedItem.find(".period").text(editor.find(".period").val());
        savedItem.find(".company").text(editor.find(".company").val());
        savedItem.find(".description").text(editor.find(".description").val());

        if (isEdit) {
            savedItem.removeClass("being-edited");
        }
        else {
            work.itemsContainer.append(savedItem);
        }

        editor.remove();
        work.viewHideInstructions();
    },
    deleteItem: function (element) {
        var endPoint = Path + work.controllerPath + work.deleteAction;
        main.startLoading();
        //TODO send element id to delete
        $.post(endPoint, { personalId: 1 }, function (response, status) {
            if (status === 'success') {
                if (response.success) {
                    element.remove();
                    work.viewHideInstructions();
                }
                else {
                    main.showPopup(response.message);
                }
            }
            main.endLoading();
        });
    }, 
    editItem: function (editItem) {
        editItem.addClass("being-edited");
        work.createAndFillEditor();
    }
};