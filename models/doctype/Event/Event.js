module.exports = {
    name: "Event",
    doctype: "DocType",
    isSingle: 0,
    fields: [
        {
            fieldname: "name",
            label: "ToDo Name",
            fieldtype: "Data",
            required: 1
        },
        {
            fieldname: "status",
            label: "Status",
            fieldtype: "Data",
            default: "incomplete",
            required: 1
        }
    ]
};