"use strict";

var DEFAULT_TITLE = "Salesforce Object";
var DOCUMENT_TYPE_ID = "5252ce4ce4cfcd16f55cfa3c";

function sfdcTypeToDocumentType(sfdcType) {
  switch(sfdcType) {
    // case "Contact":
    // case "Lead":
    // case "Opportunity":
    // TODO: special case for contacts
    default:
      return DOCUMENT_TYPE_ID;
  }
}

function genAttributeTable(record) {
  return "<table>" +
    Object.keys(record).filter(function filterRecordKeys(key) {
      return (
        record[key] &&
        typeof record[key] === "string" &&
        ! /id/i.test(key) &&
        ! /date/i.test(key) &&
        ! /system/i.test(key)
      );
    }).map(function mapRecordKeys(key) {
      return "<tr>" +
        "<td><strong>" + key + "</strong></td>" +
        "<td>" + record[key] + "</td>" +
        "</tr>";
    }) +
    "</table>";
}

module.exports = function formatDocument(sobject, record) {
  var url = "https://emea.salesforce.com/" + sobject.Id; // TODO: NA addresses support
  var documentType = sfdcTypeToDocumentType(sobject.attributes.type);
  var documentTitle = record.Name || record.Title || DEFAULT_TITLE;
  var res = {
    "identifier": sobject.attributes.type + '/' + sobject.Id,
    "creation_date": record.CreatedDate,
    "modification_date": record.LastModifiedDate,
    "actions": {
      "show": url
    },
    "document_type": documentType,
    "data": {
      "title": documentTitle,
      "name": documentTitle,
      "subject": documentTitle,
      "html": genAttributeTable(record)
    }
  };

  // TODO: Special case for contacts

  return res;
};
