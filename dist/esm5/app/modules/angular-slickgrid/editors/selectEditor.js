/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { CollectionService } from '../services/index';
import { arraysEqual, findOrDefault, getDescendantProperty, htmlEncode, unsubscribeAllObservables } from '../services/utilities';
import * as DOMPurify_ from 'dompurify';
/** @type {?} */
var DOMPurify = DOMPurify_;
/**
 * Slickgrid editor class for multiple/single select lists
 */
var /**
 * Slickgrid editor class for multiple/single select lists
 */
SelectEditor = /** @class */ (function () {
    function SelectEditor(args, isMultipleSelect) {
        var _this = this;
        this.args = args;
        this.isMultipleSelect = isMultipleSelect;
        /**
         * Observable Subscriptions
         */
        this._subscriptions = [];
        // flag to signal that the editor is destroying itself, helps prevent
        // commit changes from being called twice and erroring
        this._destroying = false;
        this.gridOptions = (/** @type {?} */ (this.args.grid.getOptions()));
        /** @type {?} */
        var gridOptions = this.gridOptions || this.args.column.params || {};
        this._translate = gridOptions.i18n;
        // provide the name attribute to the DOM element which will be needed to auto-adjust drop position (dropup / dropdown)
        /** @type {?} */
        var fieldId = this.columnDef && this.columnDef.id;
        this.elementName = "editor-" + fieldId;
        /** @type {?} */
        var libOptions = {
            autoAdjustDropHeight: true,
            autoAdjustDropPosition: true,
            autoAdjustDropWidthByTextSize: true,
            container: 'body',
            filter: false,
            maxHeight: 275,
            name: this.elementName,
            single: true,
            textTemplate: function ($elm) {
                // render HTML code or not, by default it is sanitized and won't be rendered
                /** @type {?} */
                var isRenderHtmlEnabled = _this.columnDef && _this.columnDef.internalColumnEditor && _this.columnDef.internalColumnEditor.enableRenderHtml || false;
                return isRenderHtmlEnabled ? $elm.text() : $elm.html();
            },
            onBlur: function () { return _this.destroy(); },
            onClose: function () {
                if (!_this._destroying && args.grid.getOptions().autoCommitEdit) {
                    // do not use args.commitChanges() as this sets the focus to the next
                    // row. Also the select list will stay shown when clicking off the grid
                    args.grid.getEditorLock().commitCurrentEdit();
                }
            }
        };
        if (isMultipleSelect) {
            libOptions.single = false;
            libOptions.addTitle = true;
            libOptions.okButton = true;
            libOptions.selectAllDelimiter = ['', ''];
            if (this._translate) {
                libOptions.countSelected = this._translate.instant('X_OF_Y_SELECTED');
                libOptions.allSelected = this._translate.instant('ALL_SELECTED');
                libOptions.selectAllText = this._translate.instant('SELECT_ALL');
            }
        }
        // assign the multiple select lib options
        this.defaultOptions = libOptions;
        this.init();
    }
    Object.defineProperty(SelectEditor.prototype, "collection", {
        /** Get the Collection */
        get: /**
         * Get the Collection
         * @return {?}
         */
        function () {
            return this.columnDef && this.columnDef && this.columnDef.internalColumnEditor.collection || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectEditor.prototype, "collectionOptions", {
        /** Getter for the Collection Options */
        get: /**
         * Getter for the Collection Options
         * @return {?}
         */
        function () {
            return this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.collectionOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectEditor.prototype, "columnDef", {
        /** Get Column Definition object */
        get: /**
         * Get Column Definition object
         * @return {?}
         */
        function () {
            return this.args && this.args.column || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectEditor.prototype, "columnEditor", {
        /** Get Column Editor object */
        get: /**
         * Get Column Editor object
         * @return {?}
         */
        function () {
            return this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectEditor.prototype, "customStructure", {
        /** Getter for the Custom Structure if exist */
        get: /**
         * Getter for the Custom Structure if exist
         * @protected
         * @return {?}
         */
        function () {
            return this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.customStructure;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectEditor.prototype, "currentValues", {
        /**
         * The current selected values (multiple select) from the collection
         */
        get: /**
         * The current selected values (multiple select) from the collection
         * @return {?}
         */
        function () {
            var _this = this;
            // collection of strings, just return the filtered string that are equals
            if (this.collection.every(function (x) { return typeof x === 'string'; })) {
                return this.collection.filter(function (c) { return _this.$editorElm.val().indexOf(c.toString()) !== -1; });
            }
            // collection of label/value pair
            /** @type {?} */
            var separatorBetweenLabels = this.collectionOptions && this.collectionOptions.separatorBetweenTextLabels || '';
            /** @type {?} */
            var isIncludingPrefixSuffix = this.collectionOptions && this.collectionOptions.includePrefixSuffixToSelectedValues || false;
            return this.collection
                .filter(function (c) { return _this.$editorElm.val().indexOf(c[_this.valueName].toString()) !== -1; })
                .map(function (c) {
                /** @type {?} */
                var labelText = c[_this.valueName];
                /** @type {?} */
                var prefixText = c[_this.labelPrefixName] || '';
                /** @type {?} */
                var suffixText = c[_this.labelSuffixName] || '';
                // also translate prefix/suffix if enableTranslateLabel is true and text is a string
                prefixText = (_this.enableTranslateLabel && prefixText && typeof prefixText === 'string') ? _this._translate.instant(prefixText || ' ') : prefixText;
                suffixText = (_this.enableTranslateLabel && suffixText && typeof suffixText === 'string') ? _this._translate.instant(suffixText || ' ') : suffixText;
                if (isIncludingPrefixSuffix) {
                    /** @type {?} */
                    var tmpOptionArray = [prefixText, labelText, suffixText].filter(function (text) { return text; });
                    return tmpOptionArray.join(separatorBetweenLabels);
                }
                return labelText;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectEditor.prototype, "currentValue", {
        /**
         * The current selected values (single select) from the collection
         */
        get: /**
         * The current selected values (single select) from the collection
         * @return {?}
         */
        function () {
            var _this = this;
            // collection of strings, just return the filtered string that are equals
            if (this.collection.every(function (x) { return typeof x === 'string'; })) {
                return findOrDefault(this.collection, function (c) { return c.toString() === _this.$editorElm.val(); });
            }
            // collection of label/value pair
            /** @type {?} */
            var separatorBetweenLabels = this.collectionOptions && this.collectionOptions.separatorBetweenTextLabels || '';
            /** @type {?} */
            var isIncludingPrefixSuffix = this.collectionOptions && this.collectionOptions.includePrefixSuffixToSelectedValues || false;
            /** @type {?} */
            var itemFound = findOrDefault(this.collection, function (c) { return c[_this.valueName].toString() === _this.$editorElm.val(); });
            if (itemFound) {
                /** @type {?} */
                var labelText = itemFound[this.valueName];
                if (isIncludingPrefixSuffix) {
                    /** @type {?} */
                    var prefixText = itemFound[this.labelPrefixName] || '';
                    /** @type {?} */
                    var suffixText = itemFound[this.labelSuffixName] || '';
                    // also translate prefix/suffix if enableTranslateLabel is true and text is a string
                    prefixText = (this.enableTranslateLabel && prefixText && typeof prefixText === 'string') ? this._translate.instant(prefixText || ' ') : prefixText;
                    suffixText = (this.enableTranslateLabel && suffixText && typeof suffixText === 'string') ? this._translate.instant(suffixText || ' ') : suffixText;
                    // add to a temp array for joining purpose and filter out empty text
                    /** @type {?} */
                    var tmpOptionArray = [prefixText, labelText, suffixText].filter(function (text) { return text; });
                    return tmpOptionArray.join(separatorBetweenLabels);
                }
                return labelText;
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectEditor.prototype, "validator", {
        /** Get the Validator function, can be passed in Editor property or Column Definition */
        get: /**
         * Get the Validator function, can be passed in Editor property or Column Definition
         * @return {?}
         */
        function () {
            return this.columnEditor.validator || this.columnDef.validator;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SelectEditor.prototype.init = /**
     * @return {?}
     */
    function () {
        if (!this.args) {
            throw new Error('[Angular-SlickGrid] An editor must always have an "init()" with valid arguments.');
        }
        if (!this.columnDef || !this.columnDef.internalColumnEditor || (!this.columnDef.internalColumnEditor.collection && !this.columnDef.internalColumnEditor.collectionAsync)) {
            throw new Error("[Angular-SlickGrid] You need to pass a \"collection\" (or \"collectionAsync\") inside Column Definition Editor for the MultipleSelect/SingleSelect Editor to work correctly.\n      Also each option should include a value/label pair (or value/labelKey when using Locale).\n      For example: { editor: { collection: [{ value: true, label: 'True' },{ value: false, label: 'False'}] } }");
        }
        this._collectionService = new CollectionService(this._translate);
        this.enableTranslateLabel = (this.columnDef.internalColumnEditor.enableTranslateLabel) ? this.columnDef.internalColumnEditor.enableTranslateLabel : false;
        this.labelName = this.customStructure && this.customStructure.label || 'label';
        this.labelPrefixName = this.customStructure && this.customStructure.labelPrefix || 'labelPrefix';
        this.labelSuffixName = this.customStructure && this.customStructure.labelSuffix || 'labelSuffix';
        this.optionLabel = this.customStructure && this.customStructure.optionLabel || 'value';
        this.valueName = this.customStructure && this.customStructure.value || 'value';
        if (this.enableTranslateLabel && (!this._translate || typeof this._translate.instant !== 'function')) {
            throw new Error("[select-editor] The ngx-translate TranslateService is required for the Select Editor to work correctly");
        }
        // always render the Select (dropdown) DOM element, even if user passed a "collectionAsync",
        // if that is the case, the Select will simply be without any options but we still have to render it (else SlickGrid would throw an error)
        this.renderDomElement(this.collection);
    };
    /**
     * @param {?} item
     * @param {?} state
     * @return {?}
     */
    SelectEditor.prototype.applyValue = /**
     * @param {?} item
     * @param {?} state
     * @return {?}
     */
    function (item, state) {
        item[this.columnDef.field] = state;
    };
    /**
     * @return {?}
     */
    SelectEditor.prototype.destroy = /**
     * @return {?}
     */
    function () {
        this._destroying = true;
        if (this.$editorElm && this.$editorElm.multipleSelect) {
            this.$editorElm.multipleSelect('close');
            this.$editorElm.remove();
        }
        this._subscriptions = unsubscribeAllObservables(this._subscriptions);
    };
    /**
     * @param {?} item
     * @return {?}
     */
    SelectEditor.prototype.loadValue = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        if (this.isMultipleSelect) {
            this.loadMultipleValues(item);
        }
        else {
            this.loadSingleValue(item);
        }
        this.refresh();
    };
    /**
     * @param {?} items
     * @return {?}
     */
    SelectEditor.prototype.loadMultipleValues = /**
     * @param {?} items
     * @return {?}
     */
    function (items) {
        var _this = this;
        // convert to string because that is how the DOM will return these values
        this.defaultValue = items[this.columnDef.field].map(function (i) { return i.toString(); });
        this.$editorElm.find('option').each(function (i, $e) {
            $e.selected = (_this.defaultValue.indexOf($e.value) !== -1);
        });
    };
    /**
     * @param {?} item
     * @return {?}
     */
    SelectEditor.prototype.loadSingleValue = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        var _this = this;
        // convert to string because that is how the DOM will return these values
        // make sure the prop exists first
        this.defaultValue = item[this.columnDef.field] && item[this.columnDef.field].toString();
        this.$editorElm.find('option').each(function (i, $e) {
            $e.selected = (_this.defaultValue === $e.value);
        });
    };
    /**
     * @return {?}
     */
    SelectEditor.prototype.serializeValue = /**
     * @return {?}
     */
    function () {
        return (this.isMultipleSelect) ? this.currentValues : this.currentValue;
    };
    /**
     * @return {?}
     */
    SelectEditor.prototype.focus = /**
     * @return {?}
     */
    function () {
        if (this.$editorElm && this.$editorElm.multipleSelect) {
            this.$editorElm.multipleSelect('focus');
        }
    };
    /**
     * @return {?}
     */
    SelectEditor.prototype.isValueChanged = /**
     * @return {?}
     */
    function () {
        if (this.isMultipleSelect) {
            return !arraysEqual(this.$editorElm.val(), this.defaultValue);
        }
        return this.$editorElm.val() !== this.defaultValue;
    };
    /**
     * @return {?}
     */
    SelectEditor.prototype.validate = /**
     * @return {?}
     */
    function () {
        if (this.validator) {
            /** @type {?} */
            var value = this.isMultipleSelect ? this.currentValues : this.currentValue;
            /** @type {?} */
            var validationResults = this.validator(value, this.args);
            if (!validationResults.valid) {
                return validationResults;
            }
        }
        // by default the editor is always valid
        // if user want it to be a required checkbox, he would have to provide his own validator
        return {
            valid: true,
            msg: null
        };
    };
    //
    // protected functions
    // ------------------
    /**
     * user might want to filter certain items of the collection
     * @param inputCollection
     * @return outputCollection filtered and/or sorted collection
     */
    //
    // protected functions
    // ------------------
    /**
     * user might want to filter certain items of the collection
     * @protected
     * @param {?} inputCollection
     * @return {?} outputCollection filtered and/or sorted collection
     */
    SelectEditor.prototype.filterCollection = 
    //
    // protected functions
    // ------------------
    /**
     * user might want to filter certain items of the collection
     * @protected
     * @param {?} inputCollection
     * @return {?} outputCollection filtered and/or sorted collection
     */
    function (inputCollection) {
        /** @type {?} */
        var outputCollection = inputCollection;
        // user might want to filter certain items of the collection
        if (this.columnEditor && this.columnEditor.collectionFilterBy) {
            /** @type {?} */
            var filterBy = this.columnEditor.collectionFilterBy;
            /** @type {?} */
            var filterCollectionBy = this.columnEditor.collectionOptions && this.columnEditor.collectionOptions.filterAfterEachPass || null;
            outputCollection = this._collectionService.filterCollection(outputCollection, filterBy, filterCollectionBy);
        }
        return outputCollection;
    };
    /**
     * user might want to sort the collection in a certain way
     * @param inputCollection
     * @return outputCollection sorted collection
     */
    /**
     * user might want to sort the collection in a certain way
     * @protected
     * @param {?} inputCollection
     * @return {?} outputCollection sorted collection
     */
    SelectEditor.prototype.sortCollection = /**
     * user might want to sort the collection in a certain way
     * @protected
     * @param {?} inputCollection
     * @return {?} outputCollection sorted collection
     */
    function (inputCollection) {
        /** @type {?} */
        var outputCollection = inputCollection;
        // user might want to sort the collection
        if (this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.collectionSortBy) {
            /** @type {?} */
            var sortBy = this.columnDef.internalColumnEditor.collectionSortBy;
            outputCollection = this._collectionService.sortCollection(outputCollection, sortBy, this.enableTranslateLabel);
        }
        return outputCollection;
    };
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    SelectEditor.prototype.renderDomElement = /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    function (collection) {
        if (!Array.isArray(collection) && this.collectionOptions && this.collectionOptions.collectionInObjectProperty) {
            collection = getDescendantProperty(collection, this.collectionOptions.collectionInObjectProperty);
        }
        if (!Array.isArray(collection)) {
            throw new Error('The "collection" passed to the Select Editor is not a valid array');
        }
        // user can optionally add a blank entry at the beginning of the collection
        if (this.collectionOptions && this.collectionOptions.addBlankEntry) {
            collection.unshift(this.createBlankEntry());
        }
        /** @type {?} */
        var newCollection = collection || [];
        // user might want to filter and/or sort certain items of the collection
        newCollection = this.filterCollection(newCollection);
        newCollection = this.sortCollection(newCollection);
        // step 1, create HTML string template
        /** @type {?} */
        var editorTemplate = this.buildTemplateHtmlString(newCollection);
        // step 2, create the DOM Element of the editor
        // also subscribe to the onClose event
        this.createDomElement(editorTemplate);
    };
    /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    SelectEditor.prototype.buildTemplateHtmlString = /**
     * @protected
     * @param {?} collection
     * @return {?}
     */
    function (collection) {
        var _this = this;
        /** @type {?} */
        var options = '';
        /** @type {?} */
        var fieldId = this.columnDef && this.columnDef.id;
        /** @type {?} */
        var separatorBetweenLabels = this.collectionOptions && this.collectionOptions.separatorBetweenTextLabels || '';
        /** @type {?} */
        var isRenderHtmlEnabled = this.columnDef.internalColumnEditor.enableRenderHtml || false;
        /** @type {?} */
        var sanitizedOptions = this.gridOptions && this.gridOptions.sanitizeHtmlOptions || {};
        // collection could be an Array of Strings OR Objects
        if (collection.every(function (x) { return typeof x === 'string'; })) {
            collection.forEach(function (option) {
                options += "<option value=\"" + option + "\" label=\"" + option + "\">" + option + "</option>";
            });
        }
        else {
            // array of objects will require a label/value pair unless a customStructure is passed
            collection.forEach(function (option) {
                if (!option || (option[_this.labelName] === undefined && option.labelKey === undefined)) {
                    throw new Error("[select-editor] A collection with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example: { collection: [ { value: '1', label: 'One' } ])");
                }
                /** @type {?} */
                var labelKey = (/** @type {?} */ ((option.labelKey || option[_this.labelName])));
                /** @type {?} */
                var labelText = ((option.labelKey || _this.enableTranslateLabel) && labelKey) ? _this._translate.instant(labelKey || ' ') : labelKey;
                /** @type {?} */
                var prefixText = option[_this.labelPrefixName] || '';
                /** @type {?} */
                var suffixText = option[_this.labelSuffixName] || '';
                /** @type {?} */
                var optionLabel = option[_this.optionLabel] || '';
                optionLabel = optionLabel.toString().replace(/\"/g, '\''); // replace double quotes by single quotes to avoid interfering with regular html
                // also translate prefix/suffix if enableTranslateLabel is true and text is a string
                prefixText = (_this.enableTranslateLabel && prefixText && typeof prefixText === 'string') ? _this._translate.instant(prefixText || ' ') : prefixText;
                suffixText = (_this.enableTranslateLabel && suffixText && typeof suffixText === 'string') ? _this._translate.instant(suffixText || ' ') : suffixText;
                optionLabel = (_this.enableTranslateLabel && optionLabel && typeof optionLabel === 'string') ? _this._translate.instant(optionLabel || ' ') : optionLabel;
                // add to a temp array for joining purpose and filter out empty text
                /** @type {?} */
                var tmpOptionArray = [prefixText, labelText, suffixText].filter(function (text) { return text; });
                /** @type {?} */
                var optionText = tmpOptionArray.join(separatorBetweenLabels);
                // if user specifically wants to render html text, he needs to opt-in else it will stripped out by default
                // also, the 3rd party lib will saninitze any html code unless it's encoded, so we'll do that
                if (isRenderHtmlEnabled) {
                    // sanitize any unauthorized html tags like script and others
                    // for the remaining allowed tags we'll permit all attributes
                    /** @type {?} */
                    var sanitizedText = DOMPurify.sanitize(optionText, sanitizedOptions);
                    optionText = htmlEncode(sanitizedText);
                }
                options += "<option value=\"" + option[_this.valueName] + "\" label=\"" + optionLabel + "\">" + optionText + "</option>";
            });
        }
        return "<select id=\"" + this.elementName + "\" class=\"ms-filter search-filter editor-" + fieldId + "\" " + (this.isMultipleSelect ? 'multiple="multiple"' : '') + ">" + options + "</select>";
    };
    /** Create a blank entry that can be added to the collection. It will also reuse the same customStructure if need be */
    /**
     * Create a blank entry that can be added to the collection. It will also reuse the same customStructure if need be
     * @protected
     * @return {?}
     */
    SelectEditor.prototype.createBlankEntry = /**
     * Create a blank entry that can be added to the collection. It will also reuse the same customStructure if need be
     * @protected
     * @return {?}
     */
    function () {
        var _a;
        /** @type {?} */
        var blankEntry = (_a = {},
            _a[this.labelName] = '',
            _a[this.valueName] = '',
            _a);
        if (this.labelPrefixName) {
            blankEntry[this.labelPrefixName] = '';
        }
        if (this.labelSuffixName) {
            blankEntry[this.labelSuffixName] = '';
        }
        return blankEntry;
    };
    /** Build the template HTML string */
    /**
     * Build the template HTML string
     * @protected
     * @param {?} editorTemplate
     * @return {?}
     */
    SelectEditor.prototype.createDomElement = /**
     * Build the template HTML string
     * @protected
     * @param {?} editorTemplate
     * @return {?}
     */
    function (editorTemplate) {
        var _this = this;
        this.$editorElm = $(editorTemplate);
        if (this.$editorElm && typeof this.$editorElm.appendTo === 'function') {
            this.$editorElm.appendTo(this.args.container);
        }
        if (typeof this.$editorElm.multipleSelect !== 'function') {
            // fallback to bootstrap
            this.$editorElm.addClass('form-control');
        }
        else {
            /** @type {?} */
            var elementOptions = (this.columnDef.internalColumnEditor) ? this.columnDef.internalColumnEditor.elementOptions : {};
            this.editorElmOptions = tslib_1.__assign({}, this.defaultOptions, elementOptions);
            this.$editorElm = this.$editorElm.multipleSelect(this.editorElmOptions);
            setTimeout(function () { return _this.$editorElm.multipleSelect('open'); });
        }
    };
    // refresh the jquery object because the selected checkboxes were already set
    // prior to this method being called
    // refresh the jquery object because the selected checkboxes were already set
    // prior to this method being called
    /**
     * @protected
     * @return {?}
     */
    SelectEditor.prototype.refresh = 
    // refresh the jquery object because the selected checkboxes were already set
    // prior to this method being called
    /**
     * @protected
     * @return {?}
     */
    function () {
        if (typeof this.$editorElm.multipleSelect === 'function') {
            this.$editorElm.multipleSelect('refresh');
        }
    };
    return SelectEditor;
}());
/**
 * Slickgrid editor class for multiple/single select lists
 */
export { SelectEditor };
if (false) {
    /**
     * The JQuery DOM element
     * @type {?}
     */
    SelectEditor.prototype.$editorElm;
    /**
     * Editor Multiple-Select options
     * @type {?}
     */
    SelectEditor.prototype.editorElmOptions;
    /**
     * DOM Element Name, useful for auto-detecting positioning (dropup / dropdown)
     * @type {?}
     */
    SelectEditor.prototype.elementName;
    /**
     * The multiple-select options for a multiple select list
     * @type {?}
     */
    SelectEditor.prototype.defaultOptions;
    /**
     * The default item values that are set
     * @type {?}
     */
    SelectEditor.prototype.defaultValue;
    /**
     * The property name for values in the collection
     * @type {?}
     */
    SelectEditor.prototype.valueName;
    /**
     * The property name for labels in the collection
     * @type {?}
     */
    SelectEditor.prototype.labelName;
    /**
     * The property name for a prefix that can be added to the labels in the collection
     * @type {?}
     */
    SelectEditor.prototype.labelPrefixName;
    /**
     * The property name for a suffix that can be added to the labels in the collection
     * @type {?}
     */
    SelectEditor.prototype.labelSuffixName;
    /**
     * A label that can be added to each option and can be used as an alternative to display selected options
     * @type {?}
     */
    SelectEditor.prototype.optionLabel;
    /**
     * Grid options
     * @type {?}
     */
    SelectEditor.prototype.gridOptions;
    /**
     * Do we translate the label?
     * @type {?}
     */
    SelectEditor.prototype.enableTranslateLabel;
    /**
     * Observable Subscriptions
     * @type {?}
     */
    SelectEditor.prototype._subscriptions;
    /**
     * @type {?}
     * @protected
     */
    SelectEditor.prototype._destroying;
    /**
     * Collection Service
     * @type {?}
     * @protected
     */
    SelectEditor.prototype._collectionService;
    /**
     * The translate library
     * @type {?}
     * @protected
     */
    SelectEditor.prototype._translate;
    /**
     * @type {?}
     * @protected
     */
    SelectEditor.prototype.args;
    /**
     * @type {?}
     * @protected
     */
    SelectEditor.prototype.isMultipleSelect;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0RWRpdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1zbGlja2dyaWQvIiwic291cmNlcyI6WyJhcHAvbW9kdWxlcy9hbmd1bGFyLXNsaWNrZ3JpZC9lZGl0b3JzL3NlbGVjdEVkaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQVlBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLHFCQUFxQixFQUFFLFVBQVUsRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRWpJLE9BQU8sS0FBSyxVQUFVLE1BQU0sV0FBVyxDQUFDOztJQUNsQyxTQUFTLEdBQUcsVUFBVTs7OztBQVE1Qjs7OztJQWtERSxzQkFBc0IsSUFBUyxFQUFZLGdCQUFnQjtRQUEzRCxpQkFrREM7UUFsRHFCLFNBQUksR0FBSixJQUFJLENBQUs7UUFBWSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQUE7Ozs7UUFaM0QsbUJBQWMsR0FBbUIsRUFBRSxDQUFDOzs7UUFJMUIsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFTNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxtQkFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBYyxDQUFDOztZQUN2RCxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRTtRQUNyRSxJQUFJLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUM7OztZQUc3QixPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDbkQsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFVLE9BQVMsQ0FBQzs7WUFFakMsVUFBVSxHQUF5QjtZQUN2QyxvQkFBb0IsRUFBRSxJQUFJO1lBQzFCLHNCQUFz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QVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUN4RSxVQUFVLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUF0QyxDQUFzQyxDQUFDLENBQUM7U0FDMUQ7SUFDSCxDQUFDO0lBRUQsNkVBQTZFO0lBQzdFLG9DQUFvQzs7Ozs7OztJQUMxQiw4QkFBTzs7Ozs7OztJQUFqQjtRQUNFLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsS0FBSyxVQUFVLEVBQUU7WUFDeEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDM0M7SUFDSCxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBOWNELElBOGNDOzs7Ozs7Ozs7O0lBNWNDLGtDQUFnQjs7Ozs7SUFHaEIsd0NBQXVDOzs7OztJQUd2QyxtQ0FBb0I7Ozs7O0lBR3BCLHNDQUFxQzs7Ozs7SUFHckMsb0NBQW9COzs7OztJQUdwQixpQ0FBa0I7Ozs7O0lBR2xCLGlDQUFrQjs7Ozs7SUFHbEIsdUNBQXdCOzs7OztJQUd4Qix1Q0FBd0I7Ozs7O0lBR3hCLG1DQUFvQjs7Ozs7SUFHcEIsbUNBQXdCOzs7OztJQUd4Qiw0Q0FBOEI7Ozs7O0lBRzlCLHNDQUFvQzs7Ozs7SUFJcEMsbUNBQThCOzs7Ozs7SUFHOUIsMENBQWdEOzs7Ozs7SUFHaEQsa0NBQXVDOzs7OztJQUUzQiw0QkFBbUI7Ozs7O0lBQUUsd0NBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIENvbGxlY3Rpb25DdXN0b21TdHJ1Y3R1cmUsXHJcbiAgQ29sbGVjdGlvbk9wdGlvbixcclxuICBDb2x1bW4sXHJcbiAgRWRpdG9yLFxyXG4gIEVkaXRvclZhbGlkYXRvcixcclxuICBFZGl0b3JWYWxpZGF0b3JPdXRwdXQsXHJcbiAgR3JpZE9wdGlvbixcclxuICBNdWx0aXBsZVNlbGVjdE9wdGlvbixcclxuICBTZWxlY3RPcHRpb24sXHJcbn0gZnJvbSAnLi8uLi9tb2RlbHMvaW5kZXgnO1xyXG5pbXBvcnQgeyBDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2luZGV4JztcclxuaW1wb3J0IHsgYXJyYXlzRXF1YWwsIGZpbmRPckRlZmF1bHQsIGdldERlc2NlbmRhbnRQcm9wZXJ0eSwgaHRtbEVuY29kZSwgdW5zdWJzY3JpYmVBbGxPYnNlcnZhYmxlcyB9IGZyb20gJy4uL3NlcnZpY2VzL3V0aWxpdGllcyc7XHJcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgKiBhcyBET01QdXJpZnlfIGZyb20gJ2RvbXB1cmlmeSc7XHJcbmNvbnN0IERPTVB1cmlmeSA9IERPTVB1cmlmeV87IC8vIHBhdGNoIHRvIGZpeCByb2xsdXAgdG8gd29ya1xyXG5cclxuLy8gdXNpbmcgZXh0ZXJuYWwgbm9uLXR5cGVkIGpzIGxpYnJhcmllc1xyXG5kZWNsYXJlIHZhciAkOiBhbnk7XHJcblxyXG4vKipcclxuICogU2xpY2tncmlkIGVkaXRvciBjbGFzcyBmb3IgbXVsdGlwbGUvc2luZ2xlIHNlbGVjdCBsaXN0c1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlbGVjdEVkaXRvciBpbXBsZW1lbnRzIEVkaXRvciB7XHJcbiAgLyoqIFRoZSBKUXVlcnkgRE9NIGVsZW1lbnQgKi9cclxuICAkZWRpdG9yRWxtOiBhbnk7XHJcblxyXG4gIC8qKiBFZGl0b3IgTXVsdGlwbGUtU2VsZWN0IG9wdGlvbnMgKi9cclxuICBlZGl0b3JFbG1PcHRpb25zOiBNdWx0aXBsZVNlbGVjdE9wdGlvbjtcclxuXHJcbiAgLyoqIERPTSBFbGVtZW50IE5hbWUsIHVzZWZ1bCBmb3IgYXV0by1kZXRlY3RpbmcgcG9zaXRpb25pbmcgKGRyb3B1cCAvIGRyb3Bkb3duKSAqL1xyXG4gIGVsZW1lbnROYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBUaGUgbXVsdGlwbGUtc2VsZWN0IG9wdGlvbnMgZm9yIGEgbXVsdGlwbGUgc2VsZWN0IGxpc3QgKi9cclxuICBkZWZhdWx0T3B0aW9uczogTXVsdGlwbGVTZWxlY3RPcHRpb247XHJcblxyXG4gIC8qKiBUaGUgZGVmYXVsdCBpdGVtIHZhbHVlcyB0aGF0IGFyZSBzZXQgKi9cclxuICBkZWZhdWx0VmFsdWU6IGFueVtdO1xyXG5cclxuICAvKiogVGhlIHByb3BlcnR5IG5hbWUgZm9yIHZhbHVlcyBpbiB0aGUgY29sbGVjdGlvbiAqL1xyXG4gIHZhbHVlTmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogVGhlIHByb3BlcnR5IG5hbWUgZm9yIGxhYmVscyBpbiB0aGUgY29sbGVjdGlvbiAqL1xyXG4gIGxhYmVsTmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogVGhlIHByb3BlcnR5IG5hbWUgZm9yIGEgcHJlZml4IHRoYXQgY2FuIGJlIGFkZGVkIHRvIHRoZSBsYWJlbHMgaW4gdGhlIGNvbGxlY3Rpb24gKi9cclxuICBsYWJlbFByZWZpeE5hbWU6IHN0cmluZztcclxuXHJcbiAgLyoqIFRoZSBwcm9wZXJ0eSBuYW1lIGZvciBhIHN1ZmZpeCB0aGF0IGNhbiBiZSBhZGRlZCB0byB0aGUgbGFiZWxzIGluIHRoZSBjb2xsZWN0aW9uICovXHJcbiAgbGFiZWxTdWZmaXhOYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBBIGxhYmVsIHRoYXQgY2FuIGJlIGFkZGVkIHRvIGVhY2ggb3B0aW9uIGFuZCBjYW4gYmUgdXNlZCBhcyBhbiBhbHRlcm5hdGl2ZSB0byBkaXNwbGF5IHNlbGVjdGVkIG9wdGlvbnMgKi9cclxuICBvcHRpb25MYWJlbDogc3RyaW5nO1xyXG5cclxuICAvKiogR3JpZCBvcHRpb25zICovXHJcbiAgZ3JpZE9wdGlvbnM6IEdyaWRPcHRpb247XHJcblxyXG4gIC8qKiBEbyB3ZSB0cmFuc2xhdGUgdGhlIGxhYmVsPyAqL1xyXG4gIGVuYWJsZVRyYW5zbGF0ZUxhYmVsOiBib29sZWFuO1xyXG5cclxuICAvKiogT2JzZXJ2YWJsZSBTdWJzY3JpcHRpb25zICovXHJcbiAgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XHJcblxyXG4gIC8vIGZsYWcgdG8gc2lnbmFsIHRoYXQgdGhlIGVkaXRvciBpcyBkZXN0cm95aW5nIGl0c2VsZiwgaGVscHMgcHJldmVudFxyXG4gIC8vIGNvbW1pdCBjaGFuZ2VzIGZyb20gYmVpbmcgY2FsbGVkIHR3aWNlIGFuZCBlcnJvcmluZ1xyXG4gIHByb3RlY3RlZCBfZGVzdHJveWluZyA9IGZhbHNlO1xyXG5cclxuICAvKiogQ29sbGVjdGlvbiBTZXJ2aWNlICovXHJcbiAgcHJvdGVjdGVkIF9jb2xsZWN0aW9uU2VydmljZTogQ29sbGVjdGlvblNlcnZpY2U7XHJcblxyXG4gIC8qKiBUaGUgdHJhbnNsYXRlIGxpYnJhcnkgKi9cclxuICBwcm90ZWN0ZWQgX3RyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFyZ3M6IGFueSwgcHJvdGVjdGVkIGlzTXVsdGlwbGVTZWxlY3QpIHtcclxuICAgIHRoaXMuZ3JpZE9wdGlvbnMgPSB0aGlzLmFyZ3MuZ3JpZC5nZXRPcHRpb25zKCkgYXMgR3JpZE9wdGlvbjtcclxuICAgIGNvbnN0IGdyaWRPcHRpb25zID0gdGhpcy5ncmlkT3B0aW9ucyB8fCB0aGlzLmFyZ3MuY29sdW1uLnBhcmFtcyB8fCB7fTtcclxuICAgIHRoaXMuX3RyYW5zbGF0ZSA9IGdyaWRPcHRpb25zLmkxOG47XHJcblxyXG4gICAgLy8gcHJvdmlkZSB0aGUgbmFtZSBhdHRyaWJ1dGUgdG8gdGhlIERPTSBlbGVtZW50IHdoaWNoIHdpbGwgYmUgbmVlZGVkIHRvIGF1dG8tYWRqdXN0IGRyb3AgcG9zaXRpb24gKGRyb3B1cCAvIGRyb3Bkb3duKVxyXG4gICAgY29uc3QgZmllbGRJZCA9IHRoaXMuY29sdW1uRGVmICYmIHRoaXMuY29sdW1uRGVmLmlkO1xyXG4gICAgdGhpcy5lbGVtZW50TmFtZSA9IGBlZGl0b3ItJHtmaWVsZElkfWA7XHJcblxyXG4gICAgY29uc3QgbGliT3B0aW9uczogTXVsdGlwbGVTZWxlY3RPcHRpb24gPSB7XHJcbiAgICAgIGF1dG9BZGp1c3REcm9wSGVpZ2h0OiB0cnVlLFxyXG4gICAgICBhdXRvQWRqdXN0RHJvcFBvc2l0aW9uOiB0cnVlLFxyXG4gICAgICBhdXRvQWRqdXN0RHJvcFdpZHRoQnlUZXh0U2l6ZTogdHJ1ZSxcclxuICAgICAgY29udGFpbmVyOiAnYm9keScsXHJcbiAgICAgIGZpbHRlcjogZmFsc2UsXHJcbiAgICAgIG1heEhlaWdodDogMjc1LFxyXG4gICAgICBuYW1lOiB0aGlzLmVsZW1lbnROYW1lLFxyXG4gICAgICBzaW5nbGU6IHRydWUsXHJcbiAgICAgIHRleHRUZW1wbGF0ZTogKCRlbG0pID0+IHtcclxuICAgICAgICAvLyByZW5kZXIgSFRNTCBjb2RlIG9yIG5vdCwgYnkgZGVmYXVsdCBpdCBpcyBzYW5pdGl6ZWQgYW5kIHdvbid0IGJlIHJlbmRlcmVkXHJcbiAgICAgICAgY29uc3QgaXNSZW5kZXJIdG1sRW5hYmxlZCA9IHRoaXMuY29sdW1uRGVmICYmIHRoaXMuY29sdW1uRGVmLmludGVybmFsQ29sdW1uRWRpdG9yICYmIHRoaXMuY29sdW1uRGVmLmludGVybmFsQ29sdW1uRWRpdG9yLmVuYWJsZVJlbmRlckh0bWwgfHwgZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIGlzUmVuZGVySHRtbEVuYWJsZWQgPyAkZWxtLnRleHQoKSA6ICRlbG0uaHRtbCgpO1xyXG4gICAgICB9LFxyXG4gICAgICBvbkJsdXI6ICgpID0+IHRoaXMuZGVzdHJveSgpLFxyXG4gICAgICBvbkNsb3NlOiAoKSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9kZXN0cm95aW5nICYmIGFyZ3MuZ3JpZC5nZXRPcHRpb25zKCkuYXV0b0NvbW1pdEVkaXQpIHtcclxuICAgICAgICAgIC8vIGRvIG5vdCB1c2UgYXJncy5jb21taXRDaGFuZ2VzKCkgYXMgdGhpcyBzZXRzIHRoZSBmb2N1cyB0byB0aGUgbmV4dFxyXG4gICAgICAgICAgLy8gcm93LiBBbHNvIHRoZSBzZWxlY3QgbGlzdCB3aWxsIHN0YXkgc2hvd24gd2hlbiBjbGlja2luZyBvZmYgdGhlIGdyaWRcclxuICAgICAgICAgIGFyZ3MuZ3JpZC5nZXRFZGl0b3JMb2NrKCkuY29tbWl0Q3VycmVudEVkaXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaWYgKGlzTXVsdGlwbGVTZWxlY3QpIHtcclxuICAgICAgbGliT3B0aW9ucy5zaW5nbGUgPSBmYWxzZTtcclxuICAgICAgbGliT3B0aW9ucy5hZGRUaXRsZSA9IHRydWU7XHJcbiAgICAgIGxpYk9wdGlvbnMub2tCdXR0b24gPSB0cnVlO1xyXG4gICAgICBsaWJPcHRpb25zLnNlbGVjdEFsbERlbGltaXRlciA9IFsnJywgJyddO1xyXG5cclxuICAgICAgaWYgKHRoaXMuX3RyYW5zbGF0ZSkge1xyXG4gICAgICAgIGxpYk9wdGlvbnMuY291bnRTZWxlY3RlZCA9IHRoaXMuX3RyYW5zbGF0ZS5pbnN0YW50KCdYX09GX1lfU0VMRUNURUQnKTtcclxuICAgICAgICBsaWJPcHRpb25zLmFsbFNlbGVjdGVkID0gdGhpcy5fdHJhbnNsYXRlLmluc3RhbnQoJ0FMTF9TRUxFQ1RFRCcpO1xyXG4gICAgICAgIGxpYk9wdGlvbnMuc2VsZWN0QWxsVGV4dCA9IHRoaXMuX3RyYW5zbGF0ZS5pbnN0YW50KCdTRUxFQ1RfQUxMJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBhc3NpZ24gdGhlIG11bHRpcGxlIHNlbGVjdCBsaWIgb3B0aW9uc1xyXG4gICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IGxpYk9wdGlvbnM7XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKiogR2V0IHRoZSBDb2xsZWN0aW9uICovXHJcbiAgZ2V0IGNvbGxlY3Rpb24oKTogYW55W10ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29sdW1uRGVmICYmIHRoaXMuY29sdW1uRGVmICYmIHRoaXMuY29sdW1uRGVmLmludGVybmFsQ29sdW1uRWRpdG9yLmNvbGxlY3Rpb24gfHwgW107XHJcbiAgfVxyXG5cclxuICAvKiogR2V0dGVyIGZvciB0aGUgQ29sbGVjdGlvbiBPcHRpb25zICovXHJcbiAgZ2V0IGNvbGxlY3Rpb25PcHRpb25zKCk6IENvbGxlY3Rpb25PcHRpb24ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29sdW1uRGVmICYmIHRoaXMuY29sdW1uRGVmLmludGVybmFsQ29sdW1uRWRpdG9yICYmIHRoaXMuY29sdW1uRGVmLmludGVybmFsQ29sdW1uRWRpdG9yLmNvbGxlY3Rpb25PcHRpb25zO1xyXG4gIH1cclxuXHJcbiAgLyoqIEdldCBDb2x1bW4gRGVmaW5pdGlvbiBvYmplY3QgKi9cclxuICBnZXQgY29sdW1uRGVmKCk6IENvbHVtbiB7XHJcbiAgICByZXR1cm4gdGhpcy5hcmdzICYmIHRoaXMuYXJncy5jb2x1bW4gfHwge307XHJcbiAgfVxyXG5cclxuICAvKiogR2V0IENvbHVtbiBFZGl0b3Igb2JqZWN0ICovXHJcbiAgZ2V0IGNvbHVtbkVkaXRvcigpOiBhbnkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29sdW1uRGVmICYmIHRoaXMuY29sdW1uRGVmLmludGVybmFsQ29sdW1uRWRpdG9yICYmIHRoaXMuY29sdW1uRGVmLmludGVybmFsQ29sdW1uRWRpdG9yIHx8IHt9O1xyXG4gIH1cclxuXHJcbiAgLyoqIEdldHRlciBmb3IgdGhlIEN1c3RvbSBTdHJ1Y3R1cmUgaWYgZXhpc3QgKi9cclxuICBwcm90ZWN0ZWQgZ2V0IGN1c3RvbVN0cnVjdHVyZSgpOiBDb2xsZWN0aW9uQ3VzdG9tU3RydWN0dXJlIHtcclxuICAgIHJldHVybiB0aGlzLmNvbHVtbkRlZiAmJiB0aGlzLmNvbHVtbkRlZi5pbnRlcm5hbENvbHVtbkVkaXRvciAmJiB0aGlzLmNvbHVtbkRlZi5pbnRlcm5hbENvbHVtbkVkaXRvci5jdXN0b21TdHJ1Y3R1cmU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgY3VycmVudCBzZWxlY3RlZCB2YWx1ZXMgKG11bHRpcGxlIHNlbGVjdCkgZnJvbSB0aGUgY29sbGVjdGlvblxyXG4gICAqL1xyXG4gIGdldCBjdXJyZW50VmFsdWVzKCkge1xyXG4gICAgLy8gY29sbGVjdGlvbiBvZiBzdHJpbmdzLCBqdXN0IHJldHVybiB0aGUgZmlsdGVyZWQgc3RyaW5nIHRoYXQgYXJlIGVxdWFsc1xyXG4gICAgaWYgKHRoaXMuY29sbGVjdGlvbi5ldmVyeSh4ID0+IHR5cGVvZiB4ID09PSAnc3RyaW5nJykpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5maWx0ZXIoYyA9PiB0aGlzLiRlZGl0b3JFbG0udmFsKCkuaW5kZXhPZihjLnRvU3RyaW5nKCkpICE9PSAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29sbGVjdGlvbiBvZiBsYWJlbC92YWx1ZSBwYWlyXHJcbiAgICBjb25zdCBzZXBhcmF0b3JCZXR3ZWVuTGFiZWxzID0gdGhpcy5jb2xsZWN0aW9uT3B0aW9ucyAmJiB0aGlzLmNvbGxlY3Rpb25PcHRpb25zLnNlcGFyYXRvckJldHdlZW5UZXh0TGFiZWxzIHx8ICcnO1xyXG4gICAgY29uc3QgaXNJbmNsdWRpbmdQcmVmaXhTdWZmaXggPSB0aGlzLmNvbGxlY3Rpb25PcHRpb25zICYmIHRoaXMuY29sbGVjdGlvbk9wdGlvbnMuaW5jbHVkZVByZWZpeFN1ZmZpeFRvU2VsZWN0ZWRWYWx1ZXMgfHwgZmFsc2U7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvblxyXG4gICAgICAuZmlsdGVyKGMgPT4gdGhpcy4kZWRpdG9yRWxtLnZhbCgpLmluZGV4T2YoY1t0aGlzLnZhbHVlTmFtZV0udG9TdHJpbmcoKSkgIT09IC0xKVxyXG4gICAgICAubWFwKGMgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxhYmVsVGV4dCA9IGNbdGhpcy52YWx1ZU5hbWVdO1xyXG4gICAgICAgIGxldCBwcmVmaXhUZXh0ID0gY1t0aGlzLmxhYmVsUHJlZml4TmFtZV0gfHwgJyc7XHJcbiAgICAgICAgbGV0IHN1ZmZpeFRleHQgPSBjW3RoaXMubGFiZWxTdWZmaXhOYW1lXSB8fCAnJztcclxuXHJcbiAgICAgICAgLy8gYWxzbyB0cmFuc2xhdGUgcHJlZml4L3N1ZmZpeCBpZiBlbmFibGVUcmFuc2xhdGVMYWJlbCBpcyB0cnVlIGFuZCB0ZXh0IGlzIGEgc3RyaW5nXHJcbiAgICAgICAgcHJlZml4VGV4dCA9ICh0aGlzLmVuYWJsZVRyYW5zbGF0ZUxhYmVsICYmIHByZWZpeFRleHQgJiYgdHlwZW9mIHByZWZpeFRleHQgPT09ICdzdHJpbmcnKSA/IHRoaXMuX3RyYW5zbGF0ZS5pbnN0YW50KHByZWZpeFRleHQgfHwgJyAnKSA6IHByZWZpeFRleHQ7XHJcbiAgICAgICAgc3VmZml4VGV4dCA9ICh0aGlzLmVuYWJsZVRyYW5zbGF0ZUxhYmVsICYmIHN1ZmZpeFRleHQgJiYgdHlwZW9mIHN1ZmZpeFRleHQgPT09ICdzdHJpbmcnKSA/IHRoaXMuX3RyYW5zbGF0ZS5pbnN0YW50KHN1ZmZpeFRleHQgfHwgJyAnKSA6IHN1ZmZpeFRleHQ7XHJcblxyXG4gICAgICAgIGlmIChpc0luY2x1ZGluZ1ByZWZpeFN1ZmZpeCkge1xyXG4gICAgICAgICAgY29uc3QgdG1wT3B0aW9uQXJyYXkgPSBbcHJlZml4VGV4dCwgbGFiZWxUZXh0LCBzdWZmaXhUZXh0XS5maWx0ZXIoKHRleHQpID0+IHRleHQpOyAvLyBhZGQgdG8gYSB0ZW1wIGFycmF5IGZvciBqb2luaW5nIHB1cnBvc2UgYW5kIGZpbHRlciBvdXQgZW1wdHkgdGV4dFxyXG4gICAgICAgICAgcmV0dXJuIHRtcE9wdGlvbkFycmF5LmpvaW4oc2VwYXJhdG9yQmV0d2VlbkxhYmVscyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsYWJlbFRleHQ7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBjdXJyZW50IHNlbGVjdGVkIHZhbHVlcyAoc2luZ2xlIHNlbGVjdCkgZnJvbSB0aGUgY29sbGVjdGlvblxyXG4gICAqL1xyXG4gIGdldCBjdXJyZW50VmFsdWUoKSB7XHJcbiAgICAvLyBjb2xsZWN0aW9uIG9mIHN0cmluZ3MsIGp1c3QgcmV0dXJuIHRoZSBmaWx0ZXJlZCBzdHJpbmcgdGhhdCBhcmUgZXF1YWxzXHJcbiAgICBpZiAodGhpcy5jb2xsZWN0aW9uLmV2ZXJ5KHggPT4gdHlwZW9mIHggPT09ICdzdHJpbmcnKSkge1xyXG4gICAgICByZXR1cm4gZmluZE9yRGVmYXVsdCh0aGlzLmNvbGxlY3Rpb24sIChjOiBhbnkpID0+IGMudG9TdHJpbmcoKSA9PT0gdGhpcy4kZWRpdG9yRWxtLnZhbCgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb2xsZWN0aW9uIG9mIGxhYmVsL3ZhbHVlIHBhaXJcclxuICAgIGNvbnN0IHNlcGFyYXRvckJldHdlZW5MYWJlbHMgPSB0aGlzLmNvbGxlY3Rpb25PcHRpb25zICYmIHRoaXMuY29sbGVjdGlvbk9wdGlvbnMuc2VwYXJhdG9yQmV0d2VlblRleHRMYWJlbHMgfHwgJyc7XHJcbiAgICBjb25zdCBpc0luY2x1ZGluZ1ByZWZpeFN1ZmZpeCA9IHRoaXMuY29sbGVjdGlvbk9wdGlvbnMgJiYgdGhpcy5jb2xsZWN0aW9uT3B0aW9ucy5pbmNsdWRlUHJlZml4U3VmZml4VG9TZWxlY3RlZFZhbHVlcyB8fCBmYWxzZTtcclxuICAgIGNvbnN0IGl0ZW1Gb3VuZCA9IGZpbmRPckRlZmF1bHQodGhpcy5jb2xsZWN0aW9uLCAoYzogYW55KSA9PiBjW3RoaXMudmFsdWVOYW1lXS50b1N0cmluZygpID09PSB0aGlzLiRlZGl0b3JFbG0udmFsKCkpO1xyXG5cclxuICAgIGlmIChpdGVtRm91bmQpIHtcclxuICAgICAgY29uc3QgbGFiZWxUZXh0ID0gaXRlbUZvdW5kW3RoaXMudmFsdWVOYW1lXTtcclxuXHJcbiAgICAgIGlmIChpc0luY2x1ZGluZ1ByZWZpeFN1ZmZpeCkge1xyXG4gICAgICAgIGxldCBwcmVmaXhUZXh0ID0gaXRlbUZvdW5kW3RoaXMubGFiZWxQcmVmaXhOYW1lXSB8fCAnJztcclxuICAgICAgICBsZXQgc3VmZml4VGV4dCA9IGl0ZW1Gb3VuZFt0aGlzLmxhYmVsU3VmZml4TmFtZV0gfHwgJyc7XHJcblxyXG4gICAgICAgIC8vIGFsc28gdHJhbnNsYXRlIHByZWZpeC9zdWZmaXggaWYgZW5hYmxlVHJhbnNsYXRlTGFiZWwgaXMgdHJ1ZSBhbmQgdGV4dCBpcyBhIHN0cmluZ1xyXG4gICAgICAgIHByZWZpeFRleHQgPSAodGhpcy5lbmFibGVUcmFuc2xhdGVMYWJlbCAmJiBwcmVmaXhUZXh0ICYmIHR5cGVvZiBwcmVmaXhUZXh0ID09PSAnc3RyaW5nJykgPyB0aGlzLl90cmFuc2xhdGUuaW5zdGFudChwcmVmaXhUZXh0IHx8ICcgJykgOiBwcmVmaXhUZXh0O1xyXG4gICAgICAgIHN1ZmZpeFRleHQgPSAodGhpcy5lbmFibGVUcmFuc2xhdGVMYWJlbCAmJiBzdWZmaXhUZXh0ICYmIHR5cGVvZiBzdWZmaXhUZXh0ID09PSAnc3RyaW5nJykgPyB0aGlzLl90cmFuc2xhdGUuaW5zdGFudChzdWZmaXhUZXh0IHx8ICcgJykgOiBzdWZmaXhUZXh0O1xyXG5cclxuICAgICAgICAvLyBhZGQgdG8gYSB0ZW1wIGFycmF5IGZvciBqb2luaW5nIHB1cnBvc2UgYW5kIGZpbHRlciBvdXQgZW1wdHkgdGV4dFxyXG4gICAgICAgIGNvbnN0IHRtcE9wdGlvbkFycmF5ID0gW3ByZWZpeFRleHQsIGxhYmVsVGV4dCwgc3VmZml4VGV4dF0uZmlsdGVyKCh0ZXh0KSA9PiB0ZXh0KTtcclxuICAgICAgICByZXR1cm4gdG1wT3B0aW9uQXJyYXkuam9pbihzZXBhcmF0b3JCZXR3ZWVuTGFiZWxzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGxhYmVsVGV4dDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqIEdldCB0aGUgVmFsaWRhdG9yIGZ1bmN0aW9uLCBjYW4gYmUgcGFzc2VkIGluIEVkaXRvciBwcm9wZXJ0eSBvciBDb2x1bW4gRGVmaW5pdGlvbiAqL1xyXG4gIGdldCB2YWxpZGF0b3IoKTogRWRpdG9yVmFsaWRhdG9yIHtcclxuICAgIHJldHVybiB0aGlzLmNvbHVtbkVkaXRvci52YWxpZGF0b3IgfHwgdGhpcy5jb2x1bW5EZWYudmFsaWRhdG9yO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICghdGhpcy5hcmdzKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignW0FuZ3VsYXItU2xpY2tHcmlkXSBBbiBlZGl0b3IgbXVzdCBhbHdheXMgaGF2ZSBhbiBcImluaXQoKVwiIHdpdGggdmFsaWQgYXJndW1lbnRzLicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5jb2x1bW5EZWYgfHwgIXRoaXMuY29sdW1uRGVmLmludGVybmFsQ29sdW1uRWRpdG9yIHx8ICghdGhpcy5jb2x1bW5EZWYuaW50ZXJuYWxDb2x1bW5FZGl0b3IuY29sbGVjdGlvbiAmJiAhdGhpcy5jb2x1bW5EZWYuaW50ZXJuYWxDb2x1bW5FZGl0b3IuY29sbGVjdGlvbkFzeW5jKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFtBbmd1bGFyLVNsaWNrR3JpZF0gWW91IG5lZWQgdG8gcGFzcyBhIFwiY29sbGVjdGlvblwiIChvciBcImNvbGxlY3Rpb25Bc3luY1wiKSBpbnNpZGUgQ29sdW1uIERlZmluaXRpb24gRWRpdG9yIGZvciB0aGUgTXVsdGlwbGVTZWxlY3QvU2luZ2xlU2VsZWN0IEVkaXRvciB0byB3b3JrIGNvcnJlY3RseS5cclxuICAgICAgQWxzbyBlYWNoIG9wdGlvbiBzaG91bGQgaW5jbHVkZSBhIHZhbHVlL2xhYmVsIHBhaXIgKG9yIHZhbHVlL2xhYmVsS2V5IHdoZW4gdXNpbmcgTG9jYWxlKS5cclxuICAgICAgRm9yIGV4YW1wbGU6IHsgZWRpdG9yOiB7IGNvbGxlY3Rpb246IFt7IHZhbHVlOiB0cnVlLCBsYWJlbDogJ1RydWUnIH0seyB2YWx1ZTogZmFsc2UsIGxhYmVsOiAnRmFsc2UnfV0gfSB9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fY29sbGVjdGlvblNlcnZpY2UgPSBuZXcgQ29sbGVjdGlvblNlcnZpY2UodGhpcy5fdHJhbnNsYXRlKTtcclxuICAgIHRoaXMuZW5hYmxlVHJhbnNsYXRlTGFiZWwgPSAodGhpcy5jb2x1bW5EZWYuaW50ZXJuYWxDb2x1bW5FZGl0b3IuZW5hYmxlVHJhbnNsYXRlTGFiZWwpID8gdGhpcy5jb2x1bW5EZWYuaW50ZXJuYWxDb2x1bW5FZGl0b3IuZW5hYmxlVHJhbnNsYXRlTGFiZWwgOiBmYWxzZTtcclxuICAgIHRoaXMubGFiZWxOYW1lID0gdGhpcy5jdXN0b21TdHJ1Y3R1cmUgJiYgdGhpcy5jdXN0b21TdHJ1Y3R1cmUubGFiZWwgfHwgJ2xhYmVsJztcclxuICAgIHRoaXMubGFiZWxQcmVmaXhOYW1lID0gdGhpcy5jdXN0b21TdHJ1Y3R1cmUgJiYgdGhpcy5jdXN0b21TdHJ1Y3R1cmUubGFiZWxQcmVmaXggfHwgJ2xhYmVsUHJlZml4JztcclxuICAgIHRoaXMubGFiZWxTdWZmaXhOYW1lID0gdGhpcy5jdXN0b21TdHJ1Y3R1cmUgJiYgdGhpcy5jdXN0b21TdHJ1Y3R1cmUubGFiZWxTdWZmaXggfHwgJ2xhYmVsU3VmZml4JztcclxuICAgIHRoaXMub3B0aW9uTGFiZWwgPSB0aGlzLmN1c3RvbVN0cnVjdHVyZSAmJiB0aGlzLmN1c3RvbVN0cnVjdHVyZS5vcHRpb25MYWJlbCB8fCAndmFsdWUnO1xyXG4gICAgdGhpcy52YWx1ZU5hbWUgPSB0aGlzLmN1c3RvbVN0cnVjdHVyZSAmJiB0aGlzLmN1c3RvbVN0cnVjdHVyZS52YWx1ZSB8fCAndmFsdWUnO1xyXG5cclxuICAgIGlmICh0aGlzLmVuYWJsZVRyYW5zbGF0ZUxhYmVsICYmICghdGhpcy5fdHJhbnNsYXRlIHx8IHR5cGVvZiB0aGlzLl90cmFuc2xhdGUuaW5zdGFudCAhPT0gJ2Z1bmN0aW9uJykpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBbc2VsZWN0LWVkaXRvcl0gVGhlIG5neC10cmFuc2xhdGUgVHJhbnNsYXRlU2VydmljZSBpcyByZXF1aXJlZCBmb3IgdGhlIFNlbGVjdCBFZGl0b3IgdG8gd29yayBjb3JyZWN0bHlgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhbHdheXMgcmVuZGVyIHRoZSBTZWxlY3QgKGRyb3Bkb3duKSBET00gZWxlbWVudCwgZXZlbiBpZiB1c2VyIHBhc3NlZCBhIFwiY29sbGVjdGlvbkFzeW5jXCIsXHJcbiAgICAvLyBpZiB0aGF0IGlzIHRoZSBjYXNlLCB0aGUgU2VsZWN0IHdpbGwgc2ltcGx5IGJlIHdpdGhvdXQgYW55IG9wdGlvbnMgYnV0IHdlIHN0aWxsIGhhdmUgdG8gcmVuZGVyIGl0IChlbHNlIFNsaWNrR3JpZCB3b3VsZCB0aHJvdyBhbiBlcnJvcilcclxuICAgIHRoaXMucmVuZGVyRG9tRWxlbWVudCh0aGlzLmNvbGxlY3Rpb24pO1xyXG4gIH1cclxuXHJcbiAgYXBwbHlWYWx1ZShpdGVtOiBhbnksIHN0YXRlOiBhbnkpOiB2b2lkIHtcclxuICAgIGl0ZW1bdGhpcy5jb2x1bW5EZWYuZmllbGRdID0gc3RhdGU7XHJcbiAgfVxyXG5cclxuICBkZXN0cm95KCkge1xyXG4gICAgdGhpcy5fZGVzdHJveWluZyA9IHRydWU7XHJcbiAgICBpZiAodGhpcy4kZWRpdG9yRWxtICYmIHRoaXMuJGVkaXRvckVsbS5tdWx0aXBsZVNlbGVjdCkge1xyXG4gICAgICB0aGlzLiRlZGl0b3JFbG0ubXVsdGlwbGVTZWxlY3QoJ2Nsb3NlJyk7XHJcbiAgICAgIHRoaXMuJGVkaXRvckVsbS5yZW1vdmUoKTtcclxuICAgIH1cclxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSB1bnN1YnNjcmliZUFsbE9ic2VydmFibGVzKHRoaXMuX3N1YnNjcmlwdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgbG9hZFZhbHVlKGl0ZW06IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuaXNNdWx0aXBsZVNlbGVjdCkge1xyXG4gICAgICB0aGlzLmxvYWRNdWx0aXBsZVZhbHVlcyhpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubG9hZFNpbmdsZVZhbHVlKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gIH1cclxuXHJcbiAgbG9hZE11bHRpcGxlVmFsdWVzKGl0ZW1zOiBhbnlbXSkge1xyXG4gICAgLy8gY29udmVydCB0byBzdHJpbmcgYmVjYXVzZSB0aGF0IGlzIGhvdyB0aGUgRE9NIHdpbGwgcmV0dXJuIHRoZXNlIHZhbHVlc1xyXG4gICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBpdGVtc1t0aGlzLmNvbHVtbkRlZi5maWVsZF0ubWFwKChpOiBhbnkpID0+IGkudG9TdHJpbmcoKSk7XHJcbiAgICB0aGlzLiRlZGl0b3JFbG0uZmluZCgnb3B0aW9uJykuZWFjaCgoaTogbnVtYmVyLCAkZTogYW55KSA9PiB7XHJcbiAgICAgICRlLnNlbGVjdGVkID0gKHRoaXMuZGVmYXVsdFZhbHVlLmluZGV4T2YoJGUudmFsdWUpICE9PSAtMSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGxvYWRTaW5nbGVWYWx1ZShpdGVtOiBhbnkpIHtcclxuICAgIC8vIGNvbnZlcnQgdG8gc3RyaW5nIGJlY2F1c2UgdGhhdCBpcyBob3cgdGhlIERPTSB3aWxsIHJldHVybiB0aGVzZSB2YWx1ZXNcclxuICAgIC8vIG1ha2Ugc3VyZSB0aGUgcHJvcCBleGlzdHMgZmlyc3RcclxuICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gaXRlbVt0aGlzLmNvbHVtbkRlZi5maWVsZF0gJiYgaXRlbVt0aGlzLmNvbHVtbkRlZi5maWVsZF0udG9TdHJpbmcoKTtcclxuXHJcbiAgICB0aGlzLiRlZGl0b3JFbG0uZmluZCgnb3B0aW9uJykuZWFjaCgoaTogbnVtYmVyLCAkZTogYW55KSA9PiB7XHJcbiAgICAgICRlLnNlbGVjdGVkID0gKHRoaXMuZGVmYXVsdFZhbHVlID09PSAkZS52YWx1ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlcmlhbGl6ZVZhbHVlKCk6IGFueSB7XHJcbiAgICByZXR1cm4gKHRoaXMuaXNNdWx0aXBsZVNlbGVjdCkgPyB0aGlzLmN1cnJlbnRWYWx1ZXMgOiB0aGlzLmN1cnJlbnRWYWx1ZTtcclxuICB9XHJcblxyXG4gIGZvY3VzKCkge1xyXG4gICAgaWYgKHRoaXMuJGVkaXRvckVsbSAmJiB0aGlzLiRlZGl0b3JFbG0ubXVsdGlwbGVTZWxlY3QpIHtcclxuICAgICAgdGhpcy4kZWRpdG9yRWxtLm11bHRpcGxlU2VsZWN0KCdmb2N1cycpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNWYWx1ZUNoYW5nZWQoKTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5pc011bHRpcGxlU2VsZWN0KSB7XHJcbiAgICAgIHJldHVybiAhYXJyYXlzRXF1YWwodGhpcy4kZWRpdG9yRWxtLnZhbCgpLCB0aGlzLmRlZmF1bHRWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy4kZWRpdG9yRWxtLnZhbCgpICE9PSB0aGlzLmRlZmF1bHRWYWx1ZTtcclxuICB9XHJcblxyXG4gIHZhbGlkYXRlKCk6IEVkaXRvclZhbGlkYXRvck91dHB1dCB7XHJcbiAgICBpZiAodGhpcy52YWxpZGF0b3IpIHtcclxuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmlzTXVsdGlwbGVTZWxlY3QgPyB0aGlzLmN1cnJlbnRWYWx1ZXMgOiB0aGlzLmN1cnJlbnRWYWx1ZTtcclxuICAgICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdHMgPSB0aGlzLnZhbGlkYXRvcih2YWx1ZSwgdGhpcy5hcmdzKTtcclxuICAgICAgaWYgKCF2YWxpZGF0aW9uUmVzdWx0cy52YWxpZCkge1xyXG4gICAgICAgIHJldHVybiB2YWxpZGF0aW9uUmVzdWx0cztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGJ5IGRlZmF1bHQgdGhlIGVkaXRvciBpcyBhbHdheXMgdmFsaWRcclxuICAgIC8vIGlmIHVzZXIgd2FudCBpdCB0byBiZSBhIHJlcXVpcmVkIGNoZWNrYm94LCBoZSB3b3VsZCBoYXZlIHRvIHByb3ZpZGUgaGlzIG93biB2YWxpZGF0b3JcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkOiB0cnVlLFxyXG4gICAgICBtc2c6IG51bGxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvL1xyXG4gIC8vIHByb3RlY3RlZCBmdW5jdGlvbnNcclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICogdXNlciBtaWdodCB3YW50IHRvIGZpbHRlciBjZXJ0YWluIGl0ZW1zIG9mIHRoZSBjb2xsZWN0aW9uXHJcbiAgICogQHBhcmFtIGlucHV0Q29sbGVjdGlvblxyXG4gICAqIEByZXR1cm4gb3V0cHV0Q29sbGVjdGlvbiBmaWx0ZXJlZCBhbmQvb3Igc29ydGVkIGNvbGxlY3Rpb25cclxuICAgKi9cclxuICBwcm90ZWN0ZWQgZmlsdGVyQ29sbGVjdGlvbihpbnB1dENvbGxlY3Rpb24pIHtcclxuICAgIGxldCBvdXRwdXRDb2xsZWN0aW9uID0gaW5wdXRDb2xsZWN0aW9uO1xyXG5cclxuICAgIC8vIHVzZXIgbWlnaHQgd2FudCB0byBmaWx0ZXIgY2VydGFpbiBpdGVtcyBvZiB0aGUgY29sbGVjdGlvblxyXG4gICAgaWYgKHRoaXMuY29sdW1uRWRpdG9yICYmIHRoaXMuY29sdW1uRWRpdG9yLmNvbGxlY3Rpb25GaWx0ZXJCeSkge1xyXG4gICAgICBjb25zdCBmaWx0ZXJCeSA9IHRoaXMuY29sdW1uRWRpdG9yLmNvbGxlY3Rpb25GaWx0ZXJCeTtcclxuICAgICAgY29uc3QgZmlsdGVyQ29sbGVjdGlvbkJ5ID0gdGhpcy5jb2x1bW5FZGl0b3IuY29sbGVjdGlvbk9wdGlvbnMgJiYgdGhpcy5jb2x1bW5FZGl0b3IuY29sbGVjdGlvbk9wdGlvbnMuZmlsdGVyQWZ0ZXJFYWNoUGFzcyB8fCBudWxsO1xyXG4gICAgICBvdXRwdXRDb2xsZWN0aW9uID0gdGhpcy5fY29sbGVjdGlvblNlcnZpY2UuZmlsdGVyQ29sbGVjdGlvbihvdXRwdXRDb2xsZWN0aW9uLCBmaWx0ZXJCeSwgZmlsdGVyQ29sbGVjdGlvbkJ5KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3V0cHV0Q29sbGVjdGlvbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHVzZXIgbWlnaHQgd2FudCB0byBzb3J0IHRoZSBjb2xsZWN0aW9uIGluIGEgY2VydGFpbiB3YXlcclxuICAgKiBAcGFyYW0gaW5wdXRDb2xsZWN0aW9uXHJcbiAgICogQHJldHVybiBvdXRwdXRDb2xsZWN0aW9uIHNvcnRlZCBjb2xsZWN0aW9uXHJcbiAgICovXHJcbiAgcHJvdGVjdGVkIHNvcnRDb2xsZWN0aW9uKGlucHV0Q29sbGVjdGlvbikge1xyXG4gICAgbGV0IG91dHB1dENvbGxlY3Rpb24gPSBpbnB1dENvbGxlY3Rpb247XHJcblxyXG4gICAgLy8gdXNlciBtaWdodCB3YW50IHRvIHNvcnQgdGhlIGNvbGxlY3Rpb25cclxuICAgIGlmICh0aGlzLmNvbHVtbkRlZi5pbnRlcm5hbENvbHVtbkVkaXRvciAmJiB0aGlzLmNvbHVtbkRlZi5pbnRlcm5hbENvbHVtbkVkaXRvci5jb2xsZWN0aW9uU29ydEJ5KSB7XHJcbiAgICAgIGNvbnN0IHNvcnRCeSA9IHRoaXMuY29sdW1uRGVmLmludGVybmFsQ29sdW1uRWRpdG9yLmNvbGxlY3Rpb25Tb3J0Qnk7XHJcbiAgICAgIG91dHB1dENvbGxlY3Rpb24gPSB0aGlzLl9jb2xsZWN0aW9uU2VydmljZS5zb3J0Q29sbGVjdGlvbihvdXRwdXRDb2xsZWN0aW9uLCBzb3J0QnksIHRoaXMuZW5hYmxlVHJhbnNsYXRlTGFiZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvdXRwdXRDb2xsZWN0aW9uO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIHJlbmRlckRvbUVsZW1lbnQoY29sbGVjdGlvbjogYW55W10pIHtcclxuICAgIGlmICghQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uKSAmJiB0aGlzLmNvbGxlY3Rpb25PcHRpb25zICYmIHRoaXMuY29sbGVjdGlvbk9wdGlvbnMuY29sbGVjdGlvbkluT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgY29sbGVjdGlvbiA9IGdldERlc2NlbmRhbnRQcm9wZXJ0eShjb2xsZWN0aW9uLCB0aGlzLmNvbGxlY3Rpb25PcHRpb25zLmNvbGxlY3Rpb25Jbk9iamVjdFByb3BlcnR5KTtcclxuICAgIH1cclxuICAgIGlmICghQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcImNvbGxlY3Rpb25cIiBwYXNzZWQgdG8gdGhlIFNlbGVjdCBFZGl0b3IgaXMgbm90IGEgdmFsaWQgYXJyYXknKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1c2VyIGNhbiBvcHRpb25hbGx5IGFkZCBhIGJsYW5rIGVudHJ5IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGNvbGxlY3Rpb25cclxuICAgIGlmICh0aGlzLmNvbGxlY3Rpb25PcHRpb25zICYmIHRoaXMuY29sbGVjdGlvbk9wdGlvbnMuYWRkQmxhbmtFbnRyeSkge1xyXG4gICAgICBjb2xsZWN0aW9uLnVuc2hpZnQodGhpcy5jcmVhdGVCbGFua0VudHJ5KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBuZXdDb2xsZWN0aW9uID0gY29sbGVjdGlvbiB8fCBbXTtcclxuXHJcbiAgICAvLyB1c2VyIG1pZ2h0IHdhbnQgdG8gZmlsdGVyIGFuZC9vciBzb3J0IGNlcnRhaW4gaXRlbXMgb2YgdGhlIGNvbGxlY3Rpb25cclxuICAgIG5ld0NvbGxlY3Rpb24gPSB0aGlzLmZpbHRlckNvbGxlY3Rpb24obmV3Q29sbGVjdGlvbik7XHJcbiAgICBuZXdDb2xsZWN0aW9uID0gdGhpcy5zb3J0Q29sbGVjdGlvbihuZXdDb2xsZWN0aW9uKTtcclxuXHJcbiAgICAvLyBzdGVwIDEsIGNyZWF0ZSBIVE1MIHN0cmluZyB0ZW1wbGF0ZVxyXG4gICAgY29uc3QgZWRpdG9yVGVtcGxhdGUgPSB0aGlzLmJ1aWxkVGVtcGxhdGVIdG1sU3RyaW5nKG5ld0NvbGxlY3Rpb24pO1xyXG5cclxuICAgIC8vIHN0ZXAgMiwgY3JlYXRlIHRoZSBET00gRWxlbWVudCBvZiB0aGUgZWRpdG9yXHJcbiAgICAvLyBhbHNvIHN1YnNjcmliZSB0byB0aGUgb25DbG9zZSBldmVudFxyXG4gICAgdGhpcy5jcmVhdGVEb21FbGVtZW50KGVkaXRvclRlbXBsYXRlKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBidWlsZFRlbXBsYXRlSHRtbFN0cmluZyhjb2xsZWN0aW9uOiBhbnlbXSkge1xyXG4gICAgbGV0IG9wdGlvbnMgPSAnJztcclxuICAgIGNvbnN0IGZpZWxkSWQgPSB0aGlzLmNvbHVtbkRlZiAmJiB0aGlzLmNvbHVtbkRlZi5pZDtcclxuICAgIGNvbnN0IHNlcGFyYXRvckJldHdlZW5MYWJlbHMgPSB0aGlzLmNvbGxlY3Rpb25PcHRpb25zICYmIHRoaXMuY29sbGVjdGlvbk9wdGlvbnMuc2VwYXJhdG9yQmV0d2VlblRleHRMYWJlbHMgfHwgJyc7XHJcbiAgICBjb25zdCBpc1JlbmRlckh0bWxFbmFibGVkID0gdGhpcy5jb2x1bW5EZWYuaW50ZXJuYWxDb2x1bW5FZGl0b3IuZW5hYmxlUmVuZGVySHRtbCB8fCBmYWxzZTtcclxuICAgIGNvbnN0IHNhbml0aXplZE9wdGlvbnMgPSB0aGlzLmdyaWRPcHRpb25zICYmIHRoaXMuZ3JpZE9wdGlvbnMuc2FuaXRpemVIdG1sT3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAvLyBjb2xsZWN0aW9uIGNvdWxkIGJlIGFuIEFycmF5IG9mIFN0cmluZ3MgT1IgT2JqZWN0c1xyXG4gICAgaWYgKGNvbGxlY3Rpb24uZXZlcnkoeCA9PiB0eXBlb2YgeCA9PT0gJ3N0cmluZycpKSB7XHJcbiAgICAgIGNvbGxlY3Rpb24uZm9yRWFjaCgob3B0aW9uOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBvcHRpb25zICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtvcHRpb259XCIgbGFiZWw9XCIke29wdGlvbn1cIj4ke29wdGlvbn08L29wdGlvbj5gO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGFycmF5IG9mIG9iamVjdHMgd2lsbCByZXF1aXJlIGEgbGFiZWwvdmFsdWUgcGFpciB1bmxlc3MgYSBjdXN0b21TdHJ1Y3R1cmUgaXMgcGFzc2VkXHJcbiAgICAgIGNvbGxlY3Rpb24uZm9yRWFjaCgob3B0aW9uOiBTZWxlY3RPcHRpb24pID0+IHtcclxuICAgICAgICBpZiAoIW9wdGlvbiB8fCAob3B0aW9uW3RoaXMubGFiZWxOYW1lXSA9PT0gdW5kZWZpbmVkICYmIG9wdGlvbi5sYWJlbEtleSA9PT0gdW5kZWZpbmVkKSkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBbc2VsZWN0LWVkaXRvcl0gQSBjb2xsZWN0aW9uIHdpdGggdmFsdWUvbGFiZWwgKG9yIHZhbHVlL2xhYmVsS2V5IHdoZW4gdXNpbmcgTG9jYWxlKSBpcyByZXF1aXJlZCB0byBwb3B1bGF0ZSB0aGUgU2VsZWN0IGxpc3QsIGZvciBleGFtcGxlOiB7IGNvbGxlY3Rpb246IFsgeyB2YWx1ZTogJzEnLCBsYWJlbDogJ09uZScgfSBdKWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsYWJlbEtleSA9IChvcHRpb24ubGFiZWxLZXkgfHwgb3B0aW9uW3RoaXMubGFiZWxOYW1lXSkgYXMgc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0IGxhYmVsVGV4dCA9ICgob3B0aW9uLmxhYmVsS2V5IHx8IHRoaXMuZW5hYmxlVHJhbnNsYXRlTGFiZWwpICYmIGxhYmVsS2V5KSA/IHRoaXMuX3RyYW5zbGF0ZS5pbnN0YW50KGxhYmVsS2V5IHx8ICcgJykgOiBsYWJlbEtleTtcclxuICAgICAgICBsZXQgcHJlZml4VGV4dCA9IG9wdGlvblt0aGlzLmxhYmVsUHJlZml4TmFtZV0gfHwgJyc7XHJcbiAgICAgICAgbGV0IHN1ZmZpeFRleHQgPSBvcHRpb25bdGhpcy5sYWJlbFN1ZmZpeE5hbWVdIHx8ICcnO1xyXG4gICAgICAgIGxldCBvcHRpb25MYWJlbCA9IG9wdGlvblt0aGlzLm9wdGlvbkxhYmVsXSB8fCAnJztcclxuICAgICAgICBvcHRpb25MYWJlbCA9IG9wdGlvbkxhYmVsLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxcIi9nLCAnXFwnJyk7IC8vIHJlcGxhY2UgZG91YmxlIHF1b3RlcyBieSBzaW5nbGUgcXVvdGVzIHRvIGF2b2lkIGludGVyZmVyaW5nIHdpdGggcmVndWxhciBodG1sXHJcblxyXG4gICAgICAgIC8vIGFsc28gdHJhbnNsYXRlIHByZWZpeC9zdWZmaXggaWYgZW5hYmxlVHJhbnNsYXRlTGFiZWwgaXMgdHJ1ZSBhbmQgdGV4dCBpcyBhIHN0cmluZ1xyXG4gICAgICAgIHByZWZpeFRleHQgPSAodGhpcy5lbmFibGVUcmFuc2xhdGVMYWJlbCAmJiBwcmVmaXhUZXh0ICYmIHR5cGVvZiBwcmVmaXhUZXh0ID09PSAnc3RyaW5nJykgPyB0aGlzLl90cmFuc2xhdGUuaW5zdGFudChwcmVmaXhUZXh0IHx8ICcgJykgOiBwcmVmaXhUZXh0O1xyXG4gICAgICAgIHN1ZmZpeFRleHQgPSAodGhpcy5lbmFibGVUcmFuc2xhdGVMYWJlbCAmJiBzdWZmaXhUZXh0ICYmIHR5cGVvZiBzdWZmaXhUZXh0ID09PSAnc3RyaW5nJykgPyB0aGlzLl90cmFuc2xhdGUuaW5zdGFudChzdWZmaXhUZXh0IHx8ICcgJykgOiBzdWZmaXhUZXh0O1xyXG4gICAgICAgIG9wdGlvbkxhYmVsID0gKHRoaXMuZW5hYmxlVHJhbnNsYXRlTGFiZWwgJiYgb3B0aW9uTGFiZWwgJiYgdHlwZW9mIG9wdGlvbkxhYmVsID09PSAnc3RyaW5nJykgPyB0aGlzLl90cmFuc2xhdGUuaW5zdGFudChvcHRpb25MYWJlbCB8fCAnICcpIDogb3B0aW9uTGFiZWw7XHJcblxyXG4gICAgICAgIC8vIGFkZCB0byBhIHRlbXAgYXJyYXkgZm9yIGpvaW5pbmcgcHVycG9zZSBhbmQgZmlsdGVyIG91dCBlbXB0eSB0ZXh0XHJcbiAgICAgICAgY29uc3QgdG1wT3B0aW9uQXJyYXkgPSBbcHJlZml4VGV4dCwgbGFiZWxUZXh0LCBzdWZmaXhUZXh0XS5maWx0ZXIoKHRleHQpID0+IHRleHQpO1xyXG4gICAgICAgIGxldCBvcHRpb25UZXh0ID0gdG1wT3B0aW9uQXJyYXkuam9pbihzZXBhcmF0b3JCZXR3ZWVuTGFiZWxzKTtcclxuXHJcbiAgICAgICAgLy8gaWYgdXNlciBzcGVjaWZpY2FsbHkgd2FudHMgdG8gcmVuZGVyIGh0bWwgdGV4dCwgaGUgbmVlZHMgdG8gb3B0LWluIGVsc2UgaXQgd2lsbCBzdHJpcHBlZCBvdXQgYnkgZGVmYXVsdFxyXG4gICAgICAgIC8vIGFsc28sIHRoZSAzcmQgcGFydHkgbGliIHdpbGwgc2FuaW5pdHplIGFueSBodG1sIGNvZGUgdW5sZXNzIGl0J3MgZW5jb2RlZCwgc28gd2UnbGwgZG8gdGhhdFxyXG4gICAgICAgIGlmIChpc1JlbmRlckh0bWxFbmFibGVkKSB7XHJcbiAgICAgICAgICAvLyBzYW5pdGl6ZSBhbnkgdW5hdXRob3JpemVkIGh0bWwgdGFncyBsaWtlIHNjcmlwdCBhbmQgb3RoZXJzXHJcbiAgICAgICAgICAvLyBmb3IgdGhlIHJlbWFpbmluZyBhbGxvd2VkIHRhZ3Mgd2UnbGwgcGVybWl0IGFsbCBhdHRyaWJ1dGVzXHJcbiAgICAgICAgICBjb25zdCBzYW5pdGl6ZWRUZXh0ID0gRE9NUHVyaWZ5LnNhbml0aXplKG9wdGlvblRleHQsIHNhbml0aXplZE9wdGlvbnMpO1xyXG4gICAgICAgICAgb3B0aW9uVGV4dCA9IGh0bWxFbmNvZGUoc2FuaXRpemVkVGV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvcHRpb25zICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtvcHRpb25bdGhpcy52YWx1ZU5hbWVdfVwiIGxhYmVsPVwiJHtvcHRpb25MYWJlbH1cIj4ke29wdGlvblRleHR9PC9vcHRpb24+YDtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGA8c2VsZWN0IGlkPVwiJHt0aGlzLmVsZW1lbnROYW1lfVwiIGNsYXNzPVwibXMtZmlsdGVyIHNlYXJjaC1maWx0ZXIgZWRpdG9yLSR7ZmllbGRJZH1cIiAke3RoaXMuaXNNdWx0aXBsZVNlbGVjdCA/ICdtdWx0aXBsZT1cIm11bHRpcGxlXCInIDogJyd9PiR7b3B0aW9uc308L3NlbGVjdD5gO1xyXG4gIH1cclxuXHJcbiAgLyoqIENyZWF0ZSBhIGJsYW5rIGVudHJ5IHRoYXQgY2FuIGJlIGFkZGVkIHRvIHRoZSBjb2xsZWN0aW9uLiBJdCB3aWxsIGFsc28gcmV1c2UgdGhlIHNhbWUgY3VzdG9tU3RydWN0dXJlIGlmIG5lZWQgYmUgKi9cclxuICBwcm90ZWN0ZWQgY3JlYXRlQmxhbmtFbnRyeSgpIHtcclxuICAgIGNvbnN0IGJsYW5rRW50cnkgPSB7XHJcbiAgICAgIFt0aGlzLmxhYmVsTmFtZV06ICcnLFxyXG4gICAgICBbdGhpcy52YWx1ZU5hbWVdOiAnJ1xyXG4gICAgfTtcclxuICAgIGlmICh0aGlzLmxhYmVsUHJlZml4TmFtZSkge1xyXG4gICAgICBibGFua0VudHJ5W3RoaXMubGFiZWxQcmVmaXhOYW1lXSA9ICcnO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubGFiZWxTdWZmaXhOYW1lKSB7XHJcbiAgICAgIGJsYW5rRW50cnlbdGhpcy5sYWJlbFN1ZmZpeE5hbWVdID0gJyc7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYmxhbmtFbnRyeTtcclxuICB9XHJcblxyXG4gIC8qKiBCdWlsZCB0aGUgdGVtcGxhdGUgSFRNTCBzdHJpbmcgKi9cclxuICBwcm90ZWN0ZWQgY3JlYXRlRG9tRWxlbWVudChlZGl0b3JUZW1wbGF0ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLiRlZGl0b3JFbG0gPSAkKGVkaXRvclRlbXBsYXRlKTtcclxuXHJcbiAgICBpZiAodGhpcy4kZWRpdG9yRWxtICYmIHR5cGVvZiB0aGlzLiRlZGl0b3JFbG0uYXBwZW5kVG8gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy4kZWRpdG9yRWxtLmFwcGVuZFRvKHRoaXMuYXJncy5jb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgdGhpcy4kZWRpdG9yRWxtLm11bHRpcGxlU2VsZWN0ICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIC8vIGZhbGxiYWNrIHRvIGJvb3RzdHJhcFxyXG4gICAgICB0aGlzLiRlZGl0b3JFbG0uYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgZWxlbWVudE9wdGlvbnMgPSAodGhpcy5jb2x1bW5EZWYuaW50ZXJuYWxDb2x1bW5FZGl0b3IpID8gdGhpcy5jb2x1bW5EZWYuaW50ZXJuYWxDb2x1bW5FZGl0b3IuZWxlbWVudE9wdGlvbnMgOiB7fTtcclxuICAgICAgdGhpcy5lZGl0b3JFbG1PcHRpb25zID0geyAuLi50aGlzLmRlZmF1bHRPcHRpb25zLCAuLi5lbGVtZW50T3B0aW9ucyB9O1xyXG4gICAgICB0aGlzLiRlZGl0b3JFbG0gPSB0aGlzLiRlZGl0b3JFbG0ubXVsdGlwbGVTZWxlY3QodGhpcy5lZGl0b3JFbG1PcHRpb25zKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLiRlZGl0b3JFbG0ubXVsdGlwbGVTZWxlY3QoJ29wZW4nKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyByZWZyZXNoIHRoZSBqcXVlcnkgb2JqZWN0IGJlY2F1c2UgdGhlIHNlbGVjdGVkIGNoZWNrYm94ZXMgd2VyZSBhbHJlYWR5IHNldFxyXG4gIC8vIHByaW9yIHRvIHRoaXMgbWV0aG9kIGJlaW5nIGNhbGxlZFxyXG4gIHByb3RlY3RlZCByZWZyZXNoKCkge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLiRlZGl0b3JFbG0ubXVsdGlwbGVTZWxlY3QgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy4kZWRpdG9yRWxtLm11bHRpcGxlU2VsZWN0KCdyZWZyZXNoJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==