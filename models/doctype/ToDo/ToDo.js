module.exports = {
    name: "ToDo",
    doctype: "DocType",
    naming: 'random',
    isSingle: 0,
    fields: [
        {
            fieldname: "title",
            fieldtype: "Data",
            required: 1
        },
        {
            fieldname: "completed",
            fieldtype: "Check"
        }
    ]
};