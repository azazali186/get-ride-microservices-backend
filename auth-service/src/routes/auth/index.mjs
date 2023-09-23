import express from 'express';
const authRoutes = express.Router();
import User from '../../models/user.mjs';
import Role from '../../models/roles.mjs';
import Permissions from '../../models/permissions.mjs';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';


// Register User

authRoutes.post('/register', async (req, res) => {
    try {
        let users = await User.findOne({
            email: req.body.email.toLowerCase()
        })
        if (users) {
            res.status(409).json({
                "error": "email already exist."
            })
            return false
        }
        let role = await Role.findOne({
            "name": req.body.role.toLowerCase(),
        })
        const newUser = new User({
            email: req.body.email.toLowerCase(),
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString(),
            role: role._id,
        })
        const createdUser = await newUser.save()
        res.status(201).json(createdUser)

    } catch (err) {
        res.status(500).json(err)
    }
});

authRoutes.post('/login', async (req, res) => {
    try {
        const users = await User.findOne({
            email: req.body.email.toLowerCase()
        })

        //console.log(users)

        !users && res.status(401).json({ message: 'Wrong email......' })

        const OriginalPassword = CryptoJS.AES.decrypt(users.password, process.env.PASS_SECRET).toString(CryptoJS.enc.Utf8)

        OriginalPassword !== req.body.password && res.status(401).json({ message: 'Wrong Password and email combination' })
        const { password, __v, ...others } = users._doc
        const roleData = await Role.findById(users.role)
        const permissionsData = await Permissions.find()
        const payload = {
            id: users._id,
            email: users.email,
            role: roleData.name,
        }
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "30m" },
        )
        res.status(200).json({ user: { ...others, role: roleData }, roles: roleData, permissions: permissionsData, token: accessToken })
    } catch (err) {
        res.status(500).json(err)
    }
});

export default authRoutes