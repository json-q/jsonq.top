import * as shelljs from 'shelljs';
shelljs.cp('-R', '.env.local', 'dist');
