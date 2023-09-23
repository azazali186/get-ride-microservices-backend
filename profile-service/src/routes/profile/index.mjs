import {
    verifyTokenAndAuthorization
} from "../../middleware/verifyToken.mjs";
import Profile from "../../models/profile.mjs";

import express from 'express';
const profileRoutes = express.Router()

// Update Profile
profileRoutes.patch("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedProfile = await Profile.update(
            req.body,
            {
                where: { id: req.params.id },
                returning: true, // To get the updated record
            }
        );

        if (updatedProfile[0] === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const profile = updatedProfile[1][0].toJSON();

        res.status(200).json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete Profile
profileRoutes.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const deletedCount = await Profile.destroy({
            where: { id: req.params.id },
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ message: "Profile deleted Successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get Profile by ID
profileRoutes.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const getProfile = await Profile.findByPk(req.params.id);

        if (!getProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const profile = getProfile.toJSON();

        res.status(200).json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get All Profiles
profileRoutes.get("/", verifyTokenAndAuthorization, async (req, res) => {
    const { new: isNew } = req.query;

    try {
        const profiles = isNew
            ? await Profile.findAll({ limit: 1, order: [['createdAt', 'DESC']] })
            : await Profile.findAll();

        res.status(200).json(profiles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Create Profile
profileRoutes.post('/', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const existingProfile = await Profile.findOne({
            where: { code: req.body.code.toUpperCase(), countryId: req.body.countryId }
        });

        if (existingProfile) {
            return res.status(409).json({ error: "Profile Code Already Exists with this country" });
        }

        const newProfile = await Profile.create({
            name: req.body.name.toLowerCase(),
            code: req.body.code.toUpperCase(),
            countryId: req.body.countryId,
        });

        res.status(201).json(newProfile.toJSON());

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


export default profileRoutes;