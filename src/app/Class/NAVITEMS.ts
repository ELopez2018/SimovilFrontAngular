import { MenuItem } from './menu-item';

export const NAVITEMS: MenuItem[] = [
    {
        DESCRIPCION: 'Administrador-',
        ICONO: 'fa fa-cogs fa-fw',
        HIJO: [
            {
                DESCRIPCION: 'Usuario',
                ICONO: 'fas fa-users fa-fw',
                URL: '/user'
            }
        ]
    }, {
        DESCRIPCION: 'Administrativa-',
        ICONO: 'fas fa-chart-pie fa-fw',
        URL: '/administrative'
    }, {
        DESCRIPCION: 'Empleados',
        ICONO: 'fas fa-users fa-fw',
        URL: '/employee'
    }, {
        DESCRIPCION: 'Incapacidades',
        ICONO: 'fas fa-exclamation-circle fa-fw',
        URL: '/disability'
    }, {
        DESCRIPCION: 'Turnos',
        ICONO: 'fa fa-calendar fa-fw',
        URL: '/turnos'
    }, {
        DESCRIPCION: 'Registro de asistencia',
        ICONO: 'fa fa-calendar-check-o fa-fw',
        URL: '/logorder'
    }, {
        DESCRIPCION: 'Anticipos pendientes',
        ICONO: 'fas fa-hand-holding-usd fa-fw',
        URL: '/pendingAdvances'
    }, {
        DESCRIPCION: 'Facturas pendientes',
        ICONO: 'fas fa-file-invoice-dollar fa-fw',
        URL: '/pendingInvoices'
    }, {
        DESCRIPCION: 'Estación',
        ICONO: 'fas fa-gas-pump fa-fw',
        URL: '/station'
    }, {
        DESCRIPCION: 'Pagos',
        ICONO: 'fas fa-hand-holding-usd fa-fw',
        URL: '/payments2'
    }, {
        DESCRIPCION: 'Cartera',
        ICONO: 'fa fa-shopping-bag fa-fw',
        HIJO: [
            {
                DESCRIPCION: 'Clientes',
                ICONO: 'fa fa-user fa-fw',
                URL: '/client'
            },
            {
                DESCRIPCION: 'Cupos',
                ICONO: 'fa fa-credit-card fa-fw',
                URL: '/cupo/new'
            },
            {
                DESCRIPCION: 'Vehículos',
                ICONO: 'fas fa-car fa-fw',
                URL: '/vehicle'
            },
            {
                DESCRIPCION: 'Cuentas de cobro',
                ICONO: 'fas fa-hand-holding-usd fa-fw',
                URL: '/receivable'
            },
            {
                DESCRIPCION: 'Pagos',
                ICONO: 'fa fa-money fa-fw',
                URL: '/payment'
            }
        ]
    }, {
        DESCRIPCION: 'Contabilidad',
        ICONO: 'fas fa-balance-scale fa-fw',
        HIJO: [
            {
                DESCRIPCION: 'Anticipos',
                ICONO: 'fas fa-hand-holding-usd fa-fw',
                URL: '/advance'
            },
            {
                DESCRIPCION: 'Facturas',
                ICONO: 'fas fa-file-invoice-dollar fa-fw',
                URL: '/invoice'
            },
            {
                DESCRIPCION: 'Proveedores',
                ICONO: 'fas fa-users fa-fw',
                URL: '/provider'
            },
        ]
    }, {
        DESCRIPCION: 'Auditoría',
        ICONO: 'fa fa fa-search-plus fa-fw',
        URL: '/audit'
    }, {
        DESCRIPCION: 'Informes',
        ICONO: 'fa fa fa-bar-chart fa-fw',
        URL: '/report'
    }, {
        DESCRIPCION: 'Mi cuenta',
        ICONO: 'fas fa-home fa-fw',
        URL: '/account'
    }, {
        DESCRIPCION: 'Cambiar contraseña',
        ICONO: 'fas fa-key fa-fw',
        URL: '/updatepass'
    }, {
      DESCRIPCION: 'Nomina',
      ICONO: 'fas fa-id-card fa-fw',
      URL: '/nominas'
    }
];
