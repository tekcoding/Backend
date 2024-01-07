import auth from './auth/auth.route.js';
import admin from './admin/admin.route.js';
import certificate from './certificate/certificate.route.js';

export function v1routes(app) {
    // ADMIN
    app.use('/api/v1/admin', admin);
    // USER
    app.use('/api/v1/auth', auth);
    app.use('/api/v1/certificate', certificate);
}
