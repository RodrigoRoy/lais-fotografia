/*
Define el modelo de la colección unidadDocumental
*/

// Dependencias
var mongoose = require('mongoose'); // controlador de la base de datos
var Schema = mongoose.Schema; // "Modelo" de la colección

// Definición del esquema "Unidad documental":
var UnidadDocumentalSchema = new Schema({
	identificacion: {
		codigoReferencia: {type: String, required: true, index: {unique: true}},
		referenciaProcedencia: {type: String, trim: true},
		titulo: {
			archivoProcedencia: {type: String, trim: true},
			inscrito: {type: String, trim: true},
			otroObjeto: {type: String, trim: true}
		},
		fecha: {type: Date},
		autores: [{ // Lista de fotógrafos, editores, productores y/o comitentes.
			tipo: {type: String, enum: ['Comitente', 'Productor', 'Editor', 'Fotógrafo', 'Impresor', 'Taller de imprenta', 'Dibujante', 'Dirección', 'Responsable', 'Levantamiento', 'Litógrafo', 'Grabador']},
			nombre: {type: String, trim: true},
			_id: false
		}],
		conjuntoPertenencia: {type: String} //{type: Schema.Types.ObjectId, ref: 'ConjuntoDocumental'}
	},
	estructuraContenido: {
		estructuraFormal: {type: String, trim: true}, // enum: ['Paisaje', 'Paisaje rural', 'Paisaje urbano', 'Paisaje industrial', 'Roster', 'Escena', 'Retrato', 'Monumento arqueológico', 'Arquitectura']
		encuadre: {
			orientacion: {type: String, enum: ['Horizontal', 'Vertical']},
			plano: {type: String, enum: ['Gran plano general', 'Plano general', 'Plano entero', 'Plano americano', 'Plano medio', 'Primer plano', 'Detalle']},
			anguloCamara: {type: String, enum: ['Normal', 'Picado', 'Contrapicado', 'Nadir', 'Cenital']},
			nivelCamara: {type: String, enum: ['A nivel', 'Bajo', 'Alto']},
			tipoCamara: {type: String, trim: true},
			edicionImagen: {type: String, trim: true}
		},
		descripcion: {type: String, trim: true},
		tomadaDesde: {type: String, trim: true},
		tomadaHacia: {type: String, trim: true},
		lugarDescrito: {type: String} // Google Maps ID 
	},
	caracteristicasFisicas: {
		tipo: {type: String, enum: ['Positivo', 'Negativo', 'Imagen digital', 'Imagen de cámara', 'Pintura', 'Grabado', 'Litografía', 'Reprografía', 'Fotomecánico', 'Transparencia']},
		soportePrimario: {
			materiales: {type: String, trim: true},
			dimension: {
				ancho: {type: Number},
				alto: {type: Number},
				unidad: {type: String, enum: ['cm', 'in']}
			},
			inscripciones: [{
				transcripcion: {type: String, trim: true},
				ubicacion: {type: String, trim: true},
				_id: false
			}]
		},
		soporteSecundario: {
			materiales: {type: String, trim: true},
			dimension: {
				ancho: {type: Number},
				alto: {type: Number},
				unidad: {type: String, enum: ['cm', 'in']}
			},
			inscripciones: [{
				transcripcion: {type: String, trim: true},
				ubicacion: {type: String, trim: true},
				_id: false
			}]
		},
		sellos: [{
			transcripcion: {type: String, trim: true},
			ubicacion: {type: String, trim: true},
			_id: false
		}]
	},
	documentacionAsociada: {
		fotografiaMismoNegativo: [{type: String, trim: true}],
		fotografiaBase: [{type: String, trim: true}],
		reprografia: [{type: String, trim: true}],
		fotografiaMismaSecuencia: [{type: String, trim: true}],
		fotografiaConsecutiva: [{type: String, trim: true}],
		fotografiaConsecutivaOtraCamara: [{type: String, trim: true}],
		fotografiaEncuadreSimilar: [{type: String, trim: true}],
		grabadoRelacionado: [{type: String, trim: true}]
	},
	publicaciones: {
		publicacion: [{type: String, trim: true}],
		exposicion: [{type: String, trim: true}]
	},
	notas: {
		notas: {type: String, trim: true}
	},
	controlDescripcion: {
		documentalistas: [{type: String}], //[{type: Schema.Types.ObjectId, ref: 'Usuario'}] // INFERIDO
		//actualizacionDescripcion: {type: Date} // IMPLÍCITO
	},
	adicional:{
		imagen: {type: String}, // Referencia nombre de la imagen
		isPublic: {type: Boolean, default: true}
	}
}, { // Opciones:
	collection: 'unidadDocumental',
	timestamps: true //timestamps: {createdAt: 'creacion', updatedAt: 'actualizacion'}
});

// exportar el modelo "UnidadDocumental"
// module.exports permite pasar el modelo a otros archivos cuando es llamado
module.exports = mongoose.model('UnidadDocumental', UnidadDocumentalSchema);