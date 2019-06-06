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
		institucion: {type: String, trim: true},
		titulo: {type: String, trim: true, required: true},
		// fecha: { // fecha de manufactura // INFERIDO
		// 	inicio: {type: Date},
		// 	fin: {type: Date} // En caso de ser un periodo
		//	aproximada: {type: Boolean} // En caso de incluir fechas aproximadas
		// },
		// lugarDescrito: [{ // INFERIDO (Google Maps style)
		// 	placeId: {type: String},
		// 	location: {
		// 		lat: {type: Number},
		// 		lng: {type: Number},
		// 		_id: false
		// 	},
		// 	formattedAddress: {type: String},
		// 	_id: false
		// }],
		productor: {type: String, trim: true},
		autores: [{ // Lista de fotógrafos, editores, productores y/o comitentes.
			tipo: {type: String, enum: ['Comitente', 'Productor', 'Editor', 'Fotógrafo', 'Impresor', 'Taller de imprenta', 'Dibujante', 'Dirección', 'Responsable', 'Levantamiento', 'Litógrafo']},
			nombre: {type: String, trim: true},
			_id: false
		}],
		nivelDescripcion: {type: String, enum: ['Fondo', 'Subfondo', 'Colección', 'Serie', 'Subserie', 'Unidad documental compuesta', 'Expediente', 'Grupo']},
		// cantidad: {type: Number, min: 0}, // INFERIDO
		// soporte: {type: String}, // INFERIDO
		// conjuntoPertenencia: {type: String} //{type: Schema.Types.ObjectId, ref: 'ConjuntoDocumental'} // INFERIDO
	},
	contexto: {
		historiaInstitucionalBiografica: {type: String, trim: true},
		historiaArchivoProcedencia: {type: String, trim: true},
		formaIngreso: [{type: String, trim: true}] // enum: [Producción propia, Reproducciones, Préstamos, Donaciones, Compra, Intercambio, etc]
	},
	estructuraContenido: {
		alcanceContenido: {type: String, trim: true},
		valoracionSeleccionEliminacion: {type: String, trim: true},
		nuevosIngresos: {type: String, trim: true},
		organizacion: {type: String, trim: true}
	},
	condicionesAcceso: {
		condicionesAcceso: {type: String, trim: true},
		condicionesReproduccion: {type: String, trim: true},
		caracteristicasFisicas: {type: String, trim: true},
		estadoConservacion: {type: String, trim: true}
	},
	documentacionAsociada: {
		serieFotograficaIgualManufactura: {type: String, trim: true},
		registrosBase: {type: String, trim: true},
		reprografias: {type: String, trim: true},
		grabadosRelacionados: {type: String, trim: true}
	},
	publicaciones: {
		publicacion: {type: String, trim: true},
		exposicion: {type: String, trim: true}
	},
	notas: {
		notas: {type: String, trim: true}
	},
	controlDescripcion: {
		// documentalistas: [{type: String}], //[{type: Schema.Types.ObjectId, ref: 'Usuario'}] // INFERIDO
		reglasNormas: {type: String, trim: true, default: 'LAIS, Lineamientos para la descripción de fotografías, 2011'},
		//actualizacionDescripcion: {type: Date} // IMPLÍCITO (updatedAt)
	},
	adicional:{
		imagen: {type: String}, // Referencia nombre de la imagen
		presentacion: {type: String} // Texto en formato HTML
	}
}, { // Opciones:
	collection: 'conjuntoDocumental',
	timestamps: true //timestamps: {createdAt: 'creacion', updatedAt: 'actualizacion'}
});

// Indexar todos los campos de string para habilitar búsqueda de texto. Indicar relevancia o pesos de atributos individuales:
ConjuntoDocumentalSchema.index({'$**': 'text'}, {name: 'textSearch', weights: {
	'identificacion.titulo': 8,
	'identificacion.autores.nombre': 5,
	'estructuraContenido.lugarDescrito.formattedAddress': 5,
	'estructuraContenido.alcanceContenido': 10,
	'publicaciones.publicacion': 4,
	'publicaciones.exposicion': 4,
	'notas.notas': 3,
	'adicional.presentacion': 5,
	// No es posible usar valores menores a 1.0:
	// 'identificacion.autores.tipo': 0.5,
	// 'estructuraContenido.lugarDescrito.placeId': 0,
	// 'caracteristicasFisicas.soportePrimario.dimension.unidad': 0.1,
	// 'caracteristicasFisicas.soporteSecundario.dimension.unidad': 0.1,
	// 'adicional.imagen': 0
}});

// exportar el modelo "ConjuntoDocumental"
// module.exports permite pasar el modelo a otros archivos cuando es llamado
module.exports = mongoose.model('ConjuntoDocumental', ConjuntoDocumentalSchema);
