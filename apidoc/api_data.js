define({ "api": [
  {
    "type": "get",
    "url": "/api/invoice/:id",
    "title": "Actualiza Una Factura",
    "name": "Actualizar",
    "group": "Factura",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>Numero registro  de la planilla.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\" => true,\n    \"message\" => \"Terminos y condiciones Registrados\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/invoice.js",
    "groupTitle": "Factura"
  },
  {
    "type": "post",
    "url": "/api/invoice",
    "title": "Crea Una Factura",
    "name": "Crear",
    "group": "Factura",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>Numero registro  de la planilla.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\" => true,\n    \"message\" => \"Terminos y condiciones Registrados\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/invoice.js",
    "groupTitle": "Factura"
  },
  {
    "type": "get",
    "url": "/api/invoice",
    "title": "Mostrar todas las facturas",
    "name": "Mostrar",
    "group": "Factura",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>Numero registro  de la planilla.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "num",
            "description": "<p>Numero registro  de la planilla.</p>"
          },
          {
            "group": "Parameter",
            "type": "BigInt",
            "optional": false,
            "field": "proveedor",
            "description": "<p>Numero registro  de la planilla.</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "estado",
            "description": "<p>Numero registro  de la planilla.</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "station",
            "description": "<p>Numero registro  de la planilla.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "fechaIni",
            "description": "<p>Numero registro  de la planilla.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "fechaFin",
            "description": "<p>Numero registro  de la planilla.</p>"
          },
          {
            "group": "Parameter",
            "type": "Bit",
            "optional": false,
            "field": "aprox",
            "description": "<p>Numero registro  de la planilla.</p>"
          },
          {
            "group": "Parameter",
            "type": "Decimal",
            "size": "15,3",
            "optional": false,
            "field": "val",
            "description": "<p>Numero registro  de la planilla.</p>"
          },
          {
            "group": "Parameter",
            "type": "Bit",
            "optional": false,
            "field": "novedad",
            "description": "<p>Numero registro  de la planilla.</p>"
          },
          {
            "group": "Parameter",
            "type": "Bit",
            "optional": false,
            "field": "historial",
            "description": "<p>Numero registro  de la planilla.</p>"
          },
          {
            "group": "Parameter",
            "type": "Bit",
            "optional": false,
            "field": "articulo",
            "description": "<p>Numero registro  de la planilla.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\" => true,\n    \"message\" => \"Terminos y condiciones Registrados\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/invoice.js",
    "groupTitle": "Factura"
  },
  {
    "type": "delete",
    "url": "/api/dailySheet",
    "title": "Borrar",
    "name": "DeletedailySheet",
    "group": "Planilla_Diaria",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "Id",
            "description": "<p>Numero de registro de la planilla.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\" => true,\n    \"message\" => \"Terminos y condiciones Registrados\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/dailySheet.js",
    "groupTitle": "Planilla_Diaria"
  },
  {
    "type": "post",
    "url": "/api/dailySheet",
    "title": "Actualizar",
    "name": "UpdatedailySheet",
    "group": "Planilla_Diaria",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>Numero registro  de la planilla.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\" => true,\n    \"message\" => \"Terminos y condiciones Registrados\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/dailySheet.js",
    "groupTitle": "Planilla_Diaria"
  }
] });
