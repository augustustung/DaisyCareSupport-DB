const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TokenModel = require('../models/token.model');
const mongoose = require('mongoose');
const MessageModel = require('../models/message.model');
const EmployeeModel = require('../models/employee.modal');
const fs = require('fs')
var salt = bcrypt.genSaltSync(10);


const checkEmail = (userEmail) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await UserModel.findOne({
				email: userEmail
			}).exec();

			if (user) {
				user.lastActiveAt = new Date().toISOString();
				await user.save();
				resolve(user);
			}
			else
				resolve(false);
		} catch (err) {
			reject(err);
		}
	})
}

const SigninService = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { email, password } = data;
			if (!email || !password)
				resolve({
					errCode: 1,
					errMessage: "Missing required parameter!"
				});

			const user = await checkEmail(email);
			if (!user)
				resolve({
					errCode: 2,
					errMessage: "Email doesn't exsist!"
				});

			else {
				let check = await bcrypt.compareSync(password, user.password);
				if (!check)
					resolve({
						errCode: 3,
						errMessage: "Wrong password!"
					});
				else {
					let userData = {};
					userData.user = user
					userData.user.password = undefined;

					//create token
					const accessToken = jwt.sign(
						{ email: email },
						process.env.ACCESS_TOKEN_SECRET,
						{ expiresIn: '15m' }
					);

					let tokens = await TokenModel.findOne({ userId: user._id });
					if (!tokens)
						tokens = new TokenModel({
							_id: new mongoose.Types.ObjectId,
							userId: user._id,
							listToken: [accessToken]
						});
					else
						tokens.listToken.push(accessToken);

					await tokens.save();

					userData.token = accessToken;

					resolve({
						errCode: 0,
						data: userData
					});
				}
			}
		} catch (e) {
			console.log(e);
			reject({
				errCode: -1,
				errMessage: "Error from server!"
			})
		}
	})
}

const handleSignUpService = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const {
				email,
				password,
				fullName,
				userRole
			} = data

			if (!email ||
				!password ||
				!fullName
			)
				resolve({
					errCode: 1,
					errMessage: "Missing required parameter!"
				})

			const check = await checkEmail(email);
			if (check)
				resolve({
					errCode: 1,
					errMessage: "Email is used! Please try another..."
				});
			else {
				const hashPassword = _onHashPassword(password);
				const generateNewUserId = new mongoose.Types.ObjectId;
				const newUser = new UserModel({
					_id: generateNewUserId,
					fullName: fullName,
					email: email,
					password: hashPassword,
					userRole: userRole ? userRole : "R2",
					lastActiveAt: new Date()
				});

				await newUser.save();

				//make new conversation with channel
				if (!userRole || userRole === 'R2') {
					const channel = await UserModel.find({ userRole: "R1" }).exec();
					for (let i = 0; i < channel.length; i++) {
						const ibId = new mongoose.Types.ObjectId;
						const ib = new MessageModel({
							_id: ibId,
							userId: generateNewUserId,
							adminId: channel[i]._id,
							createAt: new Date(),
							messages: []
						});
						await ib.save();
					}
				}

				resolve({
					errCode: 0,
					message: "Created"
				})
			}
		} catch (e) {
			reject(e)
		}
	})
}

const handleSignOut = (userId) => {
	return new Promise(async (resolve, reject) => {
		if (!userId)
			resolve({
				errCode: -1,
				errMessage: "Missing required parameter"
			});

		const refTokenStore = await TokenModel.findOne({ userId: userId });
		refTokenStore.listToken = [];
		await refTokenStore.save();

		resolve({
			errCode: 0,
			message: "OK"
		});
	})

}

const _onHashPassword = (password) => {
	return bcrypt.hashSync(password, salt);
}

const createEmployee = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const newEmployee = new EmployeeModel({
				_id: new mongoose.Types.ObjectId,
				employeeId: data.employeeId,
				employeeFullName: data.employeeFullName,
				employeeGender: data.employeeGender,
				employeeBirthDay: data.employeeBirthDay,
			});
			await newEmployee.save();
			resolve('ok');
		} catch (e) {
			reject(e);
		}
	})
}

/**
* @param
* {
		listImage: [{
			imageData: Blob
			imageFormat: string
		}],
		staffName: string
*/

const uploadService = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const arrayImage = data.listImage
			const staffName = data.staffName;
			let originalData = []
			for (let i = 0; i < arrayImage.length; i++) {
				const objData = {
					imageData: Buffer.from(arrayImage[i].imageData, 'base64'),
					imageFormat: arrayImage[i].imageFormat,
				}
				originalData.push(objData);
			}

			let newAvatar = await uploadMediaFile(originalData, staffName);
			if (newAvatar) {
				resolve(newAvatar);
			} else {
				reject('failed to upload')
			}
			resolve('ok');
		} catch (e) {
			reject(e);
		}
	})
}


//Upload base64 image
//fileFormat: PNG, JPEG, MP4
async function uploadMediaFile(fileData, folderPath) {
	return new Promise(async (resolve, reject) => {
		try {
			if (fileData) {
				//fake name with 64 ASCII chars 
				for (let i = 0; i < fileData.length; i++) {
					let filePath = `Media/${folderPath}${(i+1).toString()}`;
					if (fs.existsSync(`Media/${folderPath}`) === false) {
						fs.mkdirSync(`Media/${folderPath}`, { recursive: true });
					}
					fs.appendFile(filePath, fileData[i].imageData, (err) => {
						if (err) {
							throw err;
						}	
					});
				}
				resolve('ok');
			}
		} catch (e) {
			console.log('UploadFunction', e);
			reject(undefined);
		}
	});
}

module.exports = {
	SigninService,
	handleSignOut,
	handleSignUpService,
	createEmployee,
	uploadService
}