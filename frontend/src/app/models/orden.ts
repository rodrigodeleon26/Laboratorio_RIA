export class Orden {
    id?: number; // Opcional si se asigna en el backend
    fecha?: Date;
    estado?: string;
    importe?: number;
    panaderoId?: number | null; // Ajustar el tipo según tu modelo
    clienteId?: number;
    pedidos: any;
}
