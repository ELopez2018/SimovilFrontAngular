export class Parametros {
    servidorPrincipal: string;
    servidorLocal: string;

    static GetParametros() {
        let item = null;
        // var ruta = window.location.href.split('/')[2];
        // switch (ruta) {
        //     case 'simovil.mileniumgas.com':
        //         item = {
        //             servidorLocal: "https://simovil.mileniumgas.com:8080",
        //             servidorPrincipal: "https://192.168.10.155:8080"
        //         }
        //         break;
        //     default:
        //         item = {
        //             servidorLocal: "https://192.168.10.155:8080",
        //             servidorPrincipal: "https://192.168.10.155:8080"
        //         }
        //         break;
        // }
        item = {
            // servidorLocal: 'https://192.168.10.155:8080',
            servidorLocal: 'https://simovil.mileniumgas.com:8080',
            servidorPrincipal: 'https://192.168.10.155:8080'
        };
        return item;
    }
}
