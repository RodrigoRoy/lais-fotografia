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
		referenciaProcedencia: {type: String},
		titulo: {
			autor: {type: String},
			inscrito: {type: String},
			otroObjeto: {type: String}
		},
		fecha: {type: Date},
		autores: [{ // Lista de fotógrafos, editores, productores y/o comitentes.
			tipo: {type: String, enum: ['Comitente', 'Productor', 'Editor', 'Fotógrafo']},
			nombre: {type: String}
		}],
		conjuntoPertenencia: {type: String} //{type: Schema.Types.ObjectId, ref: 'ConjuntoDocumental'}
	},
	contenidoEstructura: {
		estructuraFormal: {type: String}, // enum: ['Paisaje', 'Paisaje rural', 'Paisaje urbano', 'Paisaje industrial', 'Roster', 'Escena', 'Retrato', 'Monumento arqueológico', 'Arquitectura']
		encuadre: {
			orientacion: {type: String, enum: ['Horizontal', 'Vertical']},
			plano: {type: String, enum: ['Gran plano general', 'Plano general', 'Plano entero', 'Plano americano', 'Plano medio', 'Primer plano', 'Detalle']},
			anguloCamara: {type: String, enum: ['Normal', 'Picado', 'Contrapicado', 'Nadir', 'Cenital']},
			nivelCamara: {type: String, enum: ['A nivel', 'Bajo', 'Alto']},
			tipoCamara: {type: String},
			edicionImagen: {type: String}
		},
		descripcion: {type: String},
		tomadaDesde: {type: String},
		tomadaHacia: {type: String},
		lugarDescrito: {type: String} // Google Maps ID 
	},
	caracteristicasFisicas: {
		tipo: {type: String, enum: ['Positivo', 'Negativo', 'Imagen de cámara']},
		soportePrimario: {
			procesoFotografico: {type: String},
			dimension: {
				x: {type: Number},
				y: {type: Number},
				unidad: {type: String, enum: ['cm', 'in']} // NUEVO
			},
			inscripciones: {
				ubicacion: {type: String},
				transcripcion: {type: String}
			}
		},
		soporteSecundario: {
			materiales: {type: String},
			dimension: {
				ancho: {type: Number},
				alto: {type: Number},
				unidad: {type: String, enum: ['cm', 'in']} // NUEVO
			},
			inscripciones: {
				ubicacion: {type: String},
				transcripcion: {type: String}
			}
		},
		sellos: {
			ubicacion: {type: String},
			transcripcion: {type: String}
		}
	},
	documentacionAsociada: {
		fotografiaMismoNegativo: {type: String},
		fotografiaBase: {type: String},
		reprografia: {type: String},
		fotografiaMismaSecuencia: {type: String},
		fotografiaConsecutiva: {type: String},
		fotografiaConsecutivaOtraCamara: {type: String},
		fotografiaEncuadreSimilar: {type: String},
		grabadoRelacionado: {type: String}
	},
	publicaciones: {
		publicacion: {type: String},
		exposicion: {type: String}
	},
	controlDescripcion: {
		documentalistas: [{type: String}], //[{type: Schema.Types.ObjectId, ref: 'Usuario'}] // INFERIDO
		//actualizacionDescripcion: {type: Date} // IMPLÍCITO
	},
	adicional:{
		isPublic: {type: Boolean, default: true}
	}
}, { // Opciones:
	collection: 'unidadDocumental',
	timestamps: true //timestamps: {createdAt: 'creacion', updatedAt: 'actualizacion'}
});

// exportar el modelo "UnidadDocumental"
// module.exports permite pasar el modelo a otros archivos cuando es llamado
module.exports = mongoose.model('UnidadDocumental', UnidadDocumentalSchema);