import { Controller } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // API get list user in system

  // API get list project in system

  // API edit
}
