"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const INDIAN_PHONE_NUMBER_REGEX = /^(?:\+91[-\s]?)?[789]\d{9}$/;
const CITY_REGEX = /^[a-zA-Z- ]*$/;
const NAME_REGEX = /^(?=.{1,40}$)[a-zA-Z@#*!$%^&*()_+=\[\]{}|\\:;,?\/.]+(?:[-'\s][a-zA-Z@#*!$%^&*()_+=\[\]{}|\\:;,?\/.]+)*$/;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const INDIAN_ZIP_REGEX = /^\d{6}$/;
exports.default = {
    INDIAN_PHONE_NUMBER_REGEX,
    CITY_REGEX,
    NAME_REGEX,
    EMAIL_REGEX,
    INDIAN_ZIP_REGEX
};
//# sourceMappingURL=dataFormatConstants.js.map