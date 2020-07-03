export class EntProductosSoliciBaja {
    public id: number;
    public Estacion: string;
    public idEstacion: number;
    public idProducto: number;
    public codContable: string;
    public Producto: string;
    public cantidad: number;
    public Motivo: string;
    public Operaciones: boolean;
    public Auditoria: boolean;
    public Contabilidad: boolean;
    public Fecha: Date;
    constructor(id: number,
        idEstacion: number,
        codContable: string,
        Estacion: string,
        idProducto: number,
        Producto: string,
        cantidad: number,
        Motivo: string,
        Operaciones: boolean,
        Auditoria: boolean,
        Contabilidad: boolean,
        Fecha: Date
    ) {
        this.id = id;
        this.idEstacion = idEstacion;
        this.Estacion = Estacion;
        this.idProducto = idProducto;
        this.Producto = Producto;
        this.cantidad = cantidad;
        this.Motivo = Motivo;
        this.Operaciones = Operaciones;
        this.Auditoria = Auditoria;
        this.Contabilidad = Contabilidad;
        this.Fecha = Fecha;
        this.codContable = codContable;
    }
}
