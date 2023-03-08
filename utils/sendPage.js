import path from 'path';
import url from 'url';

const filename = url.fileURLToPath(import.meta.url);
export const rootDir = path.dirname( filename ).split( '/' ).slice( 0, -1 ).join( '/' );

export const sendPage = ( res, dir, htmlFile ) => res.sendFile( path.join( rootDir, dir, htmlFile ) )
