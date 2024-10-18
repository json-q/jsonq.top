import { SetMetadata } from '@nestjs/common';
import { CONTROL_AUTH } from './constants';

export const ControlAuth = (...args: string[]) => SetMetadata(CONTROL_AUTH, args);
