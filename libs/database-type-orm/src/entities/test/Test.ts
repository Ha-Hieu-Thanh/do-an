import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('test')
export default class TestTest { 
    @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
    id: number;

    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: string;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: string;
}