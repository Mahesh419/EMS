import mongoose from "mongoose";
import IEmployee from "../types/IEmployee";

const schema = new mongoose.Schema<IEmployee>(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        preferredName: {
            type: String,
            required: true,
            trim: true,
        },
        gender: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        designation: {
            type: String,
            required: true,
            trim: true,
        },
        workEmail: {
            type: String,
            required: true,
            trim: true,
        },
        workPhone: {
            type: String,
            required: true,
            trim: true,
        },
        linkedinProfile: {
            type: String,
            required: true,
            trim: true,
        },
        profilePicture: {
            data: Buffer,
            contentType: String,
            required: false
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IEmployee>('employees', schema);