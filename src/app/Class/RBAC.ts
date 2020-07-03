export const RBAC: any[] = [
    {
        rol: 'Administrador',
        url: [
            '/logorder',
            '/administrative',
            '/employee',
            '/disability',
            '/turnos',
            '/welcome',
            '/cartera',
            '/client',
            '/cupo',
            '/vehicle',
            '/report',
            '/payment',
            '/payments2',
            '/audit',
            '/receivable',
            '/account',
            '/updatepass',
            '/administrator',
            '/user',
            '/user/search',
            '/contabilidad',
            '/invoice',
            '/pendingInvoices',
            '/pendingAdvances',
            '/advance',
            '/provider',
            '/reception',
            '/station'
        ]
    }
    ,
    {
        rol: 'Gestion Humana',
        url: [
            '/logorder',
            '/employee',
            '/disability',
            '/turnos',
            '/welcome',
            '/updatepass'
        ]
    }
    ,
    {
        rol: 'Tesoreria',
        url: [
            '/welcome',
            '/pendingInvoices',
            '/pendingAdvances',
            '/invoice/search',
            '/invoice/novelty',
            '/invoice/history',
            '/advance',
            '/updatepass'
        ]
    }
    ,
    {
        rol: 'Cartera',
        url: [
            '/welcome',
            '/employee/search',
            '/employee/novelty/search',
            '/disability/search',
            '/disability/payment/search',
            '/disability/pending',
            '/cartera',
            '/client',
            '/cupo',
            '/vehicle',
            '/report',
            '/payment',
            '/receivable',
            '/updatepass'
        ]
    }
    ,
    {
        rol: 'Auditoria',
        url: [
            '/welcome',
            '/cartera',
            '/client',
            '/cupo',
            '/payment',
            '/receivable',
            '/updatepass',
            '/contabilidad',
            '/invoice/search',
            '/invoice/novelty',
            '/invoice/history',
            '/pendingInvoices'
        ]
    }
    ,
    {
        rol: 'Administrativa',
        url: [
            '/welcome',
            '/cartera',
            '/client',
            '/cupo',
            '/report',
            '/audit',
            '/receivable',
            '/updatepass',
            '/contabilidad',
            '/invoice/search',
            '/invoice/novelty',
            '/invoice/history',
            // '/pendingInvoices',
            // '/pendingAdvances',
            '/advance/search',
            '/advance/novelty',
            '/advance/history',
            '/administrative'
        ]
    }
    ,
    {
        rol: 'Operacion',
        url: [
            '/welcome',
            '/cartera',
            '/client',
            '/cupo',
            '/report',
            '/payment',
            '/receivable',
            '/updatepass',
            '/contabilidad',
            '/invoice/search',
            '/invoice/novelty',
            '/invoice/history',
            '/pendingInvoices',
            '/operation'
        ]
    }
    ,
    {
        rol: 'Estacion',
        url: [
            '/welcome',
            '/employee/search',
            '/employee/novelty',
            '/turnos',
            '/payments2',
            '/receivable',
            '/updatepass',
            '/station',
            '/contabilidad',
            '/invoice',
            '/pendingInvoices'
        ]
    }
    ,
    {
        rol: 'Mercadeo',
        url: [
            '/welcome',
            '/updatepass'
        ]
    }
    ,
    {
        rol: 'Cliente',
        url: [
            '/welcome',
            '/account',
            '/updatepass'
        ]
    }
    ,
    {
        rol: 'Contabilidad',
        url: [
            '/welcome',
            '/contabilidad',
            '/invoice/search',
            '/invoice/novelty',
            '/invoice/history',
            '/updatepass',
            '/provider',
            '/pendingInvoices'
        ]
    }
    ,
    {
        rol: 'Recepcion',
        url: [
            '/welcome',
            '/contabilidad',
            '/pendingInvoices',
            '/invoice',
            '/updatepass'
        ]
    }]
