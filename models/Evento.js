const { Schema, model } = require('mongoose');

const EventoSchema = Schema({

    title: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, // esto le dice a mongoose qye es una referencia
        ref: 'Usuario',
        required: true
    }
});

EventoSchema.method('toJSON', function(){
    const {__v, _id, ...object}  = this.toObject();

    object.id = _id;

    return object;
});

module.exports = model('Evento', EventoSchema);