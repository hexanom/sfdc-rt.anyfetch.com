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

function filterRecordKeys(record) {
  return function(key) {
    return (
      record[key] &&
      typeof record[key] === "string" &&
        ! /id/i.test(key) &&
        ! /date/i.test(key) &&
        ! /system/i.test(key)
      );
  };
}

function genAttributeTable(record) {
  return "<table>" +
    Object.keys(record)
      .filter(filterRecordKeys(record))
      .map(function mapRecordKeys(key) {
        return "<tr>" +
          "<td><strong>" + key + "</strong></td>" +
          "<td>" + record[key] + "</td>" +
          "</tr>";
      }) +
    "</table>";
}

function genSnippet(record, search) {
  function matcher(key) {
    return search.split(" ")
      .filter(function(word) {
        return !(
          /AND/.test(word) ||
          /OR/.test(word) ||
          /\(/.test(word) ||
          /\)/.test(word));
      })
      .map(function(word) {
        return new RegExp(word);
      })
      .filter(function(regex) {
        return regex.test(record[key]);
      })
      .length > 0;
  }

  return Object.keys(record)
    .filter(filterRecordKeys(record))
    .filter(matcher)
    .map(function mapRecordKeys(key) {
      return "<strong>" + key + " : </strong>" +
        record[key] + "; ";
    });

}

module.exports = function formatDocument(sobject, record, search) {
  search = search || "";
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
      "path": sobject.attributes.type + "/" + documentTitle,
      "content": genAttributeTable(record),
      "snippet": genSnippet(record, search)
    }
  };

  // TODO: Special case for contacts

  return res;
};
