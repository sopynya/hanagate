import { auth } from '@/lib/server';

export default auth.middleware({
    loginUrl: '/auth/login',
});

export const config = {
    matcher: [
        '/account/:path*',
    ],
};