export class EntProductosTraslados {
    public id: number;
    public IdProducto: number;
    public FechaEnvio: Date;
    public EstacionEnvia: string;
    public codContable: string;
    public descripcion: string;
    public idUsuarioEnvia: string;
    public IdEstacionEnvia: number;
    public ObservacionesEnvia: string;
    public Cantidad: number;
    public idEstacionRecibe: number;
    public FechaRecibido: Date;
    public idUsuarioRecibe: string;
    public observacionesRecibe: string;
    public Nuevo: boolean;
}
