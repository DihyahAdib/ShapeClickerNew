// //userController.js in controllers folder //
// import User from "../models/User.js";

// export const getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const saveUser = async (req, res) => {
//   try {
//     const userData = req.body;
//     const user = new User(userData);
//     await user.save();
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const updateUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const updates = req.body;
//     const user = await User.findOneAndUpdate({ userId }, updates, {
//       new: true,
//     });
//     res.json(user);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
