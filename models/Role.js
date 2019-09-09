const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var RoleSchema = new Schema({
    name: { type: String, required: true },
});
module.exports = mongoose.model("Role", RoleSchema);