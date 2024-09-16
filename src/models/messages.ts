import mongoose from 'mongoose';
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var messages = new Schema({
    encryptedMessage: { type: String },
    expiration: { type: Date },
    viewCount: { type: Number, default: 0 },
    maxViews: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.models.Messages || mongoose.model('Messages', messages);