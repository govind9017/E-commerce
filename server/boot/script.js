// "use strict";
// var async = require("async");

// module.exports = async server => {
//   var User = server.models.user;
//   var Role = server.models.Role;
//   var RoleMapping = server.models.RoleMapping;

//   const users = [
//     { username: "satish", email: "satish@mfine.co", password: "12345" },
//     { username: "govind", email: "govind@mfine.com", password: "12345" }
//   ];

//   try {
//     const user = await User.create(users);
//     console.log(user);
//     const rolemap = [
//       {
//         principalType: RoleMapping.USER,
//         principalId: user[1]["id"].toString()
//       }
//     ];

//     const role = await Role.create({
//       name: "Manager"
//     });
//     const principal = role.principals.create(rolemap);
//     console.log("Created principal:", JSON.stringify(principal));
//   } catch (err) {
//     console.log(err);
//   }
// };
