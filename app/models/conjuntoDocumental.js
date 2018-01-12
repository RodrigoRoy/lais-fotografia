/*
Define el modelo de la colección ConjuntoDocumental
*/

// Dependencias
var mongoose = require('mongoose'); // controlador de la base de datos
var Schema = mongoose.Schema; // "Modelo" de la colección

// Definición del esquema "Conjunto documental":
var ConjuntoDocumentalSchema = new Schema({
	identificacion: {
		codigoReferencia: {type: String, required: true, index: {unique: true}},
		institucion: {type: String},
		titulo: {type: String, required: true},
		fecha: {
			ingreso: {type: Date},
			manufactura: {type: Date}
		},
		lugar: [{type: String}], // Google Maps ID, INFERIDO
		productor: {type: String},
		autores: [{ // Lista de fotógrafos, editores, productores y/o comitentes.
			tipo: {type: String, enum: ['Comitente', 'Productor', 'Editor', 'Fotógrafo']},
			nombre: {type: String}
		}],
		nivelDescripcion: {type: String, enum: ['Fondo', 'Subfondo', 'Colección', 'Serie', 'Subserie', 'Unidad documental compuesta', 'Expediente', 'Grupo']},
		cantidad: {type: Number, min: 0}, // INFERIDO
		soporte: {type: String}, // INFERIDO
		conjuntoPertenencia: {type: String} //{type: Schema.Types.ObjectId, ref: 'ConjuntoDocumental'}
	},
	contexto: {
		historiaDocumento: {type: String},
		historiaArchivistica: {type: String},
		formaIngreso: {type: String} // enum: [Reproducciones, Préstamos, Donaciones, Compra, Intercambio, etc]
	},
	contenidoOrganizacion: {
		contenido: {type: String},
		valoracionSeleccionEliminacion: {type: String},
		nuevosIngresos: {type: String},
		organizacion: {type: String}
	},
	condicionesAcceso: {
		condicionesAcceso: {type: String},
		condicionesReproduccion: {type: String},
		caracteristicasFisicas: {type: String},
		estadoConservacion: {type: String}
	},
	documentacionAsociada: {
		serieFotograficaIgualManufactura: {type: String},
		registrosBase: {type: String},
		reprografias: {type: String},
		grabadosRelacionados: {type: String}
	},
	publicaciones: { // INFERIDO?
		publicacion: {type: String},
		exposicion: {type: String}
	},
	controlDescripcion: {
		documentalistas: [{type: String}], //[{type: Schema.Types.ObjectId, ref: 'Usuario'}] // INFERIDO
		reglasNormas: {type: String, defualt: 'LAIS, Lineamientos para la descripción de fotografías, 2011'},
		//actualizacionDescripcion: {type: Date} // IMPLÍCITO
	}

}, { // Opciones:
	collection: 'conjuntoDocumental',
	timestamps: true //timestamps: {createdAt: 'creacion', updatedAt: 'actualizacion'}
});

// exportar el modelo "ConjuntoDocumental"
// module.exports permite pasar el modelo a otros archivos cuando es llamado
module.exports = mongoose.model('ConjuntoDocumental', ConjuntoDocumentalSchema);